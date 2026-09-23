(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const c of a.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&n(c)}).observe(document,{childList:!0,subtree:!0});function e(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(s){if(s.ep)return;s.ep=!0;const a=e(s);fetch(s.href,a)}})();function i(t,r){return!r||r===0?null:(t-r)/r*100}function l(t){return t==null||Number.isNaN(t)?"—":`${t>0?"+":""}${t.toFixed(2)}%`}function f(t){return[...t].sort((r,e)=>{const n=Math.abs(i(r.tokenPrice,r.markPrice)??0);return Math.abs(i(e.tokenPrice,e.markPrice)??0)-n})}function g(t){const r=t.map(e=>({item:e,pct:i(e.tokenPrice,e.markPrice)})).filter(({pct:e})=>e!=null);return r.length?{biggestPremium:r.reduce((e,n)=>n.pct>e.pct?n:e),biggestDiscount:r.reduce((e,n)=>n.pct<e.pct?n:e)}:{biggestPremium:null,biggestDiscount:null}}const h="https://prestocks.com/api/prestocks",b=t=>`https://solscan.io/token/${t}`,y=6e4,k=document.querySelector("#app");function p(t){return t==null||Number.isNaN(t)?"—":new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:t>=100?2:4}).format(t)}function m(t){return t==null||Number.isNaN(t)?"—":new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",notation:"compact",maximumFractionDigits:2}).format(t)}function v(t){return!t||t.length<10?t||"—":`${t.slice(0,4)}…${t.slice(-4)}`}function d({statusHtml:t,cardsHtml:r,updatedAt:e,briefingHtml:n=""}){var s;k.innerHTML=`
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
      ${n||""}
      <div id="board" class="board" role="list">${r}</div>
    </main>

    <footer class="foot">
      <p>Data from the free public <a href="https://prestocks.com/api/prestocks" rel="noopener" target="_blank">PreStocks API</a>. Not financial advice.</p>
      <p class="latam">Desde La Habana / LATAM — construyendo stocks on-chain sin capital de despliegue.</p>
      <p class="muted">Stocklana · PreStocks track · ${e?`Updated ${e}`:"—"}</p>
    </footer>
  `,(s=document.querySelector("#refresh"))==null||s.addEventListener("click",()=>u(!0))}function $(t){const r=i(t.tokenPrice,t.markPrice),e=r==null?"flat":r>.5?"prem":r<-.5?"disc":"flat",n=t.image?`<img class="thumb" src="${t.image}" alt="" width="40" height="40" loading="lazy" onerror="this.style.display='none'" />`:`<div class="thumb placeholder">${(t.symbol||"?").slice(0,2)}</div>`,s=t.contract_address?`<a class="mint" href="${b(t.contract_address)}" target="_blank" rel="noopener" title="${t.contract_address}">${v(t.contract_address)} ↗</a>`:'<span class="mint muted">no mint</span>',a=t.external_url?`<a class="ext" href="${t.external_url}" target="_blank" rel="noopener">PreStocks</a>`:"";return`
    <article class="card" role="listitem" data-symbol="${t.symbol||""}">
      <div class="card-head">
        ${n}
        <div class="titles">
          <h2>${o(t.name||t.symbol||"Unknown")}</h2>
          <div class="sym-row">
            <span class="sym">${o(t.symbol||"")}</span>
            ${a}
          </div>
        </div>
        <div class="badge ${e}" title="token vs mark">${l(r)}</div>
      </div>
      <dl class="prices">
        <div><dt>Mark</dt><dd>${p(t.markPrice)}</dd></div>
        <div><dt>Token</dt><dd>${p(t.tokenPrice)}</dd></div>
        <div><dt>Mark val.</dt><dd>${m(t.markValuation)}</dd></div>
        <div><dt>Implied val.</dt><dd>${m(t.impliedValuation)}</dd></div>
      </dl>
      <div class="card-foot">${s}</div>
    </article>
  `}function o(t){return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function P(t){const{biggestPremium:r,biggestDiscount:e}=g(t);return!r||!e?"":`<section class="brief" aria-label="Agent briefing">
    <strong>Agent briefing</strong>
    <span>Biggest premium: <em>${o(r.item.symbol)}</em> ${l(r.pct)}</span>
    <span>Biggest discount: <em>${o(e.item.symbol)}</em> ${l(e.pct)}</span>
    <span class="muted">Sort is by |gap| — outliers first for quarantine-style attention.</span>
  </section>`}function S(t=6){return Array.from({length:t},()=>'<div class="card skeleton" aria-hidden="true"></div>').join("")}async function u(t=!1){const r=document.querySelector("#status");r&&(r.textContent=t?"Refreshing…":"Loading…");try{const e=await fetch(h,{cache:"no-store"});if(!e.ok)throw new Error(`HTTP ${e.status}`);const n=await e.json();if(!Array.isArray(n))throw new Error("Unexpected API shape");const s=f(n),a=new Date().toLocaleString("en-US",{timeZone:"America/Havana",dateStyle:"medium",timeStyle:"short"})+" Havana";d({statusHtml:`<span class="ok">Live · ${s.length} tokens</span>`,cardsHtml:s.map($).join(""),updatedAt:a,briefingHtml:P(s)})}catch(e){d({statusHtml:`<span class="err">Failed: ${o(e.message||String(e))}</span>`,cardsHtml:'<p class="empty">Could not reach PreStocks API. Check network / CORS and try Refresh.</p>',updatedAt:null})}}d({statusHtml:"Loading…",cardsHtml:S(),updatedAt:null});u();setInterval(()=>u(!1),y);
