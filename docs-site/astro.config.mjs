// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

/**
 * Horizon Stays reference site.
 *
 * Hand-written pages live in src/content/docs/. Everything under
 * src/content/docs/components/ is generated from ../src/components by
 * scripts/generate-pages.mjs before every dev or build run, so a component
 * page can never disagree with the component it documents.
 */
export default defineConfig({
  integrations: [
    starlight({
      title: 'Horizon Stays',
      description: 'Reference for the Horizon Stays design system.',
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/Aye-Kyawt/horizon-stays-design-system',
        },
      ],
      head: [
        { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' } },
        { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true } },
        {
          tag: 'link',
          attrs: {
            rel: 'stylesheet',
            href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Padauk:wght@400;700&display=swap',
          },
        },
      ],
      customCss: ['./src/styles/custom.css'],
      sidebar: [
        { label: 'Start here', items: [{ label: 'Overview', link: '/' }] },
        { label: 'Components', items: [{ autogenerate: { directory: 'components' } }] },
      ],
    }),
  ],
});
