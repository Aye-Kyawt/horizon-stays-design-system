import { PLATFORMS, tokensFor } from './lib/tokens.js';
import { el, group, page, tokenName } from './lib/ui.js';

export default {
  title: 'Overview',
};

const CATEGORY_ORDER = [
  ['core-color', 'Core colour primitives', 'Colour → Core primitives'],
  ['semantic-color', 'Semantic colours', 'Colour → Semantic'],
  ['typography', 'Typography sub-properties', 'Typography'],
  ['type-primitive', 'Type primitives', 'Typography → Type primitives'],
  ['spacing', 'Spacing', 'Spacing'],
  ['radius', 'Corner radius', 'Borders → Radius'],
  ['border-width', 'Stroke width', 'Borders → Stroke width'],
  ['size', 'Icon and control sizes', 'Sizing'],
  ['elevation', 'Elevation', 'Elevation'],
  ['component', 'Component tokens', 'Components'],
  ['other', 'Everything else', 'All tokens'],
];

export const ReadMe = {
  name: 'Read me',
  render: (_args, ctx) => {
    const { platform } = ctx.globals;
    const set = tokensFor(platform);
    const counts = new Map();
    for (const t of set.tokens) counts.set(t.category, (counts.get(t.category) || 0) + 1);

    const rows = CATEGORY_ORDER.filter(([key]) => counts.get(key)).map(([key, label, where]) =>
      el('tr', {}, [
        el('td', { text: label }),
        el('td', { class: 'hds-mono', text: String(counts.get(key)) }),
        el('td', { text: where }),
      ]),
    );

    return page({
      title: 'Horizon Stays design tokens',
      intro:
        'Everything here is generated. The token files in tokens/ are exported from Figma and owned by the plugin; build-tokens.js turns them into one CSS file per platform; these stories read that CSS back and render it. Nothing in this Storybook is a hand-maintained copy of a token value, so what you see is what ships.',
      children: [
        group(
          'How to use it',
          el('div', { class: 'hds-intro' }, [
            el('p', {
              text: 'Two toolbar controls drive every page. Platform swaps which of the three generated CSS builds is mounted — web, mobile and back-office share token names but differ on type and border values. Theme switches the [data-theme="dark"] block on and off.',
            }),
            el('p', {
              text: 'Click any token name to copy its var() reference to the clipboard.',
            }),
            el('p', {
              text: 'Reach for semantic tokens in product code. Core primitives are pigments, not decisions — they are documented so you can trace where a colour came from, not so you can use them directly.',
            }),
          ]),
        ),
        group(
          `What is in the ${platform} build`,
          el('table', { class: 'hds-table' }, [
            el('thead', {}, [
              el('tr', {}, [
                el('th', { text: 'Group' }),
                el('th', { text: 'Tokens' }),
                el('th', { text: 'Where' }),
              ]),
            ]),
            el('tbody', {}, rows),
          ]),
          `${set.tokens.length} custom properties in :root, and ${set.darkOverrideCount} semantic colours overridden in the dark block.`,
        ),
      ],
    });
  },
};

/** Tokens whose value is not the same in all three platform builds. This is
 *  the whole point of the per-platform type and border modes, so it is worth
 *  having a page that shows exactly which names move. */
export const PlatformDifferences = {
  name: 'Platform differences',
  render: (_args, ctx) => {
    const theme = ctx.globals.theme;
    const sets = Object.fromEntries(PLATFORMS.map((p) => [p, tokensFor(p)]));
    const base = sets[PLATFORMS[0]];

    const differing = base.tokens.filter((t) => {
      const values = PLATFORMS.map((p) => sets[p].byName[t.name]?.resolved[theme]);
      return new Set(values).size > 1;
    });

    const rows = differing.map((t) =>
      el('tr', {}, [
        el('td', {}, [tokenName(t.name)]),
        ...PLATFORMS.map((p) =>
          el('td', { class: 'hds-mono', text: sets[p].byName[t.name]?.resolved[theme] ?? '—' }),
        ),
      ]),
    );

    return page({
      title: 'Platform differences',
      intro:
        'Type and border are the only collections with per-platform modes. Every other token — colour, spacing, component, elevation — is identical across web, mobile and back office. These are the names that actually move.',
      count: differing.length,
      children: differing.length
        ? group(
            'Values by platform',
            el('table', { class: 'hds-table' }, [
              el('thead', {}, [
                el('tr', {}, [
                  el('th', { text: 'Token' }),
                  ...PLATFORMS.map((p) => el('th', { text: p })),
                ]),
              ]),
              el('tbody', {}, rows),
            ]),
          )
        : el('p', {
            class: 'hds-empty',
            text: 'No token resolves differently across the three platform builds.',
          }),
    });
  },
};
