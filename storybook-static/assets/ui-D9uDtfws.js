import{t as e}from"./rolldown-runtime-Dh6celcD.js";function t(e){if(e.getElementById(s))return;let t=e.createElement(`style`);t.id=s,t.textContent=c,e.head.appendChild(t)}function n(e,t={},n=[]){let r=document.createElement(e);for(let[e,n]of Object.entries(t))n!=null&&n!==!1&&(e===`style`?r.setAttribute(`style`,n):e===`class`?r.className=n:e===`text`?r.textContent=n:e.startsWith(`on`)?r.addEventListener(e.slice(2).toLowerCase(),n):r.setAttribute(e,n));for(let e of[].concat(n))e!=null&&e!==!1&&r.appendChild(typeof e==`string`?document.createTextNode(e):e);return r}function r(e){return n(`button`,{class:`hds-name`,type:`button`,title:`Copy var(--${e})`,text:`--${e}`,onclick:t=>{let n=t.currentTarget,r=n.textContent;navigator.clipboard?.writeText(`var(--${e})`),n.textContent=`copied ✓`,setTimeout(()=>{n.textContent=r},900)}})}function i({title:e,intro:r,count:i,children:a}){return t(document),n(`div`,{class:`hds-page`},[n(`h1`,{class:`hds-title`,text:e}),r?n(`p`,{class:`hds-intro`,text:r}):null,i===void 0?null:n(`p`,{class:`hds-count`,text:`${i} token${i===1?``:`s`}`}),...[].concat(a)])}function a(e,t,r){return n(`div`,{class:`hds-group`},[n(`h2`,{class:`hds-group-title`,text:e}),r?n(`p`,{class:`hds-group-note`,text:r}):null,...[].concat(t)])}function o(e,t=120){if(!e)return``;let n=e.split(`  ·  `)[0].trim();return n.length>t?`${n.slice(0,t-1)}…`:n}var s,c;function l(){return(l=e((()=>{s=`hds-storybook-chrome`,c=`
  .hds-page {
    background: var(--semantic-color-bg-base);
    color: var(--semantic-color-text-base);
    font-family: var(--core-type-fontfamily-brand), system-ui, sans-serif;
    padding: 32px;
    min-height: 100vh;
    box-sizing: border-box;
  }
  .hds-page * { box-sizing: border-box; }
  .hds-title {
    font-size: var(--semantic-type-latin-page-title-font-size);
    line-height: var(--semantic-type-latin-page-title-line-height);
    font-weight: var(--semantic-type-latin-page-title-font-weight);
    margin: 0 0 8px;
  }
  .hds-intro {
    color: var(--semantic-color-text-secondary);
    max-width: 68ch;
    margin: 0 0 8px;
    font-size: 14px;
    line-height: 22px;
  }
  .hds-count {
    color: var(--semantic-color-text-subtle);
    font-size: 12px;
    margin: 0 0 28px;
    letter-spacing: 0.4px;
    text-transform: uppercase;
  }
  .hds-group { margin: 0 0 40px; }
  .hds-group-title {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    color: var(--semantic-color-text-subtle);
    margin: 0 0 4px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--semantic-color-border-subtle);
  }
  .hds-group-note {
    color: var(--semantic-color-text-subtle);
    font-size: 12px;
    margin: 8px 0 0;
    max-width: 72ch;
    line-height: 18px;
  }
  .hds-grid { display: grid; gap: 12px; margin-top: 16px; }
  .hds-ramp { grid-template-columns: repeat(auto-fill, minmax(132px, 1fr)); }
  .hds-cards { grid-template-columns: repeat(auto-fill, minmax(232px, 1fr)); }
  .hds-card {
    border: 1px solid var(--semantic-color-border-subtle);
    border-radius: var(--core-border-radius-md);
    overflow: hidden;
    background: var(--semantic-color-bg-surfaceprimary);
  }
  .hds-chip { height: 64px; width: 100%; display: block; }
  .hds-card-body { padding: 10px 12px 12px; }
  .hds-name {
    display: block;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 11px;
    line-height: 16px;
    color: var(--semantic-color-text-base);
    word-break: break-all;
    background: none;
    border: 0;
    padding: 0;
    text-align: left;
    cursor: copy;
  }
  .hds-name:hover { color: var(--semantic-color-text-link); text-decoration: underline; }
  .hds-value {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 11px;
    line-height: 16px;
    color: var(--semantic-color-text-subtle);
    margin-top: 2px;
    word-break: break-all;
  }
  .hds-desc {
    font-size: 11px;
    line-height: 16px;
    color: var(--semantic-color-text-subtle);
    margin-top: 6px;
  }
  .hds-badge {
    display: inline-block;
    font-size: 10px;
    line-height: 14px;
    padding: 1px 6px;
    border-radius: var(--core-border-radius-full);
    background: var(--semantic-color-bg-info-subtle);
    color: var(--semantic-color-text-info);
    margin-top: 6px;
  }
  .hds-rows { display: flex; flex-direction: column; margin-top: 16px; }
  .hds-row {
    display: grid;
    grid-template-columns: minmax(180px, 22%) minmax(90px, 12%) 1fr;
    gap: 20px;
    align-items: center;
    padding: 12px 8px;
    border-bottom: 1px solid var(--semantic-color-border-subtle);
  }
  .hds-table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 12px; }
  .hds-table th {
    text-align: left;
    font-size: 11px;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    color: var(--semantic-color-text-subtle);
    padding: 8px;
    border-bottom: 1px solid var(--semantic-color-border-base);
    position: sticky;
    top: 0;
    background: var(--semantic-color-bg-base);
  }
  .hds-table td {
    padding: 8px;
    border-bottom: 1px solid var(--semantic-color-border-subtle);
    vertical-align: top;
  }
  .hds-mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11px; }
  .hds-search {
    width: 100%;
    max-width: 420px;
    padding: 0 12px;
    height: var(--core-size-control-sm);
    border-radius: var(--core-border-radius-xs);
    border: var(--core-border-width-1) solid var(--semantic-color-border-base);
    background: var(--semantic-color-bg-surfaceprimary);
    color: var(--semantic-color-text-base);
    font-size: 13px;
  }
  .hds-search::placeholder { color: var(--semantic-color-text-placeholder); }
  .hds-search:focus {
    outline: none;
    border-color: var(--semantic-color-border-primary-focused);
    box-shadow: 0 0 0 var(--core-border-width-2) var(--semantic-color-bg-primary-subtle);
  }
  .hds-empty { color: var(--semantic-color-text-subtle); font-size: 13px; padding: 24px 8px; }
`})))()}export{o as a,i,a as n,r as o,l as r,n as t};