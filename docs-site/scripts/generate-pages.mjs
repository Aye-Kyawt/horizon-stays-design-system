/**
 * Writes one Starlight page per component in ../src/components.
 *
 * Nothing on a component page is written by hand. Each page is read straight
 * off the component's own source:
 *
 *   header comment   the first /** *\/ block in <name>.tsx — summary, Figma
 *                    node, and the matrix notes the Engineer recorded
 *   props            the exported `<Name>Props` interface, with each prop's
 *                    JSDoc, its type (aliases resolved) and its default
 *   stories          the `title` and exports of <name>.stories.tsx, linked
 *                    into the production Storybook
 *   naming notes     any docs/<name>-*.md report, linked on GitHub
 *
 * Output goes to src/content/docs/components/, which is gitignored. Run it
 * through `npm run dev` or `npm run build`, never edit its output.
 */

import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, '..', '..');
const componentsDir = join(repo, 'src', 'components');
const reportsDir = join(repo, 'docs');
const outDir = resolve(here, '..', 'src', 'content', 'docs', 'components');

const STORYBOOK = (process.env.STORYBOOK_URL ?? 'https://horizon-stays-storybook-production.vercel.app').replace(/\/$/, '');
const GITHUB = 'https://github.com/Aye-Kyawt/horizon-stays-design-system/blob/main';

/** Storybook's own id rule: lowercase, runs of anything else become one dash. */
const sanitize = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

/** `FillDefault` -> `fill-default`, `Default32` -> `default-32`, as Storybook ids them. */
const storyIdPart = (exportName) =>
  sanitize(exportName.replace(/([a-z])([A-Z0-9])/g, '$1 $2').replace(/([0-9])([A-Za-z])/g, '$1 $2'));

const escapeCell = (s) => s.replace(/\|/g, '\\|').replace(/\n+/g, ' ').trim();

/** Strips `/**`, `*\/` and the leading ` * ` from a JSDoc block. */
function jsdocText(block) {
  return block
    .trim()
    .replace(/^\/\*\*/, '')
    .replace(/\*\/$/, '')
    .split('\n')
    .map((l) => l.replace(/^\s*\* ?/, ''))
    .join('\n')
    .trim();
}

/** Turns a header comment into markdown: indented runs become code blocks. */
function headerToMarkdown(lines) {
  const out = [];
  let code = [];
  const flush = () => {
    if (code.length) out.push('```text', ...code, '```');
    code = [];
  };
  for (const line of lines) {
    if (/^ {2,}\S/.test(line)) {
      code.push(line);
    } else {
      flush();
      out.push(line);
    }
  }
  flush();
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

function parseComponent(name) {
  const dir = join(componentsDir, name);
  const files = readdirSync(dir);
  const source = files.find((f) => f.endsWith('.tsx') && !/\.(stories|test)\.tsx$/.test(f));
  if (!source) return null;
  // The repo checks out with CRLF on Windows; every regex below assumes \n.
  const src = readFileSync(join(dir, source), 'utf8').replace(/\r\n/g, '\n');

  // Header comment.
  const headerMatch = src.match(/\/\*\*[\s\S]*?\*\//);
  const header = headerMatch ? jsdocText(headerMatch[0]).split('\n') : [];
  const firstLine = header.shift() ?? name;
  // `.Button — the CTA.` -> `The CTA.`; a quoted Figma description loses its quotes.
  const stripped = firstLine.replace(/^\.?[\w]+\s*[—-]\s*/, '').trim().replace(/^"(.*)"$/, '$1');
  const summary = stripped.charAt(0).toUpperCase() + stripped.slice(1);
  let figmaNode = '';
  let figmaUrl = '';
  const body = [];
  for (const line of header) {
    const node = line.match(/^Figma node:\s*(.+)$/);
    if (node && !figmaNode) {
      figmaNode = node[1].trim();
      continue;
    }
    if (/^https:\/\/www\.figma\.com\//.test(line.trim()) && !figmaUrl) {
      figmaUrl = line.trim();
      continue;
    }
    body.push(line);
  }
  // Link the node the header names, not whichever URL follows it: cardContainer
  // names its component set but its URL points at the instance it was built from.
  const nodeId = figmaNode.match(/\d+:\d+/)?.[0];
  if (nodeId && figmaUrl) {
    figmaUrl = figmaUrl.replace(/node-id=[\d-]+/, `node-id=${nodeId.replace(':', '-')}`);
  }

  // Exported type aliases, so a prop typed `ButtonType` can show its values.
  const aliases = new Map();
  for (const m of src.matchAll(/^export type (\w+)\s*=\s*([\s\S]*?);\s*$/gm)) {
    aliases.set(m[1], m[2].replace(/\s+/g, ' ').trim());
  }

  // Defaults from the function's destructured parameters.
  const defaults = new Map();
  const fn = src.match(/export function \w+\(\s*\{([\s\S]*?)\}\s*:/);
  if (fn) {
    for (const m of fn[1].matchAll(/(\w+)\s*=\s*([^,\n]+)/g)) defaults.set(m[1], m[2].trim());
  }

  // The props interface.
  const props = [];
  let extendsClause = '';
  const iface = src.match(/export interface (\w+Props)\s*([\s\S]*?)\{\n([\s\S]*?)\n\}/);
  if (iface) {
    extendsClause = iface[2].replace(/^extends\s*/, '').replace(/\s+/g, ' ').trim();
    let doc = '';
    const bodyLines = iface[3].split('\n');
    for (let i = 0; i < bodyLines.length; i++) {
      const line = bodyLines[i];
      if (/^\s*\/\*\*/.test(line)) {
        const block = [line];
        while (!/\*\//.test(bodyLines[i]) && i < bodyLines.length - 1) block.push(bodyLines[++i]);
        doc = jsdocText(block.join('\n'));
        continue;
      }
      const prop = line.match(/^\s*(\w+)(\?)?:\s*(.+?);\s*$/);
      if (prop) {
        const [, propName, optional, type] = prop;
        const resolved = aliases.get(type);
        props.push({
          name: propName,
          required: !optional,
          type: resolved ? `${type} = ${resolved}` : type,
          default: defaults.get(propName) ?? '',
          doc,
        });
        doc = '';
      }
    }
  }

  // Stories.
  const storiesFile = files.find((f) => f.endsWith('.stories.tsx'));
  let storyTitle = '';
  const stories = [];
  if (storiesFile) {
    const s = readFileSync(join(dir, storiesFile), 'utf8').replace(/\r\n/g, '\n');
    storyTitle = s.match(/title:\s*'([^']+)'/)?.[1] ?? '';
    for (const m of s.matchAll(/^export const (\w+)/gm)) stories.push(m[1]);
  }

  // Naming and design-gap reports that mention this component by file name.
  const reports = existsSync(reportsDir)
    ? readdirSync(reportsDir).filter((f) => f.startsWith(`${name}-`) && f.endsWith('.md'))
    : [];

  return { name, source, summary, figmaNode, figmaUrl, body, extendsClause, props, storyTitle, stories, reports };
}

function renderPage(c, order) {
  const storyId = (exp) => `${sanitize(c.storyTitle)}--${storyIdPart(exp)}`;
  const featured = c.stories.find((s) => /matrix/i.test(s)) ?? c.stories[0];
  const lines = [
    '---',
    `title: ${JSON.stringify(c.name)}`,
    `description: ${JSON.stringify(c.summary)}`,
    `sidebar:`,
    `  order: ${order}`,
    'editUrl: false',
    '---',
    '',
    `> ${c.summary}`,
    '',
  ];

  const facts = [];
  if (c.figmaNode) facts.push(`**Figma node** ${c.figmaUrl ? `[${c.figmaNode}](${c.figmaUrl})` : c.figmaNode}`);
  if (c.storyTitle) facts.push(`**Storybook** [${c.storyTitle}](${STORYBOOK}/?path=/story/${storyId(c.stories[0])})`);
  facts.push(`**Source** [src/components/${c.name}/${c.source}](${GITHUB}/src/components/${c.name}/${c.source})`);
  lines.push(facts.join(' · '), '');

  if (featured) {
    lines.push(
      '## Preview',
      '',
      `<iframe class="hs-embed" title="${c.name} — ${featured}" loading="lazy" src="${STORYBOOK}/iframe.html?id=${storyId(featured)}&viewMode=story"></iframe>`,
      '',
    );
  }

  lines.push('## Props', '');
  if (c.extendsClause) lines.push(`Also accepts \`${c.extendsClause}\`.`, '');
  if (c.props.length) {
    lines.push('| Prop | Type | Default | Description |', '|---|---|---|---|');
    for (const p of c.props) {
      lines.push(
        `| \`${p.name}\`${p.required ? ' *(required)*' : ''} | \`${escapeCell(p.type)}\` | ${p.default ? `\`${escapeCell(p.default)}\`` : '—'} | ${escapeCell(p.doc) || '—'} |`,
      );
    }
  } else {
    lines.push('No props interface was found in the source.');
  }
  lines.push('');

  if (c.stories.length) {
    lines.push('## Stories', '');
    for (const s of c.stories) lines.push(`- [${s}](${STORYBOOK}/?path=/story/${storyId(s)})`);
    lines.push('');
  }

  const notes = headerToMarkdown(c.body);
  if (notes) lines.push('## Implementation notes', '', notes, '');

  if (c.reports.length) {
    lines.push('## Reports', '');
    for (const r of c.reports) lines.push(`- [docs/${r}](${GITHUB}/docs/${r})`);
    lines.push('');
  }

  return lines.join('\n');
}

function renderIndex(components) {
  return [
    '---',
    'title: Components',
    'description: Every component in the Horizon Stays design system.',
    'sidebar:',
    '  order: 0',
    '  label: All components',
    'editUrl: false',
    '---',
    '',
    `${components.length} components, generated from \`src/components/\`.`,
    '',
    '| Component | Summary | Figma node |',
    '|---|---|---|',
    ...components.map(
      (c) =>
        `| [${c.name}](/components/${c.name.toLowerCase()}/) | ${escapeCell(c.summary)} | ${c.figmaUrl ? `[${escapeCell(c.figmaNode)}](${c.figmaUrl})` : escapeCell(c.figmaNode) || '—'} |`,
    ),
    '',
  ].join('\n');
}

const components = readdirSync(componentsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => parseComponent(d.name))
  .filter(Boolean)
  .sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'index.md'), renderIndex(components));
components.forEach((c, i) => writeFileSync(join(outDir, `${c.name.toLowerCase()}.md`), renderPage(c, i + 1)));

console.log(`reference site: wrote ${components.length} component pages to ${outDir}`);
