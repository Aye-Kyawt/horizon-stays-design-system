/**
 * Generates every page of the docs site that is not a written guide:
 * Home, All components, one page per eligible component, Tokens, Changelog,
 * Roadmap and News. The one generator; it replaces generate-pages.mjs.
 *
 *   node scripts/generate.mjs --commit <sha>
 *
 * Sources, and nothing else (.claude/skills/astro-page/SKILL.md):
 *   the repo at <sha>                git show / git log / git tag, never the working tree
 *   sources/board.json               statuses by component name, read from the registry
 *   sources/figma.json               variant matrix, best practice, unbound values
 *   the production Storybook         its index.json, fetched
 *
 * Tokens are read from ../build/css/, which the generator refuses to use unless
 * the working tree's token sources match <sha> exactly. So the values on the
 * page are the values built from the pinned commit.
 *
 * The generator runs where the pinned commit's history, tags and token build
 * exist, and its output is committed on the astro branch. Vercel's build is
 * `astro build` only. A build that re-ran this on Vercel would read a shallow
 * clone with no tags and no token build, which is not the pinned commit.
 *
 * A source that is missing leaves its section in place with a notice that
 * names exactly what is missing. Nothing is filled in.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync, copyFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const site = resolve(here, '..');
const repo = resolve(site, '..');
const docs = join(site, 'src', 'content', 'docs');

const REPO_URL = 'https://github.com/Aye-Kyawt/horizon-stays-design-system';
const STORYBOOK = 'https://horizon-stays-storybook-production.vercel.app';
const ELIGIBLE_STATUSES = new Set(['Completed', 'Released']);

// ---------------------------------------------------------------- arguments

const argv = process.argv.slice(2);
const commitArg = argv[argv.indexOf('--commit') + 1];
if (!argv.includes('--commit') || !commitArg) fail('usage: node scripts/generate.mjs --commit <sha>');

function fail(message) {
  console.error(`generate: ${message}`);
  process.exit(1);
}

// ---------------------------------------------------------------- git at the pin

const git = (...args) => execFileSync('git', args, { cwd: repo, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).replace(/\r\n/g, '\n');
const SHA = git('rev-parse', '--verify', `${commitArg}^{commit}`).trim();
const SHORT = SHA.slice(0, 7);
const show = (path) => git('show', `${SHA}:${path}`);
const has = (path) => {
  try {
    execFileSync('git', ['cat-file', '-e', `${SHA}:${path}`], { cwd: repo, stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
};
const ls = (path) => git('ls-tree', '--name-only', `${SHA}:${path}`).split('\n').filter(Boolean);
const blob = (path, line) => `${REPO_URL}/blob/${SHA}/${path}${line ? `#L${line}` : ''}`;
const tree = (path) => `${REPO_URL}/tree/${SHA}/${path}`;

/** Every v* tag, oldest first, with its commit and date. */
const tags = git('tag', '-l', 'v*', '--sort=v:refname')
  .split('\n')
  .filter(Boolean)
  .map((name) => ({
    name,
    version: name.slice(1),
    commit: git('rev-list', '-n', '1', name).trim(),
    date: git('log', '-1', '--format=%ad', '--date=short', name).trim(),
  }));

/** The earliest v* tag that contains the commit, else null. */
function earliestTag(commit) {
  for (const t of tags) {
    try {
      execFileSync('git', ['merge-base', '--is-ancestor', commit, t.commit], { cwd: repo, stdio: 'ignore' });
      return t;
    } catch {
      /* not contained */
    }
  }
  return null;
}

// ---------------------------------------------------------------- sources

const board = JSON.parse(readFileSync(join(site, 'sources', 'board.json'), 'utf8'));
const figma = JSON.parse(readFileSync(join(site, 'sources', 'figma.json'), 'utf8'));
for (const row of board.components) {
  if (Object.keys(row).some((k) => /id$/i.test(k))) fail('board.json carries an ID field; it must hold names and statuses only');
}

const storybookIndex = await fetch(`${STORYBOOK}/index.json`)
  .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
  .catch((e) => fail(`production Storybook index.json unreachable (${e.message})`));
const storyEntries = Object.values(storybookIndex.entries);

// Tokens: refuse unless the working tree's token sources are the pinned ones.
try {
  execFileSync('git', ['diff', '--quiet', SHA, '--', 'tokens', 'build-tokens.js'], { cwd: repo, stdio: 'ignore' });
} catch {
  fail(`the working tree's tokens/ or build-tokens.js differ from ${SHORT}; check out the pinned commit's tokens and run npm run build:tokens`);
}
const PLATFORMS = ['web', 'mobile', 'back-office'];
for (const p of PLATFORMS) if (!existsSync(join(repo, 'build', 'css', `${p}.css`))) fail(`build/css/${p}.css is missing; run npm run build:tokens at the repo root`);

// ---------------------------------------------------------------- helpers

/** Escapes prose for MDX: braces and angle brackets would be read as JSX. */
const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\{/g, '&#123;')
    .replace(/\}/g, '&#125;');
const cell = (s) => esc(s).replace(/\|/g, '\\|').replace(/\n+/g, ' ').trim();
const code = (s) => '`' + String(s).replace(/`/g, "'") + '`';
const codeCell = (s) => code(String(s).replace(/\|/g, '\\|').replace(/\n+/g, ' '));
const notice = (text) => `:::note[Missing source]\n${esc(text)}\n:::`;
const frontmatter = (fields) =>
  ['---', ...Object.entries(fields).map(([k, v]) => (v === null || typeof v !== 'object' ? `${k}: ${JSON.stringify(v)}` : `${k}:${yamlBlock(v)}`)), '---', ''].join('\n');
function yamlBlock(v, indent = '  ') {
  if (Array.isArray(v)) return '\n' + v.map((x) => `${indent}- ${typeof x === 'object' ? yamlBlock(x, indent + '  ').trimStart().replace(/^\n/, '') : JSON.stringify(x)}`).join('\n');
  return '\n' + Object.entries(v).map(([k, x]) => (typeof x === 'object' && x !== null ? `${indent}${k}:${yamlBlock(x, indent + '  ')}` : `${indent}${k}: ${JSON.stringify(x)}`)).join('\n');
}
const sanitize = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const storyIdPart = (exportName) => sanitize(exportName.replace(/([a-z])([A-Z0-9])/g, '$1 $2').replace(/([0-9])([A-Za-z])/g, '$1 $2'));
const slugOf = (name) => name.toLowerCase();
const byName = (a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' });
const embed = (id, theme, title) =>
  `<iframe class="hds-embed" title=${JSON.stringify(`${title} (${theme})`)} loading="lazy" src="${STORYBOOK}/iframe.html?id=${id}&viewMode=story&globals=theme:${theme}"></iframe>`;
const embedPair = (id, title) => `<div class="hds-embed-pair">\n${embed(id, 'light', title)}\n${embed(id, 'dark', title)}\n</div>`;

/** Strips a JSDoc block to its text. */
const jsdocText = (block) =>
  block.trim().replace(/^\/\*\*/, '').replace(/\*\/$/, '').split('\n').map((l) => l.replace(/^\s*\* ?/, '')).join('\n').trim();

// ---------------------------------------------------------------- tokens

function parseCss(text) {
  const clean = text.replace(/\/\*[\s\S]*?\*\//g, '');
  const darkAt = clean.indexOf('[data-theme="dark"]');
  const blocks = { root: clean.slice(0, darkAt < 0 ? undefined : darkAt), dark: darkAt < 0 ? '' : clean.slice(darkAt) };
  const out = { root: new Map(), dark: new Map() };
  for (const [k, part] of Object.entries(blocks)) {
    for (const m of part.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) out[k].set(m[1], m[2].trim());
  }
  return out;
}
const css = Object.fromEntries(PLATFORMS.map((p) => [p, parseCss(readFileSync(join(repo, 'build', 'css', `${p}.css`), 'utf8'))]));

/** Resolves a token to its final value in one platform and theme. */
function resolveToken(platform, name, theme, depth = 0) {
  const { root, dark } = css[platform];
  const raw = theme === 'dark' && dark.has(name) ? dark.get(name) : root.get(name);
  if (raw === undefined || depth > 20) return undefined;
  return raw.replace(/var\((--[\w-]+)\)/g, (_, ref) => resolveToken(platform, ref, theme, depth + 1) ?? `var(${ref})`);
}
const declared = (platform, name) => css[platform].root.get(name);
const hasDark = (platform, name) => css[platform].dark.has(name);

// ---------------------------------------------------------------- the repo at the pin

const pkgAt = (ref) => JSON.parse(git('show', `${ref}:package.json`));
const PKG = pkgAt(SHA).name;
const indexTs = show('src/index.ts');
const exportedAt = (ref, name) => new RegExp(`export\\s*\\{\\s*${name}\\b`).test(git('show', `${ref}:src/index.ts`));
const internalNamed = (name) => new RegExp(`\\b${name}\\b`).test(indexTs.split('*/')[0]);

function readme() {
  if (!has('README.md')) return null;
  const text = show('README.md');
  const paragraphs = text.split(/\n\s*\n/).map((p) => p.trim());
  const first = paragraphs.find((p) => !p.startsWith('#') && !p.startsWith('`') && !p.startsWith('>'));
  const usage = text.match(/## Usage[\s\S]*?```(jsx|tsx)\n([\s\S]*?)```/);
  return { firstParagraph: first ?? null, usageExample: usage ? { lang: usage[1], code: usage[2].trimEnd() } : null };
}
const README = readme();

const componentFolders = ls('src/components');

function parseComponent(folder) {
  const files = ls(`src/components/${folder}`);
  const source = files.find((f) => f.endsWith('.tsx') && !/\.(stories|test)\.tsx$/.test(f));
  if (!source) return null;
  const path = `src/components/${folder}/${source}`;
  const src = show(path);
  const exportName = src.match(/export function (\w+)/)?.[1] ?? folder;

  const aliases = new Map();
  for (const m of src.matchAll(/^((?:\/\*\*[\s\S]*?\*\/\n)?)export type (\w+)\s*=\s*([\s\S]*?);\s*$/gm)) {
    aliases.set(m[2], { values: m[3].replace(/\s+/g, ' ').trim(), doc: m[1] ? jsdocText(m[1]) : '' });
  }
  const defaults = new Map();
  const fn = src.match(/export function \w+\(\s*\{([\s\S]*?)\}\s*:/);
  if (fn) for (const m of fn[1].matchAll(/(\w+)\s*=\s*([^,\n]+)/g)) defaults.set(m[1], m[2].trim());

  const props = [];
  let extendsClause = '';
  const iface = src.match(/export interface (\w+Props)\s*([\s\S]*?)\{\n([\s\S]*?)\n\}/);
  if (iface) {
    extendsClause = iface[2].replace(/^extends\s*/, '').replace(/\s+/g, ' ').trim();
    let doc = '';
    const lines = iface[3].split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (/^\s*\/\*\*/.test(lines[i])) {
        const block = [lines[i]];
        while (!/\*\//.test(lines[i]) && i < lines.length - 1) block.push(lines[++i]);
        doc = jsdocText(block.join('\n'));
        continue;
      }
      const p = lines[i].match(/^\s*(\w+)(\?)?:\s*(.+?);\s*$/);
      if (p) {
        props.push({ name: p[1], required: !p[2], type: p[3], default: defaults.get(p[1]) ?? '', doc });
        doc = '';
      }
    }
  }

  const imports = [...src.matchAll(/^import\s+(?:type\s+)?\{([^}]*)\}\s+from\s+'(\.\.\/[^']+)'/gm)].map((m) => ({
    names: m[1].split(',').map((s) => s.replace(/\btype\b/, '').trim()).filter(Boolean),
    from: m[2],
  }));
  const composes = imports
    .filter((i) => i.from.startsWith('../') && !i.from.startsWith('../../'))
    .map((i) => i.from.split('/')[1]);
  const icons = imports.filter((i) => i.from.startsWith('../../icons/')).flatMap((i) => i.names);

  const storiesFile = files.find((f) => f.endsWith('.stories.tsx'));
  let storyTitle = '';
  const stories = [];
  if (storiesFile) {
    const s = show(`src/components/${folder}/${storiesFile}`);
    storyTitle = s.match(/title:\s*'([^']+)'/)?.[1] ?? '';
    const starts = [...s.matchAll(/^export const (\w+)[^=]*=\s*\{/gm)];
    starts.forEach((m, i) => {
      const body = s.slice(m.index, starts[i + 1]?.index ?? s.length);
      const argsText = body.match(/args:\s*\{([^}]*)\}/)?.[1] ?? '';
      const args = Object.fromEntries([...argsText.matchAll(/(\w+):\s*('([^']*)'|true|false|-?\d+(?:\.\d+)?)/g)].map((a) => [a[1], a[3] ?? a[2]]));
      const id = `${sanitize(storyTitle)}--${storyIdPart(m[1])}`;
      const entry = storyEntries.find((e) => e.id === id);
      stories.push({ export: m[1], id, name: entry?.name ?? m[1], deployed: Boolean(entry), args, hasRender: /\brender:\s*\(/.test(body) });
    });
  }
  const docsEntry = storyEntries.find((e) => e.type === 'docs' && e.title === storyTitle);

  const intentPath = `src/components/${folder}/${source.replace(/\.tsx$/, '.intent.json')}`;
  const intent = has(intentPath) ? { path: intentPath, ...JSON.parse(show(intentPath)) } : null;

  return { folder, source, path, exportName, aliases, props, extendsClause, composes, icons, storyTitle, stories, docsEntry, intent };
}

const components = componentFolders.map(parseComponent).filter(Boolean).sort((a, b) => byName(a.folder, b.folder));
const boardRow = (c) => board.components.find((r) => r.name.toLowerCase() === c.folder.toLowerCase());
const figmaOf = (c) => Object.entries(figma.components).find(([k]) => k.toLowerCase() === c.folder.toLowerCase())?.[1] ?? null;
const eligible = components.filter((c) => {
  const r = boardRow(c);
  return r && ELIGIBLE_STATUSES.has(r.development) && r.releaseVerdict === 'Cleared';
});

/** The earliest v* tag whose src/index.ts exports the component. */
function shippedIn(c) {
  for (const t of tags) if (exportedAt(t.commit, c.exportName)) return t;
  return null;
}

/** Commits touching the component and everything it composes, newest first. */
function componentLog(c) {
  const paths = [`src/components/${c.folder}`, ...c.composes.map((f) => `src/components/${f}`)];
  const out = git('log', SHA, '--format=%H%x09%ad%x09%s', '--date=short', '--', ...paths);
  return out.split('\n').filter(Boolean).map((l) => {
    const [hash, date, subject] = l.split('\t');
    return { hash, date, subject, tag: earliestTag(hash) };
  });
}

/** docs/*.md files at the pin that name the component. */
function designDocs(c) {
  return ls('docs')
    .filter((f) => f.endsWith('.md'))
    .map((f) => ({ file: f, text: show(`docs/${f}`) }))
    .filter(({ file, text }) => file.toLowerCase().startsWith(`${c.folder.toLowerCase()}-`) || new RegExp(`\\b\\.?${c.folder}\\b`, 'i').test(text))
    .map(({ file, text }) => ({ file, own: file.toLowerCase().startsWith(`${c.folder.toLowerCase()}-`), title: text.match(/^#\s+(.+)$/m)?.[1] ?? file }));
}

// ---------------------------------------------------------------- component page

function sourceLink(src, pinnedAt) {
  if (!src) return '';
  if (src.startsWith('figma:')) {
    const node = src.slice(6);
    return `[Figma ${node}](https://www.figma.com/design/${figma.fileKey}/?node-id=${node.replace(':', '-')})`;
  }
  const [path, anchor] = src.split('#');
  const line = anchor?.match(/L(\d+)/)?.[1];
  return `[${path}${anchor ? `#${anchor}` : ''}](${REPO_URL}/blob/${pinnedAt}/${path}${line ? `#L${line}` : ''})`;
}

function componentPage(c) {
  const row = boardRow(c);
  const fig = figmaOf(c);
  const shipped = shippedIn(c);
  const isPublic = /export\s*\{\s*/.test(indexTs) && new RegExp(`export\\s*\\{\\s*${c.exportName}\\b`).test(indexTs);
  const intentAt = c.intent?.commit ?? SHA;
  const matrixStories = [];
  const exampleStories = [];
  const unclassified = [];
  const variantProps = fig ? Object.entries(fig.properties).filter(([, p]) => p.type === 'VARIANT').map(([k]) => k) : [];
  for (const s of c.stories) {
    if (s.hasRender) {
      exampleStories.push(s);
      continue;
    }
    const cellMatch = fig?.variants.find((v) => {
      if (fig.type === 'COMPONENT') return Object.entries(fig.properties).every(([k, p]) => p.type !== 'BOOLEAN' || s.args[k] === undefined || String(p.default) === s.args[k]) && Object.keys(s.args).length > 0;
      const pairs = Object.fromEntries(v.name.split(',').map((kv) => kv.trim().split('=')));
      return variantProps.length > 0 && variantProps.every((k) => {
        const argKey = Object.keys(s.args).find((a) => a.toLowerCase() === k.toLowerCase());
        return argKey && s.args[argKey] === pairs[k];
      });
    });
    if (cellMatch) matrixStories.push({ ...s, cell: cellMatch });
    else if (fig) exampleStories.push(s);
    else {
      unclassified.push(s);
      exampleStories.push(s);
    }
  }
  report.unclassified.push(...unclassified.map((s) => `${c.folder} ${s.export}`));

  const firstStory = c.stories.find((s) => s.deployed);
  const out = [];
  out.push(frontmatter({ title: c.folder === 'Button' ? 'Button' : c.folder, description: `${c.folder} — usage, examples, code, design and changelog, generated from ${PKG} at ${SHORT}.`, editUrl: false }));
  out.push(`import { Tabs, TabItem } from '@astrojs/starlight/components';`, '');
  const links = [];
  if (firstStory) links.push(`[Storybook](${STORYBOOK}/?path=/story/${firstStory.id})`);
  if (fig) links.push(`[Figma node ${fig.node}](${fig.figmaUrl})`);
  links.push(`[Source](${tree(`src/components/${c.folder}`)})`);
  out.push(`<p class="hds-pageheader"><span class="hds-status">${esc(row?.development ?? 'No board status')} · ${shipped ? `since ${shipped.version}` : 'Unreleased'}${isPublic ? '' : ' · internal'}</span></p>`, '');
  out.push(links.join(' · '), '');

  out.push('<Tabs syncKey="component">', '<TabItem label="Usage">', '');
  // Usage
  const i = c.intent;
  out.push('### When to use it', '');
  if (!i) out.push(notice(`No ${c.folder}.intent.json at ${SHORT}, so there is no usage intent to show.`));
  else if (!i.use_when.length) out.push(notice(`${c.folder}.intent.json records no "use_when" entry: ${firstGap(i, 'use_when') ?? 'no usage region on the Figma documentation page.'}`));
  else out.push(...i.use_when.map((u) => `- ${esc(u.text)} (${sourceLink(u.source, intentAt)})`));
  out.push('', '### Where it goes', '');
  if (!i || !i.placement.length) out.push(notice(i ? `${c.folder}.intent.json records no placement: ${firstGap(i, 'placement') ?? 'no story places it in a context.'}` : 'No intent file, so no placement.'));
  else out.push(...i.placement.map((p) => `- ${esc(p.context)} (${sourceLink(p.source, intentAt)})`));
  out.push('', '### When not to use it', '');
  if (!i || !i.dont_use_when.length) out.push(notice(i ? `${c.folder}.intent.json records no "dont_use_when" entry.` : 'No intent file.'));
  else out.push(...i.dont_use_when.map((d) => `- ${esc(d.text)}${d.alternative ? ` **Instead:** ${esc(d.alternative)}.` : ' *The design names no alternative.*'} (${sourceLink(d.source, intentAt)})`));
  out.push('', '### Best practice', '');
  if (!fig) out.push(notice(`figma.json has no entry for ${c.folder}.`));
  else if (!fig.bestPractice.length) out.push(notice(fig.usageRegionNote ?? `The Figma documentation page for ${fig.node} has no best practice.`));
  else out.push(...fig.bestPractice.map((b) => `- ${esc(b.text)} (${sourceLink(b.source)})`));
  out.push('', '### What each variant is for', '');
  if (!i || !Object.keys(i.variant_intent).length) out.push(notice('No variant intent recorded.'));
  else {
    out.push('| Property | Value | What it is for |', '|---|---|---|');
    for (const [prop, v] of Object.entries(i.variant_intent)) {
      for (const [val, why] of Object.entries(v.values)) out.push(`| ${codeCell(prop)} | ${codeCell(val)}${String(val) === String(v.default) ? ' (default)' : ''} | ${why ? cell(why) : '*The code states no purpose.*'} |`);
    }
  }
  out.push('', '### Accessibility', '');
  if (!i || !i.a11y.length) out.push(notice('No accessibility facts recorded.'));
  else out.push(...i.a11y.map((a) => `- ${esc(a.fact)} (${sourceLink(a.source, intentAt)})`));
  out.push('', '### Composition', '');
  const composed = [...c.composes.map((f) => `\`${f}\``), ...c.icons.map((n) => `the \`${n}\` glyph (src/icons)`)];
  out.push(composed.length ? `${c.folder} is built from ${composed.join(', ')}.` : `${c.folder} composes no other component.`);
  const composedInto = components.filter((o) => o.composes.includes(c.folder)).map((o) => `\`${o.folder}\``);
  if (composedInto.length) out.push('', `It is used inside ${composedInto.join(', ')}.`);
  out.push('', '### What this version promises', '');
  out.push(
    isPublic
      ? `${c.exportName} is exported from \`src/index.ts\` at ${SHORT}${shipped ? ` and has been public since ${shipped.version}` : ''}. Its props and types are the documented API: see [Versioning](/get-started/versioning/) for what a 0.x version promises.`
      : `${c.exportName} is **not** exported from \`src/index.ts\` at ${SHORT}. It is internal, so no version promises anything about its API; it may change in any release. See [Versioning](/get-started/versioning/).`,
  );
  out.push('', '</TabItem>', '<TabItem label="Examples">', '');
  // Examples
  out.push('### The common case', '');
  if (!README) out.push(notice(`No README in the repo at ${SHORT}, so there is no usage example to show.`));
  else if (!README.usageExample) out.push(notice(`The README at ${SHORT} has no usage example.`));
  else if (!new RegExp(`<${c.exportName}\\b`).test(README.usageExample.code)) out.push(notice(`The README's usage example at ${SHORT} does not use ${c.exportName}, so there is no README example for it.`));
  else out.push('```' + README.usageExample.lang, README.usageExample.code, '```');
  out.push('', '### Worth seeing', '');
  const deployedExamples = exampleStories.filter((s) => s.deployed);
  if (!deployedExamples.length) out.push(notice(`No story other than the variant-matrix rows is deployed for ${c.folder}.`));
  for (const s of deployedExamples) out.push(`#### ${esc(s.name)}`, '', embedPair(s.id, `${c.folder} — ${s.name}`), '');
  const undeployed = c.stories.filter((s) => !s.deployed);
  if (undeployed.length) out.push('', notice(`Not in the production Storybook index: ${undeployed.map((s) => s.export).join(', ')}.`));
  out.push('', '</TabItem>', '<TabItem label="Code">', '');
  // Code
  out.push('### Import', '');
  if (isPublic) out.push('```jsx', `import { ${c.exportName} } from '${PKG}';`, `import '${PKG}/tokens.css';`, `import '${PKG}/styles.css';`, '```');
  else out.push(`${c.exportName} is internal at ${SHORT}: it is not exported from the package, so it cannot be imported.`);
  out.push('', '### Props', '');
  if (c.extendsClause) out.push(`Also accepts ${codeCell(c.extendsClause)}.`, '');
  if (!c.props.length) out.push(notice(`No props interface in ${c.path} at ${SHORT}.`));
  else {
    out.push('| Prop | Type | Default | What it does |', '|---|---|---|---|');
    for (const p of c.props) out.push(`| ${codeCell(p.name)}${p.required ? ' (required)' : ''} | ${codeCell(p.type)} | ${p.default ? codeCell(p.default) : '—'} | ${p.doc ? cell(p.doc) : '—'} |`);
  }
  out.push('', '### Types', '');
  if (!c.aliases.size) out.push(`${c.path} exports no union types.`);
  else {
    out.push('| Type | Values |', '|---|---|');
    for (const [name, a] of c.aliases) out.push(`| ${codeCell(name)} | ${codeCell(a.values)} |`);
  }
  out.push('', '### Tokens it needs', '');
  if (!i?.required_tokens?.length) out.push(notice('No required_tokens recorded in the intent file.'));
  else {
    out.push('| Token | Light | Dark |', '|---|---|---|');
    for (const t of i.required_tokens) {
      const light = resolveToken('web', t.token, 'light');
      const dark = resolveToken('web', t.token, 'dark');
      if (light === undefined) {
        out.push(`| ${codeCell(t.token)} | *not in build/css/web.css* | — |`);
        report.tokenGaps.push(`${c.folder} ${t.token}`);
        continue;
      }
      out.push(`| ${codeCell(t.token)} | ${codeCell(light)} | ${hasDark('web', t.token) || light !== dark ? codeCell(dark) : `${codeCell(dark)} (unchanged)`} |`);
    }
    out.push('', 'Values are the web platform build of the tokens at this commit, resolved through every alias.');
  }
  out.push('', '### The full API, in Storybook', '');
  if (c.docsEntry) out.push(`<div class="hds-embed-pair">\n<iframe class="hds-embed" title="${c.folder} docs (light)" loading="lazy" src="${STORYBOOK}/iframe.html?id=${c.docsEntry.id}&viewMode=docs&globals=theme:light"></iframe>\n<iframe class="hds-embed" title="${c.folder} docs (dark)" loading="lazy" src="${STORYBOOK}/iframe.html?id=${c.docsEntry.id}&viewMode=docs&globals=theme:dark"></iframe>\n</div>`);
  else out.push(notice(`The production Storybook has no docs entry for ${c.storyTitle || c.folder} in index.json, so there is no Storybook props table to embed.`));
  out.push('', '</TabItem>', '<TabItem label="Design">', '');
  // Design
  out.push('### The Figma node', '');
  if (!fig) out.push(notice(`figma.json has no entry for ${c.folder}.`));
  else {
    out.push(`<iframe class="hds-embed hds-embed--figma" title="${c.folder} in Figma" loading="lazy" src="https://embed.figma.com/design/${figma.fileKey}/?node-id=${fig.node.replace(':', '-')}&embed-host=horizon-stays-docs"></iframe>`, '');
    out.push(`Figma describes it as: *${esc(fig.description.replace(/\n/g, ' ')) || 'no description'}* · [open node ${fig.node}](${fig.figmaUrl}) · read ${figma.readAt.slice(0, 10)}`);
  }
  out.push('', '### The variant matrix', '');
  if (fig) {
    out.push('| Figma variant | Size | Story |', '|---|---|---|');
    for (const v of fig.variants) {
      const s = matrixStories.find((m) => m.cell.node === v.node);
      out.push(`| ${codeCell(v.name)} | ${v.width} × ${v.height} | ${s ? `[${esc(s.name)}](${STORYBOOK}/?path=/story/${s.id})` : '*no story pins this cell*'} |`);
    }
  }
  out.push('', '### Both themes', '');
  const whole = c.stories.find((s) => /matrix/i.test(s.export) && s.deployed) ?? matrixStories.find((s) => s.deployed);
  if (whole) out.push(embedPair(whole.id, `${c.folder} — ${whole.name}`));
  else out.push(notice(`No deployed story shows ${c.folder}'s matrix.`));
  out.push('', '### What Figma never bound', '');
  if (!fig) out.push(notice(`figma.json has no entry for ${c.folder}.`));
  else if (!fig.unbound.length) out.push(`Every fill, stroke, radius, padding, gap and text size in node ${fig.node} is bound to a variable, as read on ${figma.readAt.slice(0, 10)}.`);
  else {
    out.push('| Layer | Property | Value |', '|---|---|---|');
    for (const u of fig.unbound) out.push(`| ${cell(u.layer)} | ${codeCell(u.property)} | ${codeCell(u.value)} |`);
  }
  out.push('', '### Recorded design gaps', '');
  const dd = designDocs(c);
  if (!dd.length) out.push(notice(`No document under docs/ at ${SHORT} records a design gap for ${c.folder}.`));
  else {
    out.push('| Document | About |', '|---|---|');
    for (const d of dd) out.push(`| [docs/${d.file}](${blob(`docs/${d.file}`)}) | ${cell(d.title)}${d.own ? '' : ` (mentions ${c.folder})`} |`);
  }
  out.push('', '</TabItem>', '<TabItem label="Changelog">', '');
  // Changelog
  const log = componentLog(c);
  out.push(`Commits at ${SHORT} that touched \`src/components/${c.folder}\`${c.composes.length ? ` or what it composes (${c.composes.map((f) => `\`${f}\``).join(', ')})` : ''}, newest first. Release is the earliest tag containing the commit.`, '');
  if (!log.length) out.push(notice('No commits touch this component at the pinned commit.'));
  else {
    out.push('| Date | Commit | Subject | Release |', '|---|---|---|---|');
    for (const l of log) out.push(`| ${l.date} | [${l.hash.slice(0, 7)}](${REPO_URL}/commit/${l.hash}) | ${cell(l.subject)} | ${l.tag ? l.tag.version : 'Unreleased'} |`);
  }
  out.push('', '</TabItem>', '</Tabs>', '');
  return out.join('\n');
}

function firstGap(i, field) {
  return i.gaps?.find((g) => g.startsWith(field) || g.includes(`${field} —`))?.replace(/^[\w,. ]+ — /, '') ?? null;
}

// ---------------------------------------------------------------- other pages

function homePage() {
  const latest = tags.at(-1);
  const hero = README?.firstParagraph?.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\s+/g, ' ');
  const fm = {
    title: 'Horizon Stays Design System',
    description: 'Reference for the Horizon Stays design system: components, tokens and how to use them.',
    template: 'splash',
    editUrl: false,
    hero: {
      tagline: hero ?? `No README in the repo at ${SHORT}, so there is no introduction to show.`,
      actions: [
        { text: 'Start designing', link: '/designing/introduction/', icon: 'pencil' },
        { text: 'Start coding', link: '/developing/introduction/', icon: 'seti:json', variant: 'secondary' },
        { text: 'Open Storybook', link: STORYBOOK, icon: 'external', variant: 'minimal' },
      ],
    },
  };
  const out = [frontmatter(fm), `import { Card, CardGrid, LinkCard } from '@astrojs/starlight/components';`, ''];
  out.push('## Latest release', '');
  if (!latest) out.push(notice(`No v* tag in the repo at ${SHORT}, so there is no release to install.`));
  else {
    const name = pkgAt(latest.commit).name;
    out.push(`**${latest.version}**, tagged ${latest.date}. [What changed](/get-started/changelog/).`, '', '```bash', `npm install ${name}@${latest.version}`, '```');
  }
  out.push(
    '',
    '<CardGrid>',
    '  <LinkCard title="Designing" description="How the Figma library, the token library and the components relate." href="/designing/introduction/" />',
    '  <LinkCard title="Developing" description="Install the package, load the stylesheets, render a component." href="/developing/introduction/" />',
    '  <LinkCard title="Components" description="Every component, its status, and whether it is public." href="/core/components/overview/" />',
    '  <LinkCard title="Tokens" description="Every token in the build, per platform, in light and dark." href="/core/tokens/" />',
    '</CardGrid>',
    '',
  );
  return out.join('\n');
}

function overviewPage() {
  const out = [frontmatter({ title: 'All components', description: `Every component in src/components at ${SHORT}, with its board status.`, editUrl: false })];
  out.push(`${components.length} components are in \`src/components\` at ${SHORT}. A component gets its own page once its board status is Completed or Released **and** its release review reads Cleared; the rest are listed here with where they stand.`, '');
  out.push('| Component | Board status | Public API | Page |', '|---|---|---|---|');
  for (const c of components) {
    const row = boardRow(c);
    const pub = new RegExp(`export\\s*\\{\\s*${c.exportName}\\b`).test(indexTs);
    const page = eligible.includes(c) ? `[${c.folder}](/core/components/${slugOf(c.folder)}/)` : '—';
    out.push(`| ${code(c.folder)} | ${esc(row?.development ?? 'not on the board')} | ${pub ? 'exported' : internalNamed(c.folder) ? 'internal (by decision)' : 'not yet public'} | ${page} |`);
  }
  out.push('', `Status comes from the component registry, read ${board.readAt.slice(0, 10)}. Public API is \`src/index.ts\` at ${SHORT}.`, '');
  return out.join('\n');
}

function tokensPage() {
  const names = [...css.web.root.keys()];
  const groups = new Map();
  for (const n of names) {
    const parts = n.slice(2).split('-');
    const key = ['core', 'semantic', 'component'].includes(parts[0]) ? `${parts[0]}-${parts[1]}` : 'text styles';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(n);
  }
  const out = [frontmatter({ title: 'Tokens', description: `Every token in build/css at ${SHORT}, per platform, in light and dark.`, editUrl: false })];
  out.push(`${names.length} tokens, built from \`tokens/\` at ${SHORT} for three platforms. **Light** and **Dark** are the web values, resolved through every alias; a dark value marked *unchanged* has no dark override. **Other platforms** lists mobile and back-office only where they differ from web.`, '');
  out.push(`The package's \`tokens.css\` is the web build. Components read the semantic, component and text-style tokens; the \`core\` layer is what those point at.`, '');
  for (const [group, list] of [...groups.entries()].sort(([a], [b]) => byName(a, b))) {
    out.push(`## ${group}`, '', '| Token | Points at | Light | Dark | Other platforms |', '|---|---|---|---|---|');
    for (const n of list) {
      const decl = declared('web', n);
      const alias = decl?.match(/^var\((--[\w-]+)\)$/)?.[1];
      const light = resolveToken('web', n, 'light');
      const dark = resolveToken('web', n, 'dark');
      const others = ['mobile', 'back-office']
        .map((p) => {
          const pl = resolveToken(p, n, 'light');
          const pd = resolveToken(p, n, 'dark');
          if (pl === undefined) return `${p}: absent`;
          const diff = [];
          if (pl !== light) diff.push(`light ${code(pl)}`);
          if (pd !== dark) diff.push(`dark ${code(pd)}`);
          return diff.length ? `${p}: ${diff.join(', ')}` : null;
        })
        .filter(Boolean);
      out.push(`| ${codeCell(n)} | ${alias ? codeCell(alias) : '—'} | ${codeCell(light ?? '')} | ${hasDark('web', n) ? codeCell(dark ?? '') : '*unchanged*'} | ${others.length ? others.join('; ').replace(/\|/g, '\\|') : '—'} |`);
    }
    out.push('');
  }
  return out.join('\n');
}

function releaseLog() {
  const sections = [];
  const bounds = [...tags].reverse();
  const unreleased = tags.length ? git('log', `${tags.at(-1).name}..${SHA}`, '--format=%H%x09%ad%x09%s', '--date=short', '--no-merges') : git('log', SHA, '--format=%H%x09%ad%x09%s', '--date=short', '--no-merges');
  const parse = (s) => s.split('\n').filter(Boolean).map((l) => l.split('\t'));
  sections.push({ title: 'Unreleased', note: `On main at ${SHORT}, after the newest tag.`, commits: parse(unreleased) });
  bounds.forEach((t, i) => {
    const prev = bounds[i + 1];
    const range = prev ? `${prev.name}..${t.name}` : t.name;
    sections.push({ title: t.version, note: `Tagged ${t.date}${prev ? `, since ${prev.version}` : ', the first release'}.`, commits: parse(git('log', range, '--format=%H%x09%ad%x09%s', '--date=short', '--no-merges')) });
  });
  return sections;
}

function changelogPage() {
  const out = [frontmatter({ title: 'Changelog', description: `Every release tag, newest first, with the commits in it. Generated at ${SHORT}.`, editUrl: false })];
  if (!tags.length) out.push(notice(`No v* tag in the repo at ${SHORT}.`), '');
  const hasChangelogMd = has('CHANGELOG.md');
  if (hasChangelogMd) out.push(`The release notes, written with each release, are in [CHANGELOG.md](${blob('CHANGELOG.md')}). This page lists the commits.`, '');
  for (const s of releaseLog()) {
    out.push(`## ${s.title}`, '', s.note, '');
    if (!s.commits.length) {
      out.push('No commits.', '');
      continue;
    }
    out.push('| Date | Commit | Subject |', '|---|---|---|');
    for (const [hash, date, subject] of s.commits) out.push(`| ${date} | [${hash.slice(0, 7)}](${REPO_URL}/commit/${hash}) | ${cell(subject)} |`);
    out.push('');
  }
  return out.join('\n');
}

const LADDER = ['Released', 'Completed', 'To be deployed', 'Fixed', 'Fixing', 'To be fixed', 'Ready for Testing', 'To-do'];
function roadmapPage() {
  const out = [frontmatter({ title: 'Roadmap', description: 'Every component on the board, by where it stands. No dates: the board states none.', editUrl: false })];
  out.push(`Every component on the registry board, grouped by its status, read ${board.readAt.slice(0, 10)}. The board states no dates, owners or priorities, so neither does this page.`, '');
  out.push(':::note[To-do does not mean designed]\nA component with an empty Design column also reads To-do, so To-do alone does not mean the design is signed off.\n:::', '');
  const statuses = [...LADDER, ...new Set(board.components.map((r) => r.development).filter((s) => !LADDER.includes(s)))];
  for (const s of statuses) {
    const rows = board.components.filter((r) => r.development === s);
    if (!rows.length) continue;
    out.push(`## ${s} (${rows.length})`, '', rows.map((r) => `${code(r.name)}${r.category ? ` · ${r.category.toLowerCase()}` : ''}`).join(' · '), '');
  }
  return out.join('\n');
}

function newsPage() {
  const out = [frontmatter({ title: 'News', description: 'Releases, and the components that reached production.', editUrl: false })];
  out.push('## Releases', '');
  if (!tags.length) out.push(notice(`No v* tag in the repo at ${SHORT}.`));
  for (const t of [...tags].reverse()) {
    const exported = [...git('show', `${t.commit}:src/index.ts`).matchAll(/export\s*\{\s*(\w+)/g)].map((m) => m[1]);
    out.push(`### ${t.version} · ${t.date}`, '', `${pkgAt(t.commit).name}@${t.version} exports ${exported.map(code).join(', ') || 'nothing'}. [Changelog](/get-started/changelog/).`, '');
  }
  out.push('## Reached production', '');
  const prod = board.components.filter((r) => ['Completed', 'Released'].includes(r.development));
  if (!prod.length) out.push('No component on the board reads Completed or Released.');
  else out.push(`Read ${board.readAt.slice(0, 10)} from the board, which records no dates: ${prod.map((r) => `${code(r.name)} (${r.development})`).join(', ')}.`);
  out.push('');
  return out.join('\n');
}

// ---------------------------------------------------------------- write

const report = { unclassified: [], tokenGaps: [] };
const generated = {
  'index.mdx': homePage(),
  'core/components/overview.mdx': overviewPage(),
  'core/tokens.mdx': tokensPage(),
  'get-started/changelog.mdx': changelogPage(),
  'get-started/roadmap.mdx': roadmapPage(),
  'get-started/news.mdx': newsPage(),
};
for (const c of eligible) generated[`core/components/${slugOf(c.folder)}.mdx`] = componentPage(c);

rmSync(join(docs, 'core'), { recursive: true, force: true });
for (const f of ['index.mdx', 'get-started/changelog.mdx', 'get-started/roadmap.mdx', 'get-started/news.mdx', 'components']) rmSync(join(docs, f), { recursive: true, force: true });
for (const [rel, body] of Object.entries(generated)) {
  mkdirSync(dirname(join(docs, rel)), { recursive: true });
  writeFileSync(join(docs, rel), body);
}

// The site's own copy of the web token build, loaded before custom.css.
copyFileSync(join(repo, 'build', 'css', 'web.css'), join(site, 'src', 'styles', 'tokens.css'));

// Build info for the footer: every page states the commit it was built from.
writeFileSync(join(site, 'src', 'build-info.json'), JSON.stringify({ commit: SHA, short: SHORT, package: PKG, latest: tags.at(-1)?.version ?? null, generatedAt: new Date().toISOString() }, null, 2) + '\n');

// The per-component sidebar entries, written out slug by slug in astro.config.mjs.
const configPath = join(site, 'astro.config.mjs');
// Git on Windows may check the file out with CRLF; the markers are matched on LF.
const config = readFileSync(configPath, 'utf8').replace(/\r\n/g, '\n');
const block = eligible.map((c) => `              { label: '${c.folder}', slug: 'core/components/${slugOf(c.folder)}' },`).join('\n');
const next = config.replace(/(\/\/ <generated:components>\n)[\s\S]*?\/\/ <\/generated:components>/, `$1${block}${block ? '\n' : ''}              // </generated:components>`);
if (next === config && !config.includes(block)) fail('astro.config.mjs has no // <generated:components> block to write the component entries into');
writeFileSync(configPath, next);

console.log(`generate: ${Object.keys(generated).length} pages from ${PKG} at ${SHORT} (tags: ${tags.map((t) => t.name).join(', ') || 'none'})`);
console.log(`  component pages: ${eligible.map((c) => c.folder).join(', ') || 'none'}`);
if (report.unclassified.length) console.log(`  unclassified stories → Examples: ${report.unclassified.join(', ')}`);
if (report.tokenGaps.length) console.log(`  tokens not in build/css/web.css: ${report.tokenGaps.join(', ')}`);
