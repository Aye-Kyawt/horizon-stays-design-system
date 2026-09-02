import { byCategory } from './lib/tokens.js';
import { el, group, page, shortDesc, tokenName } from './lib/ui.js';

export default {
  title: 'Elevation',
};

/** The composed shadows, e.g. --horizon-semantic-elevation-shadow-level3. */
const isComposed = (t) => t.name.includes('elevation-shadow-');

function shadowCard(token, theme) {
  return el('div', {
    style:
      'background: var(--semantic-color-bg-surfaceprimary); border-radius: var(--core-border-radius-md); padding: 20px; box-shadow: var(--' +
      token.name +
      ');',
  }, [
    tokenName(token.name),
    el('div', { class: 'hds-value', text: token.resolved[theme] }),
    el('div', { class: 'hds-desc', text: shortDesc(token.description, 180) }),
  ]);
}

export const Shadows = {
  name: 'Shadows',
  render: (_args, ctx) => {
    const { platform, theme } = ctx.globals;
    const tokens = byCategory(platform, 'elevation');
    const composed = tokens.filter(isComposed);
    const parts = tokens.filter((t) => !isComposed(t));

    return page({
      title: 'Elevation',
      intro:
        'Five levels, each composed from an offset, a blur and the shadow ink. The ink is a semantic colour — 14% on light, 72% on dark — so the whole ladder re-tunes when you flip the Theme toolbar rather than washing out.',
      count: tokens.length,
      children: [
        group(
          'Levels',
          el('div', {
            style:
              'display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 32px; margin-top: 24px; padding: 8px;',
          }, composed.map((t) => shadowCard(t, theme))),
        ),
        group(
          'Parts',
          el('table', { class: 'hds-table' }, [
            el('thead', {}, [
              el('tr', {}, [
                el('th', { text: 'Token' }),
                el('th', { text: 'Value' }),
                el('th', { text: 'Notes' }),
              ]),
            ]),
            el('tbody', {}, parts.map((t) =>
              el('tr', {}, [
                el('td', {}, [tokenName(t.name)]),
                el('td', { class: 'hds-mono', text: t.resolved[theme] }),
                el('td', { text: shortDesc(t.description, 160) }),
              ]),
            )),
          ]),
          'The offsets and blurs the composed shadows are built from.',
        ),
      ],
    });
  },
};
