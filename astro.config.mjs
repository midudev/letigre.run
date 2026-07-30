// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
// Static by default (no SSR adapter). Cloudflare serves `dist/` via Workers Assets.
export default defineConfig({
  // Necesario para las URLs absolutas del canonical, og:image y el sitemap
  site: 'https://letigre.run',
  output: 'static',
  integrations: [sitemap()],
  build: {
    // El CSS del sitio son ~8 KB: en línea evita una petición bloqueante
    // en la ruta crítica
    inlineStylesheets: 'always'
  },
  fonts: [
    {
      // Títulos
      provider: fontProviders.google(),
      name: 'Anton',
      cssVariable: '--font-anton',
      weights: [400],
      styles: ['normal'],
      subsets: ['latin'],
      formats: ['woff2'],
      display: 'swap',
      fallbacks: ['Impact', 'Haettenschweiler', 'sans-serif']
    },
    {
      // Textos — variable
      provider: fontProviders.google(),
      name: 'Inter',
      cssVariable: '--font-inter',
      weights: ['100 900'],
      styles: ['normal'],
      subsets: ['latin'],
      formats: ['woff2'],
      display: 'swap',
      fallbacks: ['system-ui', 'sans-serif']
    }
  ],

  vite: {
    plugins: [tailwindcss()]
  }
});
