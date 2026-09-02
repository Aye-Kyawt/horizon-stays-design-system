/**
 * Small DOM helpers and the chrome shared by every token specimen page.
 *
 * The page furniture is itself painted with Horizon Stays semantic tokens,
 * so switching the Theme toolbar recolours the documentation along with the
 * specimens — if a semantic colour is wrong, this page shows it.
 */

const SHEET_ID = 'hds-storybook-chrome';

const CHROME_CSS = `
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
`;

/** Inject the chrome stylesheet once per preview document. */
function ensureChrome(doc) {
  if (doc.getElementById(SHEET_ID)) return;
  const style = doc.createElement('style');
  style.id = SHEET_ID;
  style.textContent = CHROME_CSS;
  doc.head.appendChild(style);
}

export function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (v === undefined || v === null || v === false) continue;
    if (k === 'style') node.setAttribute('style', v);
    else if (k === 'class') node.className = v;
    else if (k === 'text') node.textContent = v;
    else if (k.startsWith('on')) node.addEventListener(k.slice(2).toLowerCase(), v);
    else node.setAttribute(k, v);
  }
  for (const child of [].concat(children)) {
    if (child === null || child === undefined || child === false) continue;
    node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
  }
  return node;
}

/** Token name that copies `var(--name)` to the clipboard when clicked. */
export function tokenName(name) {
  return el('button', {
    class: 'hds-name',
    type: 'button',
    title: `Copy var(--${name})`,
    text: `--${name}`,
    onclick: (e) => {
      const btn = e.currentTarget;
      const original = btn.textContent;
      navigator.clipboard?.writeText(`var(--${name})`);
      btn.textContent = 'copied ✓';
      setTimeout(() => { btn.textContent = original; }, 900);
    },
  });
}

/** The standard page shell: heading, intro, token count, then content. */
export function page({ title, intro, count, children }) {
  ensureChrome(document);
  return el('div', { class: 'hds-page' }, [
    el('h1', { class: 'hds-title', text: title }),
    intro ? el('p', { class: 'hds-intro', text: intro }) : null,
    count !== undefined
      ? el('p', { class: 'hds-count', text: `${count} token${count === 1 ? '' : 's'}` })
      : null,
    ...[].concat(children),
  ]);
}

export function group(title, children, note) {
  return el('div', { class: 'hds-group' }, [
    el('h2', { class: 'hds-group-title', text: title }),
    note ? el('p', { class: 'hds-group-note', text: note }) : null,
    ...[].concat(children),
  ]);
}

/** Trim the long provenance suffixes the Figma descriptions carry. */
export function shortDesc(description, max = 120) {
  if (!description) return '';
  const first = description.split('  ·  ')[0].trim();
  return first.length > max ? `${first.slice(0, max - 1)}…` : first;
}
