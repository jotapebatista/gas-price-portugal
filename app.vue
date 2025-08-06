<template>
  <div>
    <NuxtPage />
    <PWAInstallPrompt />
  </div>
</template>

<script setup lang="ts">
// Initialize color mode
const colorMode = useColorMode()

useHead({
  title: 'Gazly',
  link: [
    { rel: 'icon', type: 'image/png', href: '/new_logo.png' },
    { rel: 'manifest', href: '/manifest.json' }
  ]
})
</script>
