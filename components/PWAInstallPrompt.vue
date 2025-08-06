<template>
  <ClientOnly>
    <div v-if="showInstallPrompt" class="fixed bottom-20 left-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700 z-50">
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ $t('install') }}</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('installDescription') }}</p>
        </div>
        <div class="flex gap-2">
          <button 
            @click="installPWA" 
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            {{ $t('install') }}
          </button>
          <button 
            @click="dismissPrompt" 
            class="px-4 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            {{ $t('dismiss') }}
          </button>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
const showInstallPrompt = ref(false)
const deferredPrompt = ref<any>(null)

onMounted(() => {
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return
  }

  const dismissed = localStorage.getItem('pwa-prompt-dismissed')
  if (dismissed) {
    return
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt.value = e
    showInstallPrompt.value = true
  })

  window.addEventListener('appinstalled', () => {
    showInstallPrompt.value = false
    deferredPrompt.value = null
  })
})

function installPWA() {
  if (deferredPrompt.value) {
    deferredPrompt.value.prompt()
    deferredPrompt.value.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        showInstallPrompt.value = false
      } else {
        showInstallPrompt.value = false
      }
      deferredPrompt.value = null
    })
  }
}

function dismissPrompt() {
  showInstallPrompt.value = false
  localStorage.setItem('pwa-prompt-dismissed', 'true')
}
</script> 