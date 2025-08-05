<template>
  <div v-if="shouldShowInstallButton" class="fixed top-4 right-4 z-[1001]">
    <button
      @click="installPWA"
      class="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-200"
    >
      <Icon name="heroicons:arrow-down-tray" class="w-5 h-5" />
      <span class="text-sm font-medium">{{ $t('installApp') }}</span>
    </button>
  </div>
  
  
</template>

<script setup lang="ts">
const { t: $t } = useI18n()
const { isInstalled, canInstall, isMobile, installPWA, debugInfo } = usePWAInstall()

// Development mode check
const isDev = process.dev

// Browser API checks
const isHTTPS = computed(() => {
  if (process.client) {
    return window.location.protocol === 'https:'
  }
  return false
})



// Only show install button if:
// - On mobile device
// - App can be installed
// - App is not already installed
const shouldShowInstallButton = computed(() => {
  return isMobile.value && canInstall.value && !isInstalled.value
})


</script> 