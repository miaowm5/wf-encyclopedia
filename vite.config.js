import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

const proxy = 'https://tt.miaowm5.com'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
  ],
  build: { emptyOutDir: true },
  server: {
    proxy: {
      // '/api': { target: proxy, changeOrigin: true },
      // '/resource': { target: proxy, changeOrigin: true },
    }
  }
})
