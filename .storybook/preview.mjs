/**
 * Loads one platform's generated token CSS into the preview and flips the
 * light/dark block, both driven from the toolbar.
 *
 * The three platform builds declare the same custom-property names with
 * different type and border values, so exactly one is mounted at a time —
 * swapping the <style> contents is what makes the Platform toolbar real.
 */

import { PLATFORM_CSS, PLATFORMS, THEMES } from '../stories/lib/tokens.js';

const TOKENS_STYLE_ID = 'hds-platform-tokens';

const PLATFORM_LABELS = {
  web: 'Web',
  mobile: 'Mobile',
  'back-office': 'Back office',
};

function applyPlatform(platform) {
  const name = PLATFORM_CSS[platform] ? platform : 'web';
  let style = document.getElementById(TOKENS_STYLE_ID);
  if (!style) {
    style = document.createElement('style');
    style.id = TOKENS_STYLE_ID;
    document.head.appendChild(style);
  }
  if (style.dataset.platform !== name) {
    style.textContent = PLATFORM_CSS[name];
    style.dataset.platform = name;
  }
}

export const globalTypes = {
  platform: {
    description: 'Which platform build of the tokens is loaded',
    toolbar: {
      title: 'Platform',
      icon: 'browser',
      items: PLATFORMS.map((value) => ({ value, title: PLATFORM_LABELS[value] })),
      dynamicTitle: true,
    },
  },
  theme: {
    description: 'Light or dark semantic colours',
    toolbar: {
      title: 'Theme',
      icon: 'mirror',
      items: THEMES.map((value) => ({
        value,
        title: value === 'light' ? 'Light' : 'Dark',
      })),
      dynamicTitle: true,
    },
  },
};

export const initialGlobals = {
  platform: 'web',
  theme: 'light',
};

export const decorators = [
  (story, context) => {
    applyPlatform(context.globals.platform);
    document.documentElement.setAttribute('data-theme', context.globals.theme);
    // The preview iframe's own body sits behind the story, so it has to
    // follow the theme too or dark mode shows a white gutter.
    document.body.style.background = 'var(--semantic-color-bg-base)';
    document.body.style.margin = '0';
    return story();
  },
];

export const parameters = {
  layout: 'fullscreen',
  controls: { disable: true },
  actions: { disable: true },
  options: {
    storySort: {
      order: [
        'Overview',
        'Colour',
        'Typography',
        'Spacing',
        'Sizing',
        'Borders',
        'Elevation',
        'Components',
        'All tokens',
      ],
    },
  },
};

