import "./style.css"
import { briefingPicks, fmtPct, premiumPct, sortByAbsGap } from "./lib/prestocks.js"

/**
 * PreStocks Board — thin Stocklana MVP
 * Data: free public API https://prestocks.com/api/prestocks
 * $0 capital: static Vite app, no paid APIs, no mainnet deploy.
 */

const API_URL = 'https://prestocks.com/api/prestocks'
/** Same-origin snapshot (CORS-safe on GitHub Pages). Refreshed by CI. */
const LOCAL_URL = './prestocks.json'
const SOLSCAN_TOKEN = (mint) => `https://solscan.io/token/${mint}`
const REFRESH_MS = 60_000

const app = document.querySelector('#app')
let lastSorted = []
let filterQuery = ''

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
      <div class="toolbar">
        <label class="sr-only" for="filter">Filter PreStocks</label>
        <input id="filter" class="filter" type="search" placeholder="Filter by name or symbol…" value="${escapeHtml(filterQuery)}" autocomplete="off" />
        <span class="muted" id="count"></span>
      </div>
      <div id="board" class="board" role="list">${cardsHtml}</div>
    </main>

    <footer class="foot">
      <p>Data from the free public <a href="https://prestocks.com/api/prestocks" rel="noopener" target="_blank">PreStocks API</a>. Not financial advice.</p>
      <p class="latam">Desde La Habana / LATAM — construyendo stocks on-chain sin capital de despliegue.</p>
      <p class="muted">Stocklana · PreStocks track · ${updatedAt ? `Updated ${updatedAt}` : '—'}</p>
    </footer>
  `

  document.querySelector('#refresh')?.addEventListener('click', () => load(true))
  const filter = document.querySelector('#filter')
  filter?.addEventListener('input', () => {
    filterQuery = filter.value || ''
    paintBoard(lastSorted)
  })
  paintBoard(lastSorted)
}

function matchesFilter(item, q) {
  if (!q) return true
  const needle = q.trim().toLowerCase()
  if (!needle) return true
  return `${item.name || ''} ${item.symbol || ''}`.toLowerCase().includes(needle)
}

function paintBoard(sorted) {
  lastSorted = sorted || []
  const board = document.querySelector('#board')
  const count = document.querySelector('#count')
  if (!board) return
  const filtered = lastSorted.filter((item) => matchesFilter(item, filterQuery))
  board.innerHTML = filtered.length
    ? filtered.map(card).join('')
    : `<p class="empty">No PreStocks match “${escapeHtml(filterQuery)}”.</p>`
  if (count) count.textContent = lastSorted.length
    ? `${filtered.length} / ${lastSorted.length} shown`
    : ''
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
  const { biggestPremium, biggestDiscount } = briefingPicks(sorted)
  if (!biggestPremium || !biggestDiscount) return ''
  return `<section class="brief" aria-label="Agent briefing">
    <strong>Agent briefing</strong>
    <span>Biggest premium: <em>${escapeHtml(biggestPremium.item.symbol)}</em> ${fmtPct(biggestPremium.pct)}</span>
    <span>Biggest discount: <em>${escapeHtml(biggestDiscount.item.symbol)}</em> ${fmtPct(biggestDiscount.pct)}</span>
    <span class="muted">Sort is by |gap| — outliers first for quarantine-style attention.</span>
  </section>`
}

function skeletonCards(n = 6) {
  return Array.from({ length: n }, () => `<div class="card skeleton" aria-hidden="true"></div>`).join('')
}

let timer = null

async function fetchJson(url) {
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  if (!Array.isArray(data)) throw new Error('Unexpected API shape')
  return data
}

async function load(manual = false) {
  const statusEl = document.querySelector('#status')
  if (statusEl) statusEl.textContent = manual ? 'Refreshing…' : 'Loading…'

  let data = null
  let source = 'snapshot'
  try {
    data = await fetchJson(API_URL)
    source = 'live'
  } catch (_) {
    // prestocks.com does not send CORS headers — github.io must use same-origin snapshot
    data = await fetchJson(LOCAL_URL)
    source = 'snapshot'
  }

  try {
    const sorted = sortByAbsGap(data)
    lastSorted = sorted
    const now = new Date().toLocaleString('en-US', {
      timeZone: 'America/Havana',
      dateStyle: 'medium',
      timeStyle: 'short',
    }) + ' Havana'
    const label = source === 'live'
      ? `Live API · ${sorted.length} tokens`
      : `Synced snapshot · ${sorted.length} tokens`
    renderShell({
      statusHtml: `<span class="ok">${label}</span>`,
      cardsHtml: sorted.map(card).join(''),
      updatedAt: now,
      briefingHtml: briefing(sorted),
    })
  } catch (err) {
    renderShell({
      statusHtml: `<span class="err">Failed: ${escapeHtml(err.message || String(err))}</span>`,
      cardsHtml: `<p class="empty">Could not load PreStocks data (live API CORS-blocked; local snapshot missing). Try Refresh.</p>`,
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
