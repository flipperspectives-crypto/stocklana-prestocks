(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))a(e);new MutationObserver(e=>{for(const s of e)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&a(o)}).observe(document,{childList:!0,subtree:!0});function n(e){const s={};return e.integrity&&(s.integrity=e.integrity),e.referrerPolicy&&(s.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?s.credentials="include":e.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function a(e){if(e.ep)return;e.ep=!0;const s=n(e);fetch(e.href,s)}})();const h="https://prestocks.com/api/prestocks",y=t=>`https://solscan.io/token/${t}`,v=6e4,k=document.querySelector("#app");function m(t){return t==null||Number.isNaN(t)?"—":new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:t>=100?2:4}).format(t)}function f(t){return t==null||Number.isNaN(t)?"—":new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",notation:"compact",maximumFractionDigits:2}).format(t)}function i(t,r){return!r||r===0?null:(t-r)/r*100}function l(t){return t==null||Number.isNaN(t)?"—":`${t>0?"+":""}${t.toFixed(2)}%`}function b(t){return!t||t.length<10?t||"—":`${t.slice(0,4)}…${t.slice(-4)}`}function d({statusHtml:t,cardsHtml:r,updatedAt:n,briefingHtml:a=""}){var e;k.innerHTML=`
    <header class="top">
      <div class="brand">
        <span class="logo" aria-hidden="true">📈</span>
        <div>
          <h1>PreStocks Board</h1>
          <p class="tagline">Live pre-IPO marks vs on-chain token prices · Solana</p>
        </div>
      </div>
      <div class="meta">
        <span id="status" class="status">${t}</span>
        <button type="button" id="refresh" class="btn">Refresh</button>
      </div>
    </header>

    <main>
      <section class="legend" aria-label="How to read the board">
        <span><strong>Mark</strong> = reference private-company price</span>
        <span><strong>Token</strong> = PreStocks market price</span>
        <span><strong>Premium / discount</strong> = (token − mark) / mark</span>
      </section>
      ${a||""}
      <div id="board" class="board" role="list">${r}</div>
    </main>

    <footer class="foot">
      <p>Data from the free public <a href="https://prestocks.com/api/prestocks" rel="noopener" target="_blank">PreStocks API</a>. Not financial advice.</p>
      <p class="latam">Desde La Habana / LATAM — construyendo stocks on-chain sin capital de despliegue.</p>
      <p class="muted">Stocklana · PreStocks track · ${n?`Updated ${n}`:"—"}</p>
    </footer>
  `,(e=document.querySelector("#refresh"))==null||e.addEventListener("click",()=>u(!0))}function $(t){const r=i(t.tokenPrice,t.markPrice),n=r==null?"flat":r>.5?"prem":r<-.5?"disc":"flat",a=t.image?`<img class="thumb" src="${t.image}" alt="" width="40" height="40" loading="lazy" onerror="this.style.display='none'" />`:`<div class="thumb placeholder">${(t.symbol||"?").slice(0,2)}</div>`,e=t.contract_address?`<a class="mint" href="${y(t.contract_address)}" target="_blank" rel="noopener" title="${t.contract_address}">${b(t.contract_address)} ↗</a>`:'<span class="mint muted">no mint</span>',s=t.external_url?`<a class="ext" href="${t.external_url}" target="_blank" rel="noopener">PreStocks</a>`:"";return`
    <article class="card" role="listitem" data-symbol="${t.symbol||""}">
      <div class="card-head">
        ${a}
        <div class="titles">
          <h2>${c(t.name||t.symbol||"Unknown")}</h2>
          <div class="sym-row">
            <span class="sym">${c(t.symbol||"")}</span>
            ${s}
          </div>
        </div>
        <div class="badge ${n}" title="token vs mark">${l(r)}</div>
      </div>
      <dl class="prices">
        <div><dt>Mark</dt><dd>${m(t.markPrice)}</dd></div>
        <div><dt>Token</dt><dd>${m(t.tokenPrice)}</dd></div>
        <div><dt>Mark val.</dt><dd>${f(t.markValuation)}</dd></div>
        <div><dt>Implied val.</dt><dd>${f(t.impliedValuation)}</dd></div>
      </dl>
      <div class="card-foot">${e}</div>
    </article>
  `}function c(t){return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function S(t){if(!t.length)return"";const r=t.map(e=>({item:e,pct:i(e.tokenPrice,e.markPrice)})).filter(e=>e.pct!=null);if(!r.length)return"";const n=r.reduce((e,s)=>s.pct>e.pct?s:e),a=r.reduce((e,s)=>s.pct<e.pct?s:e);return`<section class="brief" aria-label="Agent briefing">
    <strong>Agent briefing</strong>
    <span>Biggest premium: <em>${c(n.item.symbol)}</em> ${l(n.pct)}</span>
    <span>Biggest discount: <em>${c(a.item.symbol)}</em> ${l(a.pct)}</span>
    <span class="muted">Sort is by |gap| — outliers first for quarantine-style attention.</span>
  </section>`}function P(t=6){return Array.from({length:t},()=>'<div class="card skeleton" aria-hidden="true"></div>').join("")}async function u(t=!1){const r=document.querySelector("#status");r&&(r.textContent=t?"Refreshing…":"Loading…");try{const n=await fetch(h,{cache:"no-store"});if(!n.ok)throw new Error(`HTTP ${n.status}`);const a=await n.json();if(!Array.isArray(a))throw new Error("Unexpected API shape");const e=[...a].sort((o,p)=>{const g=Math.abs(i(o.tokenPrice,o.markPrice)||0);return Math.abs(i(p.tokenPrice,p.markPrice)||0)-g}),s=new Date().toLocaleString("en-US",{timeZone:"America/Havana",dateStyle:"medium",timeStyle:"short"})+" Havana";d({statusHtml:`<span class="ok">Live · ${e.length} tokens</span>`,cardsHtml:e.map($).join(""),updatedAt:s,briefingHtml:S(e)})}catch(n){d({statusHtml:`<span class="err">Failed: ${c(n.message||String(n))}</span>`,cardsHtml:'<p class="empty">Could not reach PreStocks API. Check network / CORS and try Refresh.</p>',updatedAt:null})}}d({statusHtml:"Loading…",cardsHtml:P(),updatedAt:null});u();setInterval(()=>u(!1),v);
