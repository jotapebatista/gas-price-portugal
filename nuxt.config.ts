// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    ['@vite-pwa/nuxt', {
      registerType: 'autoUpdate',
      manifest: {
        name: 'Preços Combustíveis Portugal',
        short_name: 'Combustíveis',
        description: 'Encontre os melhores preços de combustível em Portugal',
        theme_color: '#0ea5e9',
        background_color: '#ffffff',
        display: 'standalone',
        lang: 'pt',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        categories: ['utilities', 'travel'],
        screenshots: [
          {
            src: '/screenshot-wide.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide'
          },
          {
            src: '/screenshot-narrow.png',
            sizes: '750x1334',
            type: 'image/png',
            form_factor: 'narrow'
          }
        ]
      },
      workbox: {
        navigateFallback: '/',
        globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          }
        ]
      },
      client: {
        installPrompt: true,
        periodicSyncForUpdates: 20
      },
      devOptions: {
        enabled: true,
        type: 'module'
      }
    }],
    ['@nuxtjs/robots', {
      rules: [{ userAgent: '*', allow: '/' }],
    }],
    ['@nuxtjs/sitemap', {
      siteUrl: 'http://localhost:3000',
      autoLastmod: true,
    }],
    '@nuxt/image',
    '@nuxtjs/i18n',
    '@nuxtjs/device',
    '@nuxt/icon',
    ['@nuxtjs/google-fonts', {
      families: {
        Inter: [400, 500, 700],
        Roboto: [400, 700],
      },
      display: 'swap',
    }],
  ],
  i18n: {
    defaultLocale: 'en',
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'pt', name: 'Português', file: 'pt.json' }
    ],
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    },
    bundle: {
      optimizeTranslationDirective: false
    },
    debug: true,
    lazy: false,
    vueI18n: '~/i18n.config.ts'
  },
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
  },
  image: {
    // domains: ['yourdomain.com'],
  },
  runtimeConfig: {
    public: {
      appName: 'Nuxt3 PWA Pro',
    },
  },
})
