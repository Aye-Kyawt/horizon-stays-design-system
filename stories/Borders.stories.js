import { byCategory } from './lib/tokens.js';
import { el, group, page, shortDesc, tokenName } from './lib/ui.js';

export default {
  title: 'Borders',
};

function radiusCard(token, theme) {
  return el('div', { class: 'hds-card' }, [
    el('div', {
      style:
        'padding: 16px; display: flex; align-items: center; justify-content: center; background: var(--semantic-color-bg-surfacesecondary);',
    }, [
      el('div', {
        style: `width: 100%; height: 56px; background: var(--semantic-color-bg-primary); border-radius: var(--${token.name});`,
      }),
    ]),
    el('div', { class: 'hds-card-body' }, [
      tokenName(token.name),
      el('div', { class: 'hds-value', text: token.resolved[theme] }),
      token.alias ? el('div', { class: 'hds-value', text: `→ --${token.alias}` }) : null,
      el('div', { class: 'hds-desc', text: shortDesc(token.description, 110) }),
    ]),
  ]);
}

function widthRow(token, theme) {
  return el('div', { class: 'hds-row' }, [
    el('div', {}, [tokenName(token.name)]),
    el('div', { class: 'hds-mono', text: token.resolved[theme] }),
    el('div', {}, [
      el('div', {
        style: `height: 0; border-top: var(--${token.name}) solid var(--semantic-color-border-strong); width: 100%;`,
      }),
      el('div', { class: 'hds-desc', text: shortDesc(token.description, 150) }),
    ]),
  ]);
}

function colourRow(token, theme) {
  return el('div', { class: 'hds-row' }, [
    el('div', {}, [tokenName(token.name)]),
    el('div', { class: 'hds-mono', text: token.resolved[theme] }),
    el('div', {}, [
      el('div', {
        style: `height: 40px; border: 2px solid var(--${token.name}); border-radius: var(--core-border-radius-sm); background: var(--semantic-color-bg-surfaceprimary);`,
      }),
      el('div', { class: 'hds-desc', text: shortDesc(token.description, 150) }),
    ]),
  ]);
}

/** Split a category into its core ladder and the semantic names over it. */
function tiered(platform, category) {
  const tokens = byCategory(platform, category);
  return {
    tokens,
    core: tokens.filter((t) => t.tier === 'core'),
    semantic: tokens.filter((t) => t.tier === 'semantic'),
  };
}

export const Radius = {
  name: 'Radius',
  render: (_args, ctx) => {
    const { platform, theme } = ctx.globals;
    const { tokens, core, semantic } = tiered(platform, 'radius');

    return page({
      title: 'Corner radius',
      intro:
        'Radius is one of the two collections that differ per platform — the back office squares off where web and mobile round. Switch the Platform toolbar to compare; the semantic names stay put while the values move.',
      count: tokens.length,
      children: [
        core.length &&
          group(
            'Core steps',
            el('div', { class: 'hds-grid hds-cards' }, core.map((t) => radiusCard(t, theme))),
            'The raw ladder, shared across platforms.',
          ),
        semantic.length &&
          group(
            'Semantic radius',
            el('div', { class: 'hds-grid hds-cards' }, semantic.map((t) => radiusCard(t, theme))),
            'What product code should use. These remap per platform — semantic lg points at a different core step in the back office than on web.',
          ),
      ].filter(Boolean),
    });
  },
};

export const Width = {
  name: 'Stroke width',
  render: (_args, ctx) => {
    const { platform, theme } = ctx.globals;
    const { tokens, core, semantic } = tiered(platform, 'border-width');

    return page({
      title: 'Stroke width',
      intro:
        'Border weights. 1 px carries almost every stroke in the product; 2 px is reserved for focus rings and selected states.',
      count: tokens.length,
      children: [
        core.length &&
          group('Core widths', el('div', { class: 'hds-rows' }, core.map((t) => widthRow(t, theme)))),
        semantic.length &&
          group(
            'Semantic widths',
            el('div', { class: 'hds-rows' }, semantic.map((t) => widthRow(t, theme))),
          ),
      ].filter(Boolean),
    });
  },
};

export const BorderColours = {
  name: 'Border colours',
  render: (_args, ctx) => {
    const { platform, theme } = ctx.globals;
    const tokens = byCategory(platform, 'semantic-color').filter((t) => t.group === 'border');

    return page({
      title: 'Border colours',
      intro:
        'The stroke colours, by role. These are semantic colours, so they follow the light/dark override — flip the Theme toolbar.',
      count: tokens.length,
      children: tokens.length
        ? group('Roles', el('div', { class: 'hds-rows' }, tokens.map((t) => colourRow(t, theme))))
        : el('p', { class: 'hds-empty', text: 'No border colour tokens in this build.' }),
    });
  },
};
