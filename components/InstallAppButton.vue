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
  
  <!-- Debug info in development -->
  <div v-if="isDev" class="fixed bottom-4 left-4 z-[1001] bg-black/80 text-white p-4 rounded-lg text-xs max-w-xs">
    <div class="font-bold mb-2">PWA Debug Info:</div>
    <div>Mobile: {{ isMobile }}</div>
    <div>Can Install: {{ canInstall }}</div>
    <div>Is Installed: {{ isInstalled }}</div>
    <div>Display Mode: {{ debugInfo.displayMode }}</div>
    <div>Has Prompt: {{ debugInfo.hasBeforeInstallPrompt }}</div>
    <button 
      @click="forceShowInstall" 
      class="mt-2 bg-red-500 text-white px-2 py-1 rounded text-xs"
    >
      Force Show Install
    </button>
  </div>
</template>

<script setup lang="ts">
const { t: $t } = useI18n()
const { isInstalled, canInstall, isMobile, installPWA, debugInfo } = usePWAInstall()

// Development mode check
const isDev = process.dev

// Only show install button if:
// - On mobile device
// - App can be installed
// - App is not already installed
const shouldShowInstallButton = computed(() => {
  return isMobile.value && canInstall.value && !isInstalled.value
})

// Force show for testing
const forceShowInstall = () => {
  console.log('Forcing install prompt...')
  // This will trigger the install prompt if available
  if (process.client && 'serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      console.log('Service Worker ready:', registration)
    })
  }
}
</script> 