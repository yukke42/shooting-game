import { defineConfig } from 'vite'

export default defineConfig({
  base: '/shooting-game/',
  build: {
    target: 'es2020',
    outDir: 'dist'
  },
  server: {
    port: 3000
  }
})