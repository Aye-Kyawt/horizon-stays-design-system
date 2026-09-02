import { tokensFor } from './lib/tokens.js';
import { el, page, shortDesc, tokenName } from './lib/ui.js';

export default {
  title: 'All tokens',
};

const CATEGORY_LABELS = {
  'core-color': 'core colour',
  'semantic-color': 'semantic colour',
  typography: 'typography',
  'type-primitive': 'type primitive',
  spacing: 'spacing',
  radius: 'radius',
  'border-width': 'stroke width',
  size: 'size',
  elevation: 'elevation',
  component: 'component',
  other: 'other',
};

/** The whole set in one filterable table — the page to reach for when you
 *  know part of a token name and want the rest of it. */
export const Index = {
  name: 'Searchable index',
  render: (_args, ctx) => {
    const { platform, theme } = ctx.globals;
    const tokens = tokensFor(platform).tokens;

    const tbody = el('tbody', {}, []);
    const status = el('p', { class: 'hds-count', text: `${tokens.length} tokens` });

    const aliasFor = (t) =>
      theme === 'dark' && t.overriddenInDark ? t.aliasDark : t.alias;

    const rowFor = (t) =>
      el('tr', {}, [
        el('td', {}, [tokenName(t.name)]),
        el('td', { text: CATEGORY_LABELS[t.category] || t.category }),
        el('td', { class: 'hds-mono', text: aliasFor(t) ? `--${aliasFor(t)}` : '—' }),
        el('td', { class: 'hds-mono', text: t.resolved[theme] }),
        el('td', { text: shortDesc(t.description, 120) }),
      ]);

    const render = (query) => {
      const q = query.trim().toLowerCase();
      const matches = q
        ? tokens.filter(
            (t) =>
              t.name.toLowerCase().includes(q) ||
              t.resolved[theme].toLowerCase().includes(q) ||
              (t.description || '').toLowerCase().includes(q),
          )
        : tokens;

      tbody.replaceChildren(...matches.map(rowFor));
      status.textContent = q
        ? `${matches.length} of ${tokens.length} tokens match “${query.trim()}”`
        : `${tokens.length} tokens`;
    };

    const search = el('input', {
      class: 'hds-search',
      type: 'search',
      placeholder: 'Filter by name, value or description…',
      oninput: (e) => render(e.target.value),
    });

    render('');

    return page({
      title: 'All tokens',
      intro:
        'Every custom property in this platform build, resolved for the active theme. Click a name to copy its var() reference.',
      children: [
        search,
        status,
        el('table', { class: 'hds-table' }, [
          el('thead', {}, [
            el('tr', {}, [
              el('th', { text: 'Token' }),
              el('th', { text: 'Category' }),
              el('th', { text: 'Aliases' }),
              el('th', { text: 'Resolves to' }),
              el('th', { text: 'Notes' }),
            ]),
          ]),
          tbody,
        ]),
      ],
    });
  },
};
