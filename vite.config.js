import { defineConfig } from 'vite'

export default defineConfig({
  // Relative base so static hosts (GitHub Pages / any CDN) work without rewrite config
  base: './',
})
