import "./style.css"

/**
 * PreStocks Board — thin Stocklana MVP
 * Data: free public API https://prestocks.com/api/prestocks
 * $0 capital: static Vite app, no paid APIs, no mainnet deploy.
 */

const API_URL = 'https://prestocks.com/api/prestocks'
const SOLSCAN_TOKEN = (mint) => `https://solscan.io/token/${mint}`
const REFRESH_MS = 60_000

const app = document.querySelector('#app')

function fmtUsd(n) {
  if (n == null || Number.isNaN(n)) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: n >= 100 ? 2 : 4,
  }).format(n)
}

function fmtCompact(n) {
  if (n == null || Number.isNaN(n)) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(n)
}

/** Premium (+) / discount (−) of tokenPrice vs markPrice */
function premiumPct(tokenPrice, markPrice) {
  if (!markPrice || markPrice === 0) return null
  return ((tokenPrice - markPrice) / markPrice) * 100
}

function fmtPct(p) {
  if (p == null || Number.isNaN(p)) return '—'
  const sign = p > 0 ? '+' : ''
  return `${sign}${p.toFixed(2)}%`
}

function shortMint(addr) {
  if (!addr || addr.length < 10) return addr || '—'
  return `${addr.slice(0, 4)}…${addr.slice(-4)}`
}

function renderShell({ statusHtml, cardsHtml, updatedAt, briefingHtml = "" }) {
  app.innerHTML = `
    <header class="top">
      <div class="brand">
        <span class="logo" aria-hidden="true">📈</span>
        <div>
          <h1>PreStocks Board</h1>
          <p class="tagline">Live pre-IPO marks vs on-chain token prices · Solana</p>
        </div>
      </div>
      <div class="meta">
        <span id="status" class="status">${statusHtml}</span>
        <button type="button" id="refresh" class="btn">Refresh</button>
      </div>
    </header>

    <main>
      <section class="legend" aria-label="How to read the board">
        <span><strong>Mark</strong> = reference private-company price</span>
        <span><strong>Token</strong> = PreStocks market price</span>
        <span><strong>Premium / discount</strong> = (token − mark) / mark</span>
      </section>
      ${briefingHtml || ''}
      <div id="board" class="board" role="list">${cardsHtml}</div>
    </main>

    <footer class="foot">
      <p>Data from the free public <a href="https://prestocks.com/api/prestocks" rel="noopener" target="_blank">PreStocks API</a>. Not financial advice.</p>
      <p class="latam">Desde La Habana / LATAM — construyendo stocks on-chain sin capital de despliegue.</p>
      <p class="muted">Stocklana · PreStocks track · ${updatedAt ? `Updated ${updatedAt}` : '—'}</p>
    </footer>
  `

  document.querySelector('#refresh')?.addEventListener('click', () => load(true))
}

function card(item) {
  const pct = premiumPct(item.tokenPrice, item.markPrice)
  const tone = pct == null ? 'flat' : pct > 0.5 ? 'prem' : pct < -0.5 ? 'disc' : 'flat'
  const img = item.image
    ? `<img class="thumb" src="${item.image}" alt="" width="40" height="40" loading="lazy" onerror="this.style.display='none'" />`
    : `<div class="thumb placeholder">${(item.symbol || '?').slice(0, 2)}</div>`
  const link = item.contract_address
    ? `<a class="mint" href="${SOLSCAN_TOKEN(item.contract_address)}" target="_blank" rel="noopener" title="${item.contract_address}">${shortMint(item.contract_address)} ↗</a>`
    : `<span class="mint muted">no mint</span>`
  const ext = item.external_url
    ? `<a class="ext" href="${item.external_url}" target="_blank" rel="noopener">PreStocks</a>`
    : ''

  return `
    <article class="card" role="listitem" data-symbol="${item.symbol || ''}">
      <div class="card-head">
        ${img}
        <div class="titles">
          <h2>${escapeHtml(item.name || item.symbol || 'Unknown')}</h2>
          <div class="sym-row">
            <span class="sym">${escapeHtml(item.symbol || '')}</span>
            ${ext}
          </div>
        </div>
        <div class="badge ${tone}" title="token vs mark">${fmtPct(pct)}</div>
      </div>
      <dl class="prices">
        <div><dt>Mark</dt><dd>${fmtUsd(item.markPrice)}</dd></div>
        <div><dt>Token</dt><dd>${fmtUsd(item.tokenPrice)}</dd></div>
        <div><dt>Mark val.</dt><dd>${fmtCompact(item.markValuation)}</dd></div>
        <div><dt>Implied val.</dt><dd>${fmtCompact(item.impliedValuation)}</dd></div>
      </dl>
      <div class="card-foot">${link}</div>
    </article>
  `
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}


function briefing(sorted) {
  if (!sorted.length) return ''
  const withPct = sorted
    .map((item) => ({ item, pct: premiumPct(item.tokenPrice, item.markPrice) }))
    .filter((x) => x.pct != null)
  if (!withPct.length) return ''
  const hi = withPct.reduce((a, b) => (b.pct > a.pct ? b : a))
  const lo = withPct.reduce((a, b) => (b.pct < a.pct ? b : a))
  return `<section class="brief" aria-label="Agent briefing">
    <strong>Agent briefing</strong>
    <span>Biggest premium: <em>${escapeHtml(hi.item.symbol)}</em> ${fmtPct(hi.pct)}</span>
    <span>Biggest discount: <em>${escapeHtml(lo.item.symbol)}</em> ${fmtPct(lo.pct)}</span>
    <span class="muted">Sort is by |gap| — outliers first for quarantine-style attention.</span>
  </section>`
}

function skeletonCards(n = 6) {
  return Array.from({ length: n }, () => `<div class="card skeleton" aria-hidden="true"></div>`).join('')
}

let timer = null

async function load(manual = false) {
  const statusEl = document.querySelector('#status')
  if (statusEl) statusEl.textContent = manual ? 'Refreshing…' : 'Loading…'

  try {
    const res = await fetch(API_URL, { cache: 'no-store' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    if (!Array.isArray(data)) throw new Error('Unexpected API shape')

    // Sort by absolute premium/discount so outliers float up
    const sorted = [...data].sort((a, b) => {
      const pa = Math.abs(premiumPct(a.tokenPrice, a.markPrice) || 0)
      const pb = Math.abs(premiumPct(b.tokenPrice, b.markPrice) || 0)
      return pb - pa
    })

    const now = new Date().toLocaleString('en-US', {
      timeZone: 'America/Havana',
      dateStyle: 'medium',
      timeStyle: 'short',
    }) + ' Havana'

    renderShell({
      statusHtml: `<span class="ok">Live · ${sorted.length} tokens</span>`,
      cardsHtml: sorted.map(card).join(''),
      updatedAt: now,
      briefingHtml: briefing(sorted),
    })
  } catch (err) {
    renderShell({
      statusHtml: `<span class="err">Failed: ${escapeHtml(err.message || String(err))}</span>`,
      cardsHtml: `<p class="empty">Could not reach PreStocks API. Check network / CORS and try Refresh.</p>`,
      updatedAt: null,
    })
  }
}

renderShell({
  statusHtml: 'Loading…',
  cardsHtml: skeletonCards(),
  updatedAt: null,
})
load()
timer = setInterval(() => load(false), REFRESH_MS)
