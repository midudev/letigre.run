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
  // Las fotos se optimizan offline con `pnpm images` y se sirven desde
  // public/images con <picture>. Sin Sharp en el build de Astro.
  image: {
    service: {
      entrypoint: 'astro/assets/services/noop'
    }
  },
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
      // Medido: la variable subseteada a latin pesa 48.432 B y los estáticos 400
      // y 600 de Fontsource suman 48.116 B. Son 316 bytes menos a cambio de una
      // petición y un preload más, así que gana la variable.
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
