<template>
  <div>
    <NuxtPage />
    <PWAInstallPrompt />
    <InstallAppButton />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Gazly',
  link: [
    { rel: 'icon', type: 'image/png', href: '/new_logo.png' },
    { rel: 'manifest', href: '/manifest.json' }
  ]
})
</script>
