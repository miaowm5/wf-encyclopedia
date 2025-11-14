import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { VitePWA } from 'vite-plugin-pwa'

const proxy = 'https://worldflipper.miaowm5.com'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: { enabled: true },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/worldflipper-cdn\.miaowm5\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'cdn',
              expiration: { maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200], },
            },
          },
          {
            urlPattern: /^https:\/\/worldflipper-cdn2\.miaowm5\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'cdn',
              expiration: { maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200], },
            },
          },
          {
            urlPattern: /^https:\/\/worldflipper-cdn3\.miaowm5\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'cdn',
              expiration: { maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200], },
            },
          }
        ],
      },
    }),
  ],
  build: { emptyOutDir: true },
  server: {
    proxy: {
      // '/api': { target: proxy, changeOrigin: true },
    }
  }
})
