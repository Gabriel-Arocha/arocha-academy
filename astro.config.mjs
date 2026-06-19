// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// IMPORTANT: change this to your real website address once it is live
// (e.g. https://arochaacademy.com). It is only used for SEO / sitemaps.
const SITE_URL = 'https://arochaacademy.com';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'ignore',

  // The site is fully static (great for speed, SEO, and free hosting).
  output: 'static',

  // Two languages: English (default) + Spanish.
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
  },

  // Visiting the bare domain sends people to the English homepage.
  redirects: {
    '/': '/en/',
  },

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en-US',
          es: 'es-MX',
        },
      },
    }),
  ],
});
