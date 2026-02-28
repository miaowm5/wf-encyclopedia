import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { VitePWA } from 'vite-plugin-pwa'

const cdnHosts = [
  'worldflipper-cdn.miaowm5.com',
  'worldflipper-cdn2.miaowm5.com',
  'worldflipper-cdn3.miaowm5.com',
  'worldflipper-cdn4.miaowm5.com',
]

const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const buildPattern = (host, extPattern)=> new RegExp(`^https://${escapeRegex(host)}/.*\\.(${extPattern})$`, 'i')

const mediaCacheOption = {
  handler: 'CacheFirst',
  options: {
    cacheName: 'cdn',
    expiration: { maxAgeSeconds: 60 * 60 * 24 * 30, },
    cacheableResponse: { statuses: [0, 200] },
  },
}

const jsonCacheOption = {
  handler: 'StaleWhileRevalidate',
  options: {
    cacheName: 'cdn',
    expiration: { maxAgeSeconds: 60 * 60 * 24 * 30, },
    cacheableResponse: { statuses: [0, 200] },
  },
}

// https://vitejs.dev/config/
export default defineConfig(({ mode })=>{
  const config = {
    plugins: [ svelte() ],
    build: {
      outDir: './dist',
      emptyOutDir: true
    },
    optimizeDeps: { include: ['gif.js'] },
  }
  if (mode === 'app'){
    config.build.outDir = './app/resources'
  }
  if (mode !== 'app'){
    config.plugins.push(VitePWA({
      registerType: 'autoUpdate',
      devOptions: { enabled: false },
      workbox: {
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
          ...cdnHosts.map((host)=>({
            urlPattern: buildPattern(host, 'png|jpe?g|gif|webp|bmp|svg|mp3|wav|ogg|m4a|flac'),
            ...mediaCacheOption,
          })),
          ...cdnHosts.map((host)=>({
            urlPattern: buildPattern(host, 'json'),
            ...jsonCacheOption,
          })),
        ],
      },
      manifest: {
        name: '星見の図鑑',
        short_name: '星見の図鑑',
        description: '世界弹射物语 星见图鉴 | ワールドフリッパー 星見の図鑑 | World Flipper Stargazing Encyclopedia',
        lang: 'zh-CN',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#ffcf8f',
        icons: [
          {
            src: "assets/appIcon.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "assets/appIcon512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ]
      },
    }))
  }
  return config
})
