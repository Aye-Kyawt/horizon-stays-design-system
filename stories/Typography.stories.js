import { typeStyleCss, typographyFamily, typographyStyles, tokensFor } from './lib/tokens.js';
import { el, group, page, shortDesc, tokenName } from './lib/ui.js';

export default {
  title: 'Typography',
};

const LATIN_SAMPLE = 'Horizon Stays — book a room by the sea';
const MYANMAR_SAMPLE = 'မင်္ဂလာပါ ဟိုတယ်ခန်း စာရင်းသွင်းရန်';

const METRIC_PROPS = [
  ['font-size', 'size'],
  ['line-height', 'leading'],
  ['font-weight', 'weight'],
  ['letter-spacing', 'tracking'],
  ['font-family', 'family'],
];

/** One row: the metrics on the left, the live specimen on the right. */
function specimen(style, platform, theme, sample) {
  const set = tokensFor(platform);
  const metrics = METRIC_PROPS.filter(([prop]) => style.props[prop])
    .map(([prop, label]) => {
      const token = set.byName[style.props[prop].name];
      return `${label} ${token ? token.resolved[theme] : '—'}`;
    })
    .join('  ·  ');

  return el('div', { class: 'hds-row' }, [
    el('div', {}, [
      tokenName(style.stem),
      el('div', { class: 'hds-value', text: metrics }),
    ]),
    el('div', { class: 'hds-value', text: `${style.tokens.length} tokens` }),
    el('div', {}, [
      el('div', { style: typeStyleCss(style), text: sample }),
      style.description
        ? el('div', { class: 'hds-desc', text: shortDesc(style.description, 150) })
        : null,
    ]),
  ]);
}

function familyPage({ platform, theme, families, title, intro, sample }) {
  const styles = typographyStyles(platform).filter((s) =>
    families.includes(typographyFamily(s.stem)),
  );

  const sections = families.map((family) => {
    const list = styles.filter((s) => typographyFamily(s.stem) === family);
    if (!list.length) return null;
    return group(
      family.replace(/-/g, ' '),
      el(
        'div',
        { class: 'hds-rows' },
        list.map((s) => specimen(s, platform, theme, sample(s))),
      ),
    );
  });

  return page({
    title,
    intro,
    count: styles.reduce((n, s) => n + s.tokens.length, 0),
    children: sections.filter(Boolean),
  });
}

const sampleFor = (stem) =>
  stem.includes('myanmar') ? MYANMAR_SAMPLE : LATIN_SAMPLE;

export const Typescale = {
  name: 'Type scale',
  render: (_args, ctx) =>
    familyPage({
      platform: ctx.globals.platform,
      theme: ctx.globals.theme,
      families: ['scale-latin', 'scale-myanmar'],
      title: 'Type scale',
      intro:
        'The Material 3 typescale as this system implements it, in regular, semibold and bold. Myanmar styles carry their own line heights — Burmese shaping needs the extra leading and must never be letter-spaced.',
      sample: (s) => sampleFor(s.stem),
    }),
};

export const SemanticType = {
  name: 'Semantic styles',
  render: (_args, ctx) =>
    familyPage({
      platform: ctx.globals.platform,
      theme: ctx.globals.theme,
      families: ['semantic-latin', 'semantic-myanmar'],
      title: 'Semantic type styles',
      intro:
        'Named by the job rather than the size — page title, field label, price, badge. These alias the typescale, so a change to the scale flows through. Use these in product code.',
      sample: (s) => sampleFor(s.stem),
    }),
};

export const DocumentStyles = {
  name: 'Document styles',
  render: (_args, ctx) =>
    familyPage({
      platform: ctx.globals.platform,
      theme: ctx.globals.theme,
      families: ['document-latin', 'document-myanmar'],
      title: 'Document styles',
      intro:
        'The H1–H6 and body run used for long-form copy: help articles, policy pages, listing descriptions.',
      sample: (s) => sampleFor(s.stem),
    }),
};

/** The raw sizes, leadings, trackings and weights the styles are built from. */
export const Primitives = {
  name: 'Type primitives',
  render: (_args, ctx) => {
    const platform = ctx.globals.platform;
    const theme = ctx.globals.theme;
    const tokens = tokensFor(platform).tokens.filter((t) => t.category === 'type-primitive');

    const buckets = new Map();
    for (const t of tokens) {
      // core-type-<facet>-<rest>
      const facet = t.name.split('-')[2] || 'other';
      if (!buckets.has(facet)) buckets.set(facet, []);
      buckets.get(facet).push(t);
    }

    const sections = [...buckets.entries()].map(([facet, list]) =>
      group(
        facet,
        el('table', { class: 'hds-table' }, [
          el('thead', {}, [
            el('tr', {}, [
              el('th', { text: 'Token' }),
              el('th', { text: 'Value' }),
              el('th', { text: 'Notes' }),
            ]),
          ]),
          el(
            'tbody',
            {},
            list.map((t) =>
              el('tr', {}, [
                el('td', {}, [tokenName(t.name)]),
                el('td', { class: 'hds-mono', text: t.resolved[theme] }),
                el('td', { text: shortDesc(t.description, 160) }),
              ]),
            ),
          ),
        ]),
      ),
    );

    return page({
      title: 'Type primitives',
      intro:
        'Font families, sizes, line heights, trackings and weights. This is the layer the platform builds differ on — switch the Platform toolbar and the values change while the names stay put.',
      count: tokens.length,
      children: sections,
    });
  },
};
