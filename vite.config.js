import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { VitePWA } from 'vite-plugin-pwa'

const cacheOption = {
  handler: 'CacheFirst',
  options: {
    cacheName: 'cdn',
    expiration: { maxAgeSeconds: 60 * 60 * 24 * 30 },
    cacheableResponse: { statuses: [0, 200], },
  },
}
const cacheOption2 = {
  handler: 'StaleWhileRevalidate',
  options: {
    cacheName: 'cdn',
    expiration: { maxAgeSeconds: 60 * 60 * 24 * 30 },
    cacheableResponse: { statuses: [0, 200], },
  },
}

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
            urlPattern: /^https:\/\/worldflipper-cdn\.miaowm5\.com\/.*\.(png|jpe?g|gif|webp|bmp|svg|mp3|wav|ogg|m4a|flac)$/i,
            ...cacheOption,
          },
          {
            urlPattern: /^https:\/\/worldflipper-cdn2\.miaowm5\.com\/.*\.(png|jpe?g|gif|webp|bmp|svg|mp3|wav|ogg|m4a|flac)$/i,
            ...cacheOption,
          },
          {
            urlPattern: /^https:\/\/worldflipper-cdn3\.miaowm5\.com\/.*\.(png|jpe?g|gif|webp|bmp|svg|mp3|wav|ogg|m4a|flac)$/i,
            ...cacheOption,
          },
          {
            urlPattern: /^https:\/\/cdn\.miaowm5\.com\/.*\.(png|jpe?g|gif|webp|bmp|svg|mp3|wav|ogg|m4a|flac)$/i,
            ...cacheOption,
          },
          {
            urlPattern: /^https:\/\/worldflipper-cdn\.miaowm5\.com\/.*\.(json)$/i,
            ...cacheOption2,
          },
          {
            urlPattern: /^https:\/\/worldflipper-cdn2\.miaowm5\.com\/.*\.(json)$/i,
            ...cacheOption2,
          },
          {
            urlPattern: /^https:\/\/worldflipper-cdn3\.miaowm5\.com\/.*\.(json)$/i,
            ...cacheOption2,
          },
          {
            urlPattern: /^https:\/\/cdn\.miaowm5\.com\/.*\.(json)$/i,
            ...cacheOption2,
          },
        ],
      },
    }),
  ],
  build: { emptyOutDir: true },
})
