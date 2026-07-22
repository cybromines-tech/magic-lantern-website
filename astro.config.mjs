// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://magiclantern.studio',
  trailingSlash: 'never',
  build: {
    // Emit `/about.html` rather than `/about/index.html` so the output drops
    // straight onto any plain static host without directory-index rewrites.
    format: 'file',
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      // three.js is dynamically imported by the hero scene; keep it in its own
      // chunk so it never blocks first paint.
      chunkSizeWarningLimit: 900,
    },
  },
});
