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
    <div>HTTPS: {{ isHTTPS }}</div>
    <div>Service Worker: {{ hasServiceWorker }}</div>
    <div>Manifest: {{ hasManifest }}</div>
    <button 
      @click="forceShowInstall" 
      class="mt-2 bg-red-500 text-white px-2 py-1 rounded text-xs"
    >
      Force Show Install
    </button>
  </div>

  <!-- Mobile-friendly debug panel (always visible on mobile) -->
  <div v-if="isMobile && !isDev" class="fixed top-4 left-4 z-[1001] bg-blue-600 text-white p-3 rounded-lg text-xs max-w-xs">
    <div class="font-bold mb-1">PWA Status:</div>
    <div>Install: {{ canInstall ? '✅' : '❌' }}</div>
    <div>Installed: {{ isInstalled ? '✅' : '❌' }}</div>
    <div>Manifest: {{ hasManifest ? '✅' : '❌' }}</div>
    <div>iOS: {{ isIOS ? '✅' : '❌' }}</div>
    <button 
      @click="forceShowInstall" 
      class="mt-2 bg-white text-blue-600 px-2 py-1 rounded text-xs font-bold"
    >
      {{ isIOS ? 'Show iOS Instructions' : 'Test Install' }}
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

const hasServiceWorker = computed(() => {
  if (process.client) {
    return 'serviceWorker' in window.navigator
  }
  return false
})

const hasManifest = computed(() => {
  if (process.client) {
    return !!document.querySelector('link[rel="manifest"]')
  }
  return false
})

const isIOS = computed(() => {
  if (process.client) {
    return /iPad|iPhone|iPod/.test(navigator.userAgent)
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

// Force show for testing
const forceShowInstall = () => {
  console.log('Forcing install prompt...')
  
  // Check if we can manually trigger installation
  if (process.client) {
    // For iOS, show manual instructions
    if (isIOS.value) {
      alert('To install this app on iOS:\n\n1. Tap the Share button (square with arrow up)\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add"\n\nThis will add the app to your home screen!')
      return
    }
    
    // Try to trigger the install prompt manually
    if (canInstall.value) {
      console.log('Using deferred prompt')
      installPWA()
    } else {
      console.log('No deferred prompt available')
      
      // Check if we can trigger the beforeinstallprompt event
      const event = new Event('beforeinstallprompt')
      window.dispatchEvent(event)
      
      // Also try to check if the app meets criteria
      console.log('Checking PWA criteria...')
      console.log('HTTPS:', window.location.protocol === 'https:')
      console.log('Service Worker:', 'serviceWorker' in window.navigator)
      console.log('Manifest:', document.querySelector('link[rel="manifest"]'))
    }
  }
}
</script> 