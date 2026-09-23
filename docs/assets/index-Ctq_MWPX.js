(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const i of a.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function r(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(s){if(s.ep)return;s.ep=!0;const a=r(s);fetch(s.href,a)}})();function l(t,e){return!e||e===0?null:(t-e)/e*100}function u(t){return t==null||Number.isNaN(t)?"—":`${t>0?"+":""}${t.toFixed(2)}%`}function v(t){return[...t].sort((e,r)=>{const n=Math.abs(l(e.tokenPrice,e.markPrice)??0);return Math.abs(l(r.tokenPrice,r.markPrice)??0)-n})}function k(t){const e=t.map(r=>({item:r,pct:l(r.tokenPrice,r.markPrice)})).filter(({pct:r})=>r!=null);return e.length?{biggestPremium:e.reduce((r,n)=>n.pct>r.pct?n:r),biggestDiscount:e.reduce((r,n)=>n.pct<r.pct?n:r)}:{biggestPremium:null,biggestDiscount:null}}const $="https://prestocks.com/api/prestocks",S="./prestocks.json",P=t=>`https://solscan.io/token/${t}`,L=6e4,w=document.querySelector("#app");let o=[],d="";function f(t){return t==null||Number.isNaN(t)?"—":new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:t>=100?2:4}).format(t)}function g(t){return t==null||Number.isNaN(t)?"—":new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",notation:"compact",maximumFractionDigits:2}).format(t)}function A(t){return!t||t.length<10?t||"—":`${t.slice(0,4)}…${t.slice(-4)}`}function p({statusHtml:t,cardsHtml:e,updatedAt:r,briefingHtml:n=""}){var a;w.innerHTML=`
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
      <div class="toolbar">
        <label class="sr-only" for="filter">Filter PreStocks</label>
        <input id="filter" class="filter" type="search" placeholder="Filter by name or symbol…" value="${c(d)}" autocomplete="off" />
        <span class="muted" id="count"></span>
      </div>
      <div id="board" class="board" role="list">${e}</div>
    </main>

    <footer class="foot">
      <p>Data from the free public <a href="https://prestocks.com/api/prestocks" rel="noopener" target="_blank">PreStocks API</a>. Not financial advice.</p>
      <p class="latam">Desde La Habana / LATAM — construyendo stocks on-chain sin capital de despliegue.</p>
      <p class="muted">Stocklana · PreStocks track · ${r?`Updated ${r}`:"—"}</p>
    </footer>
  `,(a=document.querySelector("#refresh"))==null||a.addEventListener("click",()=>m(!0));const s=document.querySelector("#filter");s==null||s.addEventListener("input",()=>{d=s.value||"",h(o)}),h(o)}function N(t,e){if(!e)return!0;const r=e.trim().toLowerCase();return r?`${t.name||""} ${t.symbol||""}`.toLowerCase().includes(r):!0}function h(t){o=t||[];const e=document.querySelector("#board"),r=document.querySelector("#count");if(!e)return;const n=o.filter(s=>N(s,d));e.innerHTML=n.length?n.map(b).join(""):`<p class="empty">No PreStocks match “${c(d)}”.</p>`,r&&(r.textContent=o.length?`${n.length} / ${o.length} shown`:"")}function b(t){const e=l(t.tokenPrice,t.markPrice),r=e==null?"flat":e>.5?"prem":e<-.5?"disc":"flat",n=t.image?`<img class="thumb" src="${t.image}" alt="" width="40" height="40" loading="lazy" onerror="this.style.display='none'" />`:`<div class="thumb placeholder">${(t.symbol||"?").slice(0,2)}</div>`,s=t.contract_address?`<a class="mint" href="${P(t.contract_address)}" target="_blank" rel="noopener" title="${t.contract_address}">${A(t.contract_address)} ↗</a>`:'<span class="mint muted">no mint</span>',a=t.external_url?`<a class="ext" href="${t.external_url}" target="_blank" rel="noopener">PreStocks</a>`:"";return`
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
        <div class="badge ${r}" title="token vs mark">${u(e)}</div>
      </div>
      <dl class="prices">
        <div><dt>Mark</dt><dd>${f(t.markPrice)}</dd></div>
        <div><dt>Token</dt><dd>${f(t.tokenPrice)}</dd></div>
        <div><dt>Mark val.</dt><dd>${g(t.markValuation)}</dd></div>
        <div><dt>Implied val.</dt><dd>${g(t.impliedValuation)}</dd></div>
      </dl>
      <div class="card-foot">${s}</div>
    </article>
  `}function c(t){return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function H(t){const{biggestPremium:e,biggestDiscount:r}=k(t);return!e||!r?"":`<section class="brief" aria-label="Agent briefing">
    <strong>Agent briefing</strong>
    <span>Biggest premium: <em>${c(e.item.symbol)}</em> ${u(e.pct)}</span>
    <span>Biggest discount: <em>${c(r.item.symbol)}</em> ${u(r.pct)}</span>
    <span class="muted">Sort is by |gap| — outliers first for quarantine-style attention.</span>
  </section>`}function _(t=6){return Array.from({length:t},()=>'<div class="card skeleton" aria-hidden="true"></div>').join("")}async function y(t){const e=await fetch(t,{cache:"no-store"});if(!e.ok)throw new Error(`HTTP ${e.status}`);const r=await e.json();if(!Array.isArray(r))throw new Error("Unexpected API shape");return r}async function m(t=!1){const e=document.querySelector("#status");e&&(e.textContent=t?"Refreshing…":"Loading…");let r=null,n="snapshot";try{r=await y($),n="live"}catch{r=await y(S),n="snapshot"}try{const s=v(r);o=s;const a=new Date().toLocaleString("en-US",{timeZone:"America/Havana",dateStyle:"medium",timeStyle:"short"})+" Havana",i=n==="live"?`Live API · ${s.length} tokens`:`Synced snapshot · ${s.length} tokens`;p({statusHtml:`<span class="ok">${i}</span>`,cardsHtml:s.map(b).join(""),updatedAt:a,briefingHtml:H(s)})}catch(s){p({statusHtml:`<span class="err">Failed: ${c(s.message||String(s))}</span>`,cardsHtml:'<p class="empty">Could not load PreStocks data (live API CORS-blocked; local snapshot missing). Try Refresh.</p>',updatedAt:null})}}p({statusHtml:"Loading…",cardsHtml:_(),updatedAt:null});m();setInterval(()=>m(!1),L);
