import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Dedicated singlefile build for standalone error pages. Everything (JS, CSS,
// fonts) is inlined into one self-contained HTML shell; a post-build step
// (scripts/build-errors.ts) clones it per status code with SSR bodies.
export default defineConfig({
  base: './',
  publicDir: false,
  plugins: [vue(), viteSingleFile()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // Inline every asset (JS/CSS/fonts) so each page is one portable file.
    assetsInlineLimit: 100 * 1024 * 1024,
    outDir: 'dist/errors',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        error: fileURLToPath(new URL('./error.html', import.meta.url)),
      },
    },
  },
})
