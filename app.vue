<template>
  <div>
    <NuxtPage />
    <PWAInstallPrompt />
    <InstallAppButton />
  </div>
</template>

<script setup lang="ts">
useHead({
  link: [
    { rel: 'icon', type: 'image/png', href: '/ios-style-icon-192.png' },
    { rel: 'manifest', href: '/manifest.json' }
  ]
})
</script>
