import { byCategory } from './lib/tokens.js';
import { el, group, page, shortDesc, tokenName } from './lib/ui.js';

export default {
  title: 'Components',
};

/** Every component token, with what it aliases and where it lands. */
function tokenTable(tokens, theme) {
  return el('table', { class: 'hds-table' }, [
    el('thead', {}, [
      el('tr', {}, [
        el('th', { text: 'Token' }),
        el('th', { text: 'Aliases' }),
        el('th', { text: 'Resolves to' }),
      ]),
    ]),
    el('tbody', {}, tokens.map((t) =>
      el('tr', {}, [
        el('td', {}, [
          tokenName(t.name),
          t.description ? el('div', { class: 'hds-desc', text: shortDesc(t.description, 90) }) : null,
        ]),
        el('td', { class: 'hds-mono', text: t.alias ? `--${t.alias}` : '—' }),
        el('td', { class: 'hds-mono', text: t.resolved[theme] }),
      ]),
    )),
  ]);
}

const BUTTON_BASE = `
  display: inline-flex; align-items: center; justify-content: center;
  height: var(--component-button-height-md);
  padding: 0 var(--component-button-padding-x-md);
  gap: var(--component-button-gap-md);
  border-radius: var(--component-button-radius-md);
  border: var(--semantic-border-width-base) solid transparent;
  font-family: var(--core-type-fontfamily-brand), sans-serif;
  font-size: var(--semantic-type-latin-button-font-size);
  line-height: var(--semantic-type-latin-button-line-height);
  font-weight: var(--semantic-type-latin-button-font-weight);
  cursor: pointer;
`;

/** Previews assembled only from component tokens — no hardcoded values. */
function buttonPreview() {
  const variants = [
    ['Primary', 'background: var(--component-button-bg-primary-idle); color: var(--component-button-text-primary);'],
    ['Primary hovered', 'background: var(--component-button-bg-primary-hovered); color: var(--component-button-text-primary);'],
    ['Primary pressed', 'background: var(--component-button-bg-primary-pressed); color: var(--component-button-text-primary);'],
    ['Secondary', 'background: var(--component-button-bg-secondary-idle); color: var(--component-button-text-secondary); border-color: var(--component-button-border-secondary);'],
    ['Negative', 'background: var(--component-button-bg-negative-idle); color: var(--component-button-text-primary);'],
    ['Focused', 'background: var(--component-button-bg-primary-idle); color: var(--component-button-text-primary); box-shadow: 0 0 0 var(--semantic-border-width-strong) var(--component-button-border-focused);'],
    ['Disabled', 'background: var(--component-button-bg-primary-disabled); color: var(--component-button-text-disabled);'],
  ];

  return el('div', {
    style: 'display: flex; flex-wrap: wrap; gap: 20px; align-items: flex-end; margin-top: 20px;',
  }, variants.map(([label, style]) =>
    el('div', {}, [
      el('div', { style: BUTTON_BASE + style, text: 'Book now' }),
      el('div', { class: 'hds-desc', style: 'text-align: center;', text: label }),
    ]),
  ));
}

function inputPreview() {
  const base = `
    height: var(--component-input-height-sm);
    padding: 0 var(--component-input-padding-x-sm);
    border-radius: var(--component-input-radius-sm);
    border: var(--semantic-border-width-base) solid var(--component-input-border-idle);
    background: var(--component-input-bg-idle);
    color: var(--component-input-text-base);
    font-family: var(--core-type-fontfamily-brand), sans-serif;
    font-size: var(--semantic-type-latin-field-value-font-size);
    display: flex; align-items: center; min-width: 220px;
  `;

  const variants = [
    ['Idle', base, 'Sea view, 2 guests'],
    ['Focused', base + 'border-color: var(--component-input-border-focused); box-shadow: 0 0 0 var(--semantic-border-width-strong) var(--semantic-color-bg-primary-subtle);', 'Sea view, 2 guests'],
    ['Error', base + 'border-color: var(--component-input-border-negative);', 'Sea view, 2 guests'],
    ['Placeholder', base + 'color: var(--component-input-text-placeholder);', 'Where to?'],
    ['Disabled', base + 'background: var(--component-input-bg-disabled); border-color: var(--component-input-border-disabled); color: var(--semantic-color-text-disabled);', 'Unavailable'],
  ];

  return el('div', {
    style: 'display: flex; flex-wrap: wrap; gap: 20px; margin-top: 20px;',
  }, variants.map(([label, style, value]) =>
    el('div', {}, [
      el('div', { style, text: value }),
      el('div', { class: 'hds-desc', text: label }),
    ]),
  ));
}

function cardPreview() {
  const base = `
    padding: var(--component-card-padding-lg);
    border-radius: var(--component-card-radius-lg);
    border: var(--component-card-borderwidth-base) solid var(--component-card-border-base);
    display: flex; flex-direction: column; gap: var(--component-card-gap-sm);
    max-width: 300px;
  `;

  const variants = [
    ['Idle', `${base} background: var(--component-card-bg-idle);`],
    ['Hovered', `${base} background: var(--component-card-bg-hovered); box-shadow: var(--horizon-semantic-elevation-shadow-level2);`],
    ['Selected', `${base} background: var(--component-card-bg-selected);`],
  ];

  return el('div', {
    style: 'display: flex; flex-wrap: wrap; gap: 24px; margin-top: 20px;',
  }, variants.map(([label, style]) =>
    el('div', {}, [
      el('div', { style }, [
        el('div', {
          style:
            'color: var(--component-card-title-base); font-size: var(--semantic-type-latin-card-title-font-size); line-height: var(--semantic-type-latin-card-title-line-height); font-weight: var(--semantic-type-latin-card-title-font-weight);',
          text: 'Harbour Suite',
        }),
        el('div', {
          style:
            'color: var(--component-card-body-base); font-size: var(--semantic-type-latin-body-font-size); line-height: var(--semantic-type-latin-body-line-height);',
          text: 'Balcony over the marina, breakfast included. Free cancellation until 48 hours before arrival.',
        }),
      ]),
      el('div', { class: 'hds-desc', text: label }),
    ]),
  ));
}

const COMPONENTS = {
  button: {
    title: 'Button tokens',
    intro:
      'Every button token is an alias — the button layer names the decisions, the semantic layer holds the values. Nothing below sets a literal.',
    preview: buttonPreview,
  },
  input: {
    title: 'Input tokens',
    intro: 'Field surfaces, borders and text, including the disabled and error states.',
    preview: inputPreview,
  },
  card: {
    title: 'Card tokens',
    intro: 'The listing-card surface, its stroke, inset and the two text roles inside it.',
    preview: cardPreview,
  },
};

function componentStory(component) {
  return {
    name: component[0].toUpperCase() + component.slice(1),
    render: (_args, ctx) => {
      const { platform, theme } = ctx.globals;
      const tokens = byCategory(platform, 'component').filter((t) => t.component === component);
      const meta = COMPONENTS[component];

      return page({
        title: meta.title,
        intro: meta.intro,
        count: tokens.length,
        children: [
          group('Preview', meta.preview(), 'Rendered from the tokens in the table below.'),
          group('Tokens', tokenTable(tokens, theme)),
        ],
      });
    },
  };
}

export const Button = componentStory('button');
export const Input = componentStory('input');
export const Card = componentStory('card');
