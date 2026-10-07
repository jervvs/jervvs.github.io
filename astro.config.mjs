import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://jervvs.github.io',
  integrations: [sitemap()],
  // Old vocabulary → new vocabulary. Kept permanently so existing
  // inbound links keep working after the rename.
  redirects: {
    '/projects': '/things',
    '/projects/[...slug]': '/things/[...slug]',
    '/writing': '/notes',
    '/writing/[...slug]': '/notes/[...slug]',
    '/photography': '/places',
  },
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark-dimmed',
      },
    },
  },
});