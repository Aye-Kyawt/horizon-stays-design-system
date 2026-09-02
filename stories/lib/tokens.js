/**
 * Reads the generated platform CSS and turns it back into structured token
 * records for the stories to render.
 *
 * The build script is the single source of truth: these files are imported
 * raw, so anything `npm run build:tokens` emits shows up in Storybook on the
 * next reload. Nothing here is hand-maintained per token.
 */

import webCss from '../../build/css/web.css?raw';
import mobileCss from '../../build/css/mobile.css?raw';
import backOfficeCss from '../../build/css/back-office.css?raw';

export const PLATFORM_CSS = {
  web: webCss,
  mobile: mobileCss,
  'back-office': backOfficeCss,
};

export const PLATFORMS = Object.keys(PLATFORM_CSS);
export const THEMES = ['light', 'dark'];

/** The five sub-properties a DTCG typography composite is exploded into. */
const TYPE_SUFFIXES = [
  'font-family',
  'font-size',
  'line-height',
  'letter-spacing',
  'font-weight',
];

const DECL = /^\s*--([A-Za-z0-9-]+)\s*:\s*(.+?);\s*(?:\/\*\*([\s\S]*?)\*\/)?\s*$/;

/** Grab the body of the first `selector { ... }` block. Declarations never
 *  contain braces, so scanning to the next `}` is enough. */
function section(css, selector) {
  const start = css.indexOf(selector);
  if (start === -1) return '';
  const open = css.indexOf('{', start);
  const close = css.indexOf('}', open);
  if (open === -1 || close === -1) return '';
  return css.slice(open + 1, close);
}

function parseDecls(body) {
  const out = [];
  for (const line of body.split('\n')) {
    const m = DECL.exec(line);
    if (!m) continue;
    out.push({
      name: m[1],
      value: m[2].trim(),
      description: (m[3] || '').trim(),
    });
  }
  return out;
}

/** Follow `var(--x)` chains until a literal falls out. */
function resolve(value, map, depth = 0) {
  if (depth > 24 || !value.includes('var(')) return value;
  const next = value.replace(/var\(--([A-Za-z0-9-]+)\)/g, (whole, ref) =>
    map[ref] === undefined ? whole : map[ref],
  );
  return next === value ? value : resolve(next, map, depth + 1);
}

/** The token this one points at, if it is a pure alias. */
function aliasOf(value) {
  const m = /^var\(--([A-Za-z0-9-]+)\)$/.exec(value.trim());
  return m ? m[1] : null;
}

function classify(name) {
  const typeSuffix = TYPE_SUFFIXES.find((s) => name.endsWith(`-${s}`));
  if (typeSuffix) {
    return {
      category: 'typography',
      stem: name.slice(0, -(typeSuffix.length + 1)),
      prop: typeSuffix,
    };
  }
  if (name.startsWith('core-color-')) {
    const rest = name.slice('core-color-'.length);
    const cut = rest.lastIndexOf('-');
    return {
      category: 'core-color',
      family: cut === -1 ? rest : rest.slice(0, cut),
      step: cut === -1 ? '' : rest.slice(cut + 1),
    };
  }
  if (name.startsWith('semantic-color-')) {
    const rest = name.slice('semantic-color-'.length);
    return { category: 'semantic-color', group: rest.split('-')[0] };
  }
  if (name.startsWith('core-spacing-') || name.startsWith('semantic-spacing-') ||
      name.startsWith('semantic-layout-')) {
    return { category: 'spacing', tier: name.startsWith('core-') ? 'core' : 'semantic' };
  }
  const tier = name.startsWith('core-') ? 'core' : 'semantic';
  if (name.includes('border-radius-')) return { category: 'radius', tier };
  if (name.includes('border-width-')) return { category: 'border-width', tier };
  if (name.startsWith('core-size-')) return { category: 'size' };
  if (name.includes('elevation-')) return { category: 'elevation' };
  if (name.startsWith('core-type-')) return { category: 'type-primitive' };
  if (name.startsWith('component-')) {
    return { category: 'component', component: name.split('-')[1] };
  }
  return { category: 'other' };
}

function build(platform) {
  const css = PLATFORM_CSS[platform];
  const light = parseDecls(section(css, ':root'));
  const darkDecls = parseDecls(section(css, '[data-theme="dark"]'));

  const lightMap = Object.fromEntries(light.map((d) => [d.name, d.value]));
  const darkRaw = Object.fromEntries(darkDecls.map((d) => [d.name, d.value]));
  const darkMap = { ...lightMap, ...darkRaw };

  const tokens = light.map((d) => {
    // In dark, a token that carries its own override resolves from that
    // declaration — not from the :root one. Starting both themes at d.value
    // silently returns the light value for every overridden token.
    const overriddenInDark = Object.prototype.hasOwnProperty.call(darkRaw, d.name);
    const darkValue = overriddenInDark ? darkRaw[d.name] : d.value;

    return {
      ...d,
      ...classify(d.name),
      platform,
      alias: aliasOf(d.value),
      aliasDark: aliasOf(darkValue),
      overriddenInDark,
      resolved: { light: resolve(d.value, lightMap), dark: resolve(darkValue, darkMap) },
    };
  });

  return {
    platform,
    tokens,
    byName: Object.fromEntries(tokens.map((t) => [t.name, t])),
    darkOverrideCount: darkDecls.length,
  };
}

const cache = new Map();

/** Parsed token set for one platform. Memoised — the CSS never changes at runtime. */
export function tokensFor(platform) {
  if (!cache.has(platform)) cache.set(platform, build(platform));
  return cache.get(platform);
}

/** Every token in a category, in the order the build script emitted them. */
export function byCategory(platform, category) {
  return tokensFor(platform).tokens.filter((t) => t.category === category);
}

/**
 * Typography sub-properties regrouped back into the composite styles they
 * came from, so a specimen can be rendered from one record.
 */
export function typographyStyles(platform) {
  const groups = new Map();
  for (const t of byCategory(platform, 'typography')) {
    if (!groups.has(t.stem)) {
      groups.set(t.stem, { stem: t.stem, description: t.description, props: {}, tokens: [] });
    }
    const g = groups.get(t.stem);
    g.props[t.prop] = t;
    g.tokens.push(t);
    if (!g.description && t.description) g.description = t.description;
  }
  return [...groups.values()];
}

/** Typography stems split into the families the design system talks about. */
export function typographyFamily(stem) {
  if (stem.startsWith('semantic-type-myanmar-')) return 'semantic-myanmar';
  if (stem.startsWith('semantic-type-latin-')) return 'semantic-latin';
  if (stem.startsWith('text-myanmar-')) return 'document-myanmar';
  if (stem.startsWith('text-latin-')) return 'document-latin';
  if (stem.startsWith('myanmar-')) return 'scale-myanmar';
  return 'scale-latin';
}

/** A CSS declaration block that applies a whole composite style. */
export function typeStyleCss(style) {
  return TYPE_SUFFIXES.filter((p) => style.props[p])
    .map((p) => `${p}: var(--${style.props[p].name});`)
    .join(' ');
}

/** Sort numeric-ish token steps (50, 100, ... / 2xs, xs, sm ...) sensibly. */
const NAMED_ORDER = ['none', '3xs', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'full'];
export function stepRank(step) {
  const n = Number(step);
  if (!Number.isNaN(n)) return n;
  const i = NAMED_ORDER.indexOf(step);
  return i === -1 ? 9998 : i;
}
