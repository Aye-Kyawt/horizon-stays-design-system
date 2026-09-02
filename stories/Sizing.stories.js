import { byCategory } from './lib/tokens.js';
import { el, group, page, shortDesc, tokenName } from './lib/ui.js';

export default {
  title: 'Sizing',
};

/** A box drawn at the token's own size, so icon boxes and control heights
 *  can be compared against each other by eye. */
function sizeCard(token, theme, axis) {
  const box =
    axis === 'square'
      ? `width: var(--${token.name}); height: var(--${token.name});`
      : `width: 96px; height: var(--${token.name});`;

  return el('div', { class: 'hds-card' }, [
    el('div', {
      style:
        'padding: 16px; min-height: 88px; display: flex; align-items: center; justify-content: center; background: var(--semantic-color-bg-surfacesecondary);',
    }, [
      el('div', {
        style: `${box} background: var(--semantic-color-bg-primary); border-radius: var(--core-border-radius-xs);`,
      }),
    ]),
    el('div', { class: 'hds-card-body' }, [
      tokenName(token.name),
      el('div', { class: 'hds-value', text: token.resolved[theme] }),
      el('div', { class: 'hds-desc', text: shortDesc(token.description, 140) }),
    ]),
  ]);
}

export const Sizes = {
  name: 'Icon and control sizes',
  render: (_args, ctx) => {
    const { platform, theme } = ctx.globals;
    const tokens = byCategory(platform, 'size');
    const icons = tokens.filter((t) => t.name.includes('-icon-'));
    const controls = tokens.filter((t) => t.name.includes('-control-'));
    const rest = tokens.filter((t) => !icons.includes(t) && !controls.includes(t));

    return page({
      title: 'Sizing',
      intro:
        'Icon boxes and control heights. The control heights are measured from the master Figma file rather than invented — 36 for inputs, 44 for the common button, 52 for the large one.',
      count: tokens.length,
      children: [
        icons.length &&
          group(
            'Icon boxes',
            el('div', { class: 'hds-grid hds-cards' }, icons.map((t) => sizeCard(t, theme, 'square'))),
          ),
        controls.length &&
          group(
            'Control heights',
            el('div', { class: 'hds-grid hds-cards' }, controls.map((t) => sizeCard(t, theme, 'height'))),
          ),
        rest.length &&
          group(
            'Other',
            el('div', { class: 'hds-grid hds-cards' }, rest.map((t) => sizeCard(t, theme, 'height'))),
          ),
      ].filter(Boolean),
    });
  },
};
