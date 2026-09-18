/**
 * The one rule CLAUDE.md will not bend on:
 *
 *   "Tokens are the only source of visual values. Every color, space, radius
 *    and font value in a component references a token."
 *   "A component referencing a raw hex is wrong."
 *   "Semantic tokens point at primitives. Components use semantic tokens only."
 *
 * This test reads every component stylesheet under src/components and fails
 * on a raw hex, a raw px/rem length, a named font family, or a read of a
 * base-layer `--core-*` token. It is deliberately cheap — no DOM, no renderer
 * — so it can run on every commit, and it guards every component this repo
 * grows, not just the first one.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const COMPONENTS_DIR = join(process.cwd(), 'src', 'components');

function cssFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...cssFiles(full));
    else if (entry.endsWith('.css')) out.push(full);
  }
  return out;
}

/** Strip /* ... *\/ comments so prose about tokens is not mistaken for CSS. */
function stripComments(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

/** Declaration lines only — selectors and at-rules carry no visual values. */
function declarations(css: string): { line: string; n: number }[] {
  return stripComments(css)
    .split('\n')
    .map((line, i) => ({ line: line.trim(), n: i + 1 }))
    .filter((entry) => entry.line.includes(':') && !entry.line.startsWith('@'));
}

const RAW_HEX = /#[0-9a-fA-F]{3,8}\b/;
const RAW_FUNCTIONAL_COLOR = /\b(?:rgba?|hsla?|oklch|lab)\s*\(/;
/** Any absolute or font-relative length. Ratios and unitless 0 are structural. */
const RAW_LENGTH = /(?<![\w-])\d*\.?\d+(?:px|rem|em|pt|ch|ex)\b/;
/**
 * A font-family must lead with the token. Only generic families may follow —
 * .storybook/preview-head.html is explicit that every font-family token
 * carries a generic fallback at the point of use, so the stack is required,
 * not a leak.
 */
const GENERIC_FAMILIES = new Set([
  'system-ui',
  'ui-sans-serif',
  'ui-serif',
  'ui-monospace',
  'ui-rounded',
  'sans-serif',
  'serif',
  'monospace',
  'cursive',
  'fantasy',
  'math',
  'emoji',
  'fangsong',
]);

/**
 * Semantic tokens only. A component that reads a `--core-*` token has reached
 * past the semantic layer into the primitives it points at, so a re-themed
 * mode changes under the component without the semantic layer getting a say.
 *
 * Release gate G3 in `.claude/skills/release-review/SKILL.md` fails a
 * component on exactly this. Until this check existed the gate was the only
 * thing that caught it, which let a stylesheet reach `Completed` on a green
 * test run and then block at review — the expensive end to find out.
 */
const BASE_LAYER_TOKEN = /var\(\s*(--core-[A-Za-z0-9-]+)/g;

function badFontFamily(decl: string): boolean {
  const match = /font-family\s*:\s*([^;]+)/.exec(decl);
  if (!match) return false;
  const [lead, ...fallbacks] = match[1]!.split(',').map((part) => part.trim());
  if (!lead?.startsWith('var(')) return true;
  return fallbacks.some((family) => !GENERIC_FAMILIES.has(family.toLowerCase()));
}

const files = cssFiles(COMPONENTS_DIR);

describe('component stylesheets use tokens, never raw values', () => {
  it('finds at least one component stylesheet to check', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  for (const file of files) {
    const rel = file.slice(COMPONENTS_DIR.length + 1).replace(/\\/g, '/');
    const decls = declarations(readFileSync(file, 'utf8'));

    it(`${rel} has no raw colour`, () => {
      const bad = decls.filter(
        (d) => RAW_HEX.test(d.line) || RAW_FUNCTIONAL_COLOR.test(d.line),
      );
      expect(bad.map((d) => `line ${d.n}: ${d.line}`)).toEqual([]);
    });

    it(`${rel} has no raw length`, () => {
      const bad = decls.filter((d) => RAW_LENGTH.test(d.line));
      expect(bad.map((d) => `line ${d.n}: ${d.line}`)).toEqual([]);
    });

    it(`${rel} names no font family outside a token`, () => {
      const bad = decls.filter((d) => badFontFamily(d.line));
      expect(bad.map((d) => `line ${d.n}: ${d.line}`)).toEqual([]);
    });

    it(`${rel} reads no base-layer --core-* token`, () => {
      const bad = decls.flatMap((d) =>
        [...d.line.matchAll(BASE_LAYER_TOKEN)].map((m) => `line ${d.n}: ${m[1]}`),
      );
      expect(bad).toEqual([]);
    });
  }
});
