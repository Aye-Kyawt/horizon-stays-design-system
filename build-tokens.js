/**
 * Horizon Stays Design System — token build
 *
 * Reads the DTCG token files in ./tokens and emits one CSS custom-property
 * file per platform into ./build/css:
 *
 *   build/css/web.css
 *   build/css/mobile.css
 *   build/css/back-office.css
 *
 * Each file contains:
 *   :root { ... }                 core, spacing, component and effect tokens,
 *                                 the platform's type and border modes, and
 *                                 the light semantic colours
 *   [data-theme="dark"] { ... }   only the semantic colours that actually
 *                                 change in the dark mode
 *
 * Component and effect tokens are not repeated in the dark block: they
 * reference semantic colours via var(), so they follow the override for free.
 *
 * Style Dictionary v5 is ESM-only, so it is pulled in with a dynamic import
 * to stay compatible with this package's "type": "commonjs".
 */

const fs = require('node:fs');
const path = require('node:path');

const TOKENS = 'tokens';
const OUT_DIR = path.join('build', 'css');

const t = (name) => `${TOKENS}/${name}.tokens.json`;

/**
 * `type` and `border` are the only collections with per-platform modes.
 * Everything else — core, spacing, component, and the semantic colours —
 * is shared across all three.
 */
const PLATFORMS = ['web', 'mobile', 'back-office'];
const PER_PLATFORM = ['type', 'border'];

const SHARED = [
  t('core.value'),
  t('spacing.value'),
  t('component.value'),
];

/** Styles are light-only; the dark block carries semantic colours alone. */
const STYLES = [t('typography.styles'), t('effects.styles')];

const LIGHT = 'semantic.light';
const DARK = 'semantic.dark';

/**
 * color.styles.tokens.json is deliberately excluded. It is the legacy
 * foundation ramp — its own descriptions say it is superseded by the
 * primitives collection — and 36 of its names carry a `:hover` / `:active`
 * suffix, which is not valid in a CSS custom-property name.
 */

/** A bare number in a DTCG typography composite means pixels. */
const toDimension = (v) => (typeof v === 'number' ? { value: v, unit: 'px' } : v);

const readTokens = (name) => JSON.parse(fs.readFileSync(t(name), 'utf8'));

async function main() {
  const { default: StyleDictionary } = await import('style-dictionary');

  // Split $type: typography composites into one custom property per
  // sub-property. Style Dictionary's built-in `expand` flattens the DTCG
  // dimension objects into `-value`/`-unit` pairs, so this does it by hand
  // and keeps `{alias}` strings intact for the resolver.
  StyleDictionary.registerPreprocessor({
    name: 'hds/expand-typography',
    preprocessor: (dictionary) => {
      const SUFFIXES = {
        fontFamily: ['font-family', 'fontFamily', (v) => v],
        fontWeight: ['font-weight', 'fontWeight', (v) => v],
        fontSize: ['font-size', 'dimension', toDimension],
        lineHeight: ['line-height', 'dimension', toDimension],
        letterSpacing: ['letter-spacing', 'dimension', toDimension],
      };

      const walk = (node) => {
        const out = {};
        for (const [key, token] of Object.entries(node)) {
          const isComposite =
            token &&
            typeof token === 'object' &&
            token.$type === 'typography' &&
            token.$value &&
            typeof token.$value === 'object';

          if (isComposite) {
            for (const [prop, [suffix, $type, coerce]] of Object.entries(SUFFIXES)) {
              const raw = token.$value[prop];
              if (raw === undefined || raw === null) continue;
              out[`${key}-${suffix}`] = {
                filePath: token.filePath,
                isSource: token.isSource,
                $type,
                $value: coerce(raw),
                ...(token.$description ? { $description: token.$description } : {}),
              };
            }
          } else if (
            token &&
            typeof token === 'object' &&
            !Array.isArray(token) &&
            token.$value === undefined
          ) {
            out[key] = walk(token);
          } else {
            out[key] = token;
          }
        }
        return out;
      };

      return walk(dictionary);
    },
  });

  const platformConfig = (transforms, destination, selector, filter) => ({
    css: {
      transforms,
      buildPath: `${OUT_DIR}/`,
      files: [
        {
          destination,
          format: 'css/variables',
          filter,
          options: { outputReferences: true, usesDtcg: true },
        },
      ],
      options: { selector },
    },
  });

  const transforms = StyleDictionary.hooks.transformGroups.css;

  const light = readTokens(LIGHT);
  const dark = readTokens(DARK);

  // Semantic colours that actually change in the dark mode. Everything else
  // in semantic.dark is identical to light and would be dead weight.
  const darkOverrides = new Set(
    Object.keys(dark).filter(
      (k) =>
        dark[k].$type === 'color' &&
        JSON.stringify(dark[k].$value) !== JSON.stringify(light[k]?.$value),
    ),
  );

  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const p of PLATFORMS) {
    const lightFile = `.${p}.light.css`;
    const darkFile = `.${p}.dark.css`;

    const platformSources = [...SHARED, ...PER_PLATFORM.map((c) => t(`${c}.${p}`))];

    // :root — everything, with the light semantic colours.
    const lightDict = new StyleDictionary({
      source: [...platformSources, t(LIGHT), ...STYLES],
      preprocessors: ['hds/expand-typography'],
      platforms: platformConfig(transforms, lightFile, ':root'),
    });
    await lightDict.buildAllPlatforms();

    // Dark block — only the semantic colours that differ. The rest of the
    // token set is present purely so the aliases resolve, and outputReferences
    // keeps them as var() pointing at the :root declarations above.
    const darkDict = new StyleDictionary({
      source: [...platformSources, t(DARK)],
      platforms: platformConfig(
        transforms,
        darkFile,
        '[data-theme="dark"]',
        (token) => darkOverrides.has(token.name),
      ),
      log: { warnings: 'disabled' },
    });
    await darkDict.buildAllPlatforms();

    const lightPath = path.join(OUT_DIR, lightFile);
    const darkPath = path.join(OUT_DIR, darkFile);

    const header = [
      '/**',
      ' * Do not edit directly — generated by build-tokens.js',
      ` * Platform: ${p}`,
      ' *',
      ` * Type: type.${p}   Border: border.${p}`,
      ` * Colours: ${LIGHT}, with ${darkOverrides.size} overrides from ${DARK}`,
      ' */',
      '',
    ].join('\n');

    const strip = (file) =>
      fs.readFileSync(file, 'utf8').replace(/^\/\*\*[\s\S]*?\*\/\s*/, '').trim();

    fs.writeFileSync(
      path.join(OUT_DIR, `${p}.css`),
      `${header}\n${strip(lightPath)}\n\n${strip(darkPath)}\n`,
    );

    fs.rmSync(lightPath);
    fs.rmSync(darkPath);

    console.log(`✔ ${OUT_DIR}/${p}.css`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
