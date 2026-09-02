import { byCategory } from './lib/tokens.js';
import { el, group, page, shortDesc, tokenName } from './lib/ui.js';

export default {
  title: 'Spacing',
};

/** A bar drawn at the token's own width, so the steps compare by eye. */
function bar(token, theme) {
  return el('div', { class: 'hds-row' }, [
    el('div', {}, [tokenName(token.name)]),
    el('div', { class: 'hds-mono', text: token.resolved[theme] }),
    el('div', {}, [
      el('div', {
        style: `width: var(--${token.name}); min-width: 1px; height: 16px; border-radius: 2px; background: var(--semantic-color-bg-primary);`,
      }),
      token.description
        ? el('div', { class: 'hds-desc', text: shortDesc(token.description, 150) })
        : null,
    ]),
  ]);
}

export const Scale = {
  name: 'Scale',
  render: (_args, ctx) => {
    const { platform, theme } = ctx.globals;
    const tokens = byCategory(platform, 'spacing');
    const core = tokens.filter((t) => t.tier === 'core');
    const semantic = tokens.filter((t) => t.tier === 'semantic');

    return page({
      title: 'Spacing',
      intro:
        'A 4 px base grid with a few deliberate half-steps. The core steps are the raw ladder; the semantic tokens name the jobs — inset, gap, stack — and are what product code should reference.',
      count: tokens.length,
      children: [
        core.length &&
          group(
            'Core steps',
            el('div', { class: 'hds-rows' }, core.map((t) => bar(t, theme))),
            'The ladder itself. Do not reference these directly.',
          ),
        semantic.length &&
          group(
            'Semantic spacing',
            el('div', { class: 'hds-rows' }, semantic.map((t) => bar(t, theme))),
            'Named by use. These alias the core steps.',
          ),
      ].filter(Boolean),
    });
  },
};
