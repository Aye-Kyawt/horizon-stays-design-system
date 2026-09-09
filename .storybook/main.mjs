/**
 * Horizon Stays design system — Storybook config.
 *
 * Two kinds of story live side by side:
 *
 *   stories/**\/*.stories.js        token specimens — swatches, scales and
 *                                   tables read back out of the generated CSS
 *   src/components/**\/*.stories.tsx  the React components themselves
 *
 * The renderer is React (tools.md: React 19 with Vite). The token specimens
 * predate the components and build plain DOM nodes rather than React
 * elements; `page()` in stories/lib/ui.js hosts those nodes inside a React
 * wrapper, so they keep working unchanged under this framework.
 */

/** @type {import('@storybook/react-vite').StorybookConfig} */
export default {
  stories: ['../stories/**/*.stories.js', '../src/components/**/*.stories.tsx'],
  addons: [],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
};
