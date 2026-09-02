/**
 * Horizon Stays design tokens — Storybook config.
 *
 * There is no UI framework in this repo, so Storybook runs on the plain
 * HTML renderer over Vite. Stories are token specimens: they read the
 * generated CSS in build/css and render swatches, scales and tables from it.
 */

/** @type {import('@storybook/html-vite').StorybookConfig} */
export default {
  stories: ['../stories/**/*.stories.js'],
  addons: [],
  framework: {
    name: '@storybook/html-vite',
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
};
