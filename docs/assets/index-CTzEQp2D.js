(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const o of a.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function s(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerPolicy&&(a.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?a.credentials="include":r.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(r){if(r.ep)return;r.ep=!0;const a=s(r);fetch(r.href,a)}})();function i(t,e){return!e||e===0?null:(t-e)/e*100}function l(t){return t==null||Number.isNaN(t)?"—":`${t>0?"+":""}${t.toFixed(2)}%`}function g(t){return[...t].sort((e,s)=>{const n=Math.abs(i(e.tokenPrice,e.markPrice)??0);return Math.abs(i(s.tokenPrice,s.markPrice)??0)-n})}function h(t){const e=t.map(s=>({item:s,pct:i(s.tokenPrice,s.markPrice)})).filter(({pct:s})=>s!=null);return e.length?{biggestPremium:e.reduce((s,n)=>n.pct>s.pct?n:s),biggestDiscount:e.reduce((s,n)=>n.pct<s.pct?n:s)}:{biggestPremium:null,biggestDiscount:null}}const y="https://prestocks.com/api/prestocks",b="./prestocks.json",v=t=>`https://solscan.io/token/${t}`,k=6e4,$=document.querySelector("#app");function p(t){return t==null||Number.isNaN(t)?"—":new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:t>=100?2:4}).format(t)}function m(t){return t==null||Number.isNaN(t)?"—":new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",notation:"compact",maximumFractionDigits:2}).format(t)}function P(t){return!t||t.length<10?t||"—":`${t.slice(0,4)}…${t.slice(-4)}`}function d({statusHtml:t,cardsHtml:e,updatedAt:s,briefingHtml:n=""}){var r;$.innerHTML=`
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
      <div id="board" class="board" role="list">${e}</div>
    </main>

    <footer class="foot">
      <p>Data from the free public <a href="https://prestocks.com/api/prestocks" rel="noopener" target="_blank">PreStocks API</a>. Not financial advice.</p>
      <p class="latam">Desde La Habana / LATAM — construyendo stocks on-chain sin capital de despliegue.</p>
      <p class="muted">Stocklana · PreStocks track · ${s?`Updated ${s}`:"—"}</p>
    </footer>
  `,(r=document.querySelector("#refresh"))==null||r.addEventListener("click",()=>u(!0))}function S(t){const e=i(t.tokenPrice,t.markPrice),s=e==null?"flat":e>.5?"prem":e<-.5?"disc":"flat",n=t.image?`<img class="thumb" src="${t.image}" alt="" width="40" height="40" loading="lazy" onerror="this.style.display='none'" />`:`<div class="thumb placeholder">${(t.symbol||"?").slice(0,2)}</div>`,r=t.contract_address?`<a class="mint" href="${v(t.contract_address)}" target="_blank" rel="noopener" title="${t.contract_address}">${P(t.contract_address)} ↗</a>`:'<span class="mint muted">no mint</span>',a=t.external_url?`<a class="ext" href="${t.external_url}" target="_blank" rel="noopener">PreStocks</a>`:"";return`
    <article class="card" role="listitem" data-symbol="${t.symbol||""}">
      <div class="card-head">
        ${n}
        <div class="titles">
          <h2>${c(t.name||t.symbol||"Unknown")}</h2>
          <div class="sym-row">
            <span class="sym">${c(t.symbol||"")}</span>
            ${a}
          </div>
        </div>
        <div class="badge ${s}" title="token vs mark">${l(e)}</div>
      </div>
      <dl class="prices">
        <div><dt>Mark</dt><dd>${p(t.markPrice)}</dd></div>
        <div><dt>Token</dt><dd>${p(t.tokenPrice)}</dd></div>
        <div><dt>Mark val.</dt><dd>${m(t.markValuation)}</dd></div>
        <div><dt>Implied val.</dt><dd>${m(t.impliedValuation)}</dd></div>
      </dl>
      <div class="card-foot">${r}</div>
    </article>
  `}function c(t){return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function A(t){const{biggestPremium:e,biggestDiscount:s}=h(t);return!e||!s?"":`<section class="brief" aria-label="Agent briefing">
    <strong>Agent briefing</strong>
    <span>Biggest premium: <em>${c(e.item.symbol)}</em> ${l(e.pct)}</span>
    <span>Biggest discount: <em>${c(s.item.symbol)}</em> ${l(s.pct)}</span>
    <span class="muted">Sort is by |gap| — outliers first for quarantine-style attention.</span>
  </section>`}function L(t=6){return Array.from({length:t},()=>'<div class="card skeleton" aria-hidden="true"></div>').join("")}async function f(t){const e=await fetch(t,{cache:"no-store"});if(!e.ok)throw new Error(`HTTP ${e.status}`);const s=await e.json();if(!Array.isArray(s))throw new Error("Unexpected API shape");return s}async function u(t=!1){const e=document.querySelector("#status");e&&(e.textContent=t?"Refreshing…":"Loading…");let s=null,n="snapshot";try{s=await f(y),n="live"}catch{s=await f(b),n="snapshot"}try{const r=g(s),a=new Date().toLocaleString("en-US",{timeZone:"America/Havana",dateStyle:"medium",timeStyle:"short"})+" Havana",o=n==="live"?`Live API · ${r.length} tokens`:`Synced snapshot · ${r.length} tokens`;d({statusHtml:`<span class="ok">${o}</span>`,cardsHtml:r.map(S).join(""),updatedAt:a,briefingHtml:A(r)})}catch(r){d({statusHtml:`<span class="err">Failed: ${c(r.message||String(r))}</span>`,cardsHtml:'<p class="empty">Could not load PreStocks data (live API CORS-blocked; local snapshot missing). Try Refresh.</p>',updatedAt:null})}}d({statusHtml:"Loading…",cardsHtml:L(),updatedAt:null});u();setInterval(()=>u(!1),k);
