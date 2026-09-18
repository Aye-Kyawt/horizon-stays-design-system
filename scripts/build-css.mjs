/**
 * Writes the package's two stylesheets into dist/:
 *
 *   dist/styles.css   src/styles.css with every @import inlined, so the
 *                     published file stands alone and points at nothing in src/
 *   dist/tokens.css   build/css/web.css — the web platform build of the tokens,
 *                     the one Storybook loads by default
 *
 * Runs after `build:tokens` and `build:lib` (see `build:package`). tsup cleans
 * dist/ at the start of `build:lib`, which is why this step comes after it.
 *
 * No bundler: the component stylesheets import nothing and reference no
 * url(), so inlining is a straight read. The script fails rather than guess if
 * that stops being true, and fails if a component stylesheet exists that
 * src/styles.css does not import — a component shipped without its styles
 * renders, looks broken, and no test catches it.
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

const ROOT = process.cwd();
const ENTRY = join(ROOT, 'src', 'styles.css');
const COMPONENTS = join(ROOT, 'src', 'components');
const TOKENS = join(ROOT, 'build', 'css', 'web.css');
const DIST = join(ROOT, 'dist');

const IMPORT = /^\s*@import\s+['"]([^'"]+)['"]\s*;\s*$/;
const rel = (p) => relative(ROOT, p).replace(/\\/g, '/');

function fail(message) {
  console.error(`build:css — ${message}`);
  process.exit(1);
}

function componentStylesheets(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return componentStylesheets(full);
    return entry.name.endsWith('.css') ? [full] : [];
  });
}

const entry = readFileSync(ENTRY, 'utf8').replace(/\r\n/g, '\n');
const imported = new Set();
const out = [];

for (const line of entry.split('\n')) {
  const match = IMPORT.exec(line);
  if (!match) {
    out.push(line);
    continue;
  }
  const target = resolve(dirname(ENTRY), match[1]);
  if (!existsSync(target)) fail(`${rel(ENTRY)} imports ${match[1]}, which does not exist`);
  if (imported.has(target)) fail(`${rel(ENTRY)} imports ${match[1]} twice`);
  imported.add(target);

  const css = readFileSync(target, 'utf8').replace(/\r\n/g, '\n').trim();
  if (/@import\b/.test(css)) fail(`${rel(target)} has its own @import; inline it or teach this script`);
  if (/url\(/.test(css)) fail(`${rel(target)} uses url(); relative paths would break once inlined`);
  out.push(`/* ${rel(target)} */`, css);
}

const missing = componentStylesheets(COMPONENTS).filter((file) => !imported.has(file));
if (missing.length > 0) {
  fail(`src/styles.css does not import: ${missing.map(rel).join(', ')}`);
}

if (!existsSync(TOKENS)) fail(`${rel(TOKENS)} is missing — run \`npm run build:tokens\` first`);

mkdirSync(DIST, { recursive: true });
writeFileSync(join(DIST, 'styles.css'), `${out.join('\n').trim()}\n`);
writeFileSync(join(DIST, 'tokens.css'), readFileSync(TOKENS, 'utf8'));

console.log(`✔ dist/styles.css (${imported.size} component stylesheets)`);
console.log('✔ dist/tokens.css (web platform)');
