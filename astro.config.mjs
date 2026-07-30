// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
// Static by default (no SSR adapter). Cloudflare serves `dist/` via Workers Assets.
export default defineConfig({
  output: 'static',
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
