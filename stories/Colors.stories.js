import { byCategory, stepRank } from './lib/tokens.js';
import { el, group, page, shortDesc, tokenName } from './lib/ui.js';

export default {
  title: 'Colour',
};

/** A colour chip with its name, resolved value and the alias behind it. */
function swatch(token, theme) {
  const value = token.resolved[theme];
  // Overridden tokens point somewhere else in dark, so show that alias.
  const alias = theme === 'dark' && token.overriddenInDark ? token.aliasDark : token.alias;
  return el('div', { class: 'hds-card' }, [
    el('span', {
      class: 'hds-chip',
      style: `background: var(--${token.name}); border-bottom: 1px solid var(--semantic-color-border-subtle);`,
    }),
    el('div', { class: 'hds-card-body' }, [
      tokenName(token.name),
      el('div', { class: 'hds-value', text: value }),
      alias ? el('div', { class: 'hds-value', text: `→ --${alias}` }) : null,
      token.description
        ? el('div', { class: 'hds-desc', text: shortDesc(token.description) })
        : null,
      token.overriddenInDark
        ? el('span', { class: 'hds-badge', text: 'differs in dark' })
        : null,
    ]),
  ]);
}

function grid(tokens, theme, className = 'hds-cards') {
  return el(
    'div',
    { class: `hds-grid ${className}` },
    tokens.map((t) => swatch(t, theme)),
  );
}

/** Core ramps, one section per hue family, ordered 50 → 950. */
function corePage(platform, theme) {
  const tokens = byCategory(platform, 'core-color');
  const families = new Map();
  for (const t of tokens) {
    if (!families.has(t.family)) families.set(t.family, []);
    families.get(t.family).push(t);
  }

  const sections = [...families.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([family, list]) =>
      group(
        family,
        grid(
          [...list].sort((a, b) => stepRank(a.step) - stepRank(b.step)),
          theme,
          'hds-ramp',
        ),
      ),
    );

  return page({
    title: 'Core colour primitives',
    intro:
      'The raw ramps. These are literal hex values and they do not change between light and dark — a primitive is a pigment, not a decision. Reference a semantic token in product code instead of reaching for these.',
    count: tokens.length,
    children: sections,
  });
}

const SEMANTIC_GROUP_NOTES = {
  bg: 'Surfaces and fills, from the page ground up to overlays.',
  text: 'Type colours. Every one of these is contrast-checked against the surfaces it is allowed to sit on.',
  border: 'Strokes, dividers and focus rings.',
  icon: 'Icon fills — kept separate from text so an icon can carry status colour without the label doing the same.',
  decorative: 'The non-semantic accent hues. Use them for categories and illustration, never for status.',
  shadow: 'The shadow ink the elevation tokens compose with.',
};

/** Semantic colours, one section per role group, resolved for the live theme. */
function semanticPage(platform, theme) {
  const tokens = byCategory(platform, 'semantic-color');
  const groups = new Map();
  for (const t of tokens) {
    if (!groups.has(t.group)) groups.set(t.group, []);
    groups.get(t.group).push(t);
  }

  const order = ['bg', 'text', 'border', 'icon', 'decorative', 'shadow'];
  const sections = [...groups.entries()]
    .sort(([a], [b]) => {
      const ia = order.indexOf(a);
      const ib = order.indexOf(b);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    })
    .map(([name, list]) =>
      group(name, grid(list, theme), SEMANTIC_GROUP_NOTES[name]),
    );

  const overridden = tokens.filter((t) => t.overriddenInDark).length;

  return page({
    title: 'Semantic colours',
    intro:
      `The layer product code should use. Each one aliases a core primitive and carries the role in its name. ${overridden} of them change between light and dark — flip the Theme toolbar to watch them move.`,
    count: tokens.length,
    children: sections,
  });
}

export const CorePrimitives = {
  name: 'Core primitives',
  render: (_args, ctx) => corePage(ctx.globals.platform, ctx.globals.theme),
};

export const Semantic = {
  name: 'Semantic',
  render: (_args, ctx) => semanticPage(ctx.globals.platform, ctx.globals.theme),
};
