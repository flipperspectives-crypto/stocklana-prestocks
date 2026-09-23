(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))n(t);new MutationObserver(t=>{for(const s of t)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function a(t){const s={};return t.integrity&&(s.integrity=t.integrity),t.referrerPolicy&&(s.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?s.credentials="include":t.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(t){if(t.ep)return;t.ep=!0;const s=a(t);fetch(t.href,s)}})();const h="https://prestocks.com/api/prestocks",g=e=>`https://solscan.io/token/${e}`,v=6e4,k=document.querySelector("#app");function p(e){return e==null||Number.isNaN(e)?"—":new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:e>=100?2:4}).format(e)}function m(e){return e==null||Number.isNaN(e)?"—":new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",notation:"compact",maximumFractionDigits:2}).format(e)}function c(e,r){return!r||r===0?null:(e-r)/r*100}function y(e){return e==null||Number.isNaN(e)?"—":`${e>0?"+":""}${e.toFixed(2)}%`}function b(e){return!e||e.length<10?e||"—":`${e.slice(0,4)}…${e.slice(-4)}`}function i({statusHtml:e,cardsHtml:r,updatedAt:a}){var n;k.innerHTML=`
    <header class="top">
      <div class="brand">
        <span class="logo" aria-hidden="true">📈</span>
        <div>
          <h1>PreStocks Board</h1>
          <p class="tagline">Live pre-IPO marks vs on-chain token prices · Solana</p>
        </div>
      </div>
      <div class="meta">
        <span id="status" class="status">${e}</span>
        <button type="button" id="refresh" class="btn">Refresh</button>
      </div>
    </header>

    <main>
      <section class="legend" aria-label="How to read the board">
        <span><strong>Mark</strong> = reference private-company price</span>
        <span><strong>Token</strong> = PreStocks market price</span>
        <span><strong>Premium / discount</strong> = (token − mark) / mark</span>
      </section>
      <div id="board" class="board" role="list">${r}</div>
    </main>

    <footer class="foot">
      <p>Data from the free public <a href="https://prestocks.com/api/prestocks" rel="noopener" target="_blank">PreStocks API</a>. Not financial advice.</p>
      <p class="latam">Desde La Habana / LATAM — construyendo stocks on-chain sin capital de despliegue.</p>
      <p class="muted">Stocklana · PreStocks track · ${a?`Updated ${a}`:"—"}</p>
    </footer>
  `,(n=document.querySelector("#refresh"))==null||n.addEventListener("click",()=>d(!0))}function $(e){const r=c(e.tokenPrice,e.markPrice),a=r==null?"flat":r>.5?"prem":r<-.5?"disc":"flat",n=e.image?`<img class="thumb" src="${e.image}" alt="" width="40" height="40" loading="lazy" onerror="this.style.display='none'" />`:`<div class="thumb placeholder">${(e.symbol||"?").slice(0,2)}</div>`,t=e.contract_address?`<a class="mint" href="${g(e.contract_address)}" target="_blank" rel="noopener" title="${e.contract_address}">${b(e.contract_address)} ↗</a>`:'<span class="mint muted">no mint</span>',s=e.external_url?`<a class="ext" href="${e.external_url}" target="_blank" rel="noopener">PreStocks</a>`:"";return`
    <article class="card" role="listitem" data-symbol="${e.symbol||""}">
      <div class="card-head">
        ${n}
        <div class="titles">
          <h2>${l(e.name||e.symbol||"Unknown")}</h2>
          <div class="sym-row">
            <span class="sym">${l(e.symbol||"")}</span>
            ${s}
          </div>
        </div>
        <div class="badge ${a}" title="token vs mark">${y(r)}</div>
      </div>
      <dl class="prices">
        <div><dt>Mark</dt><dd>${p(e.markPrice)}</dd></div>
        <div><dt>Token</dt><dd>${p(e.tokenPrice)}</dd></div>
        <div><dt>Mark val.</dt><dd>${m(e.markValuation)}</dd></div>
        <div><dt>Implied val.</dt><dd>${m(e.impliedValuation)}</dd></div>
      </dl>
      <div class="card-foot">${t}</div>
    </article>
  `}function l(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function S(e=6){return Array.from({length:e},()=>'<div class="card skeleton" aria-hidden="true"></div>').join("")}async function d(e=!1){const r=document.querySelector("#status");r&&(r.textContent=e?"Refreshing…":"Loading…");try{const a=await fetch(h,{cache:"no-store"});if(!a.ok)throw new Error(`HTTP ${a.status}`);const n=await a.json();if(!Array.isArray(n))throw new Error("Unexpected API shape");const t=[...n].sort((o,u)=>{const f=Math.abs(c(o.tokenPrice,o.markPrice)||0);return Math.abs(c(u.tokenPrice,u.markPrice)||0)-f}),s=new Date().toLocaleString("en-US",{timeZone:"America/Havana",dateStyle:"medium",timeStyle:"short"})+" Havana";i({statusHtml:`<span class="ok">Live · ${t.length} tokens</span>`,cardsHtml:t.map($).join(""),updatedAt:s})}catch(a){i({statusHtml:`<span class="err">Failed: ${l(a.message||String(a))}</span>`,cardsHtml:'<p class="empty">Could not reach PreStocks API. Check network / CORS and try Refresh.</p>',updatedAt:null})}}i({statusHtml:"Loading…",cardsHtml:S(),updatedAt:null});d();setInterval(()=>d(!1),v);
