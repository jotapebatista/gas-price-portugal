export const usePWAInstall = () => {
  const isInstalled = ref(false)
  const canInstall = ref(false)
  const isMobile = ref(false)
  const deferredPrompt = ref<any>(null)

  // Check if running as PWA
  const checkIfInstalled = () => {
    if (process.client) {
      // Check if running in standalone mode (installed PWA)
      isInstalled.value = window.matchMedia('(display-mode: standalone)').matches ||
                          (window.navigator as any).standalone === true
    }
  }

  // Check if device is mobile
  const checkIfMobile = () => {
    if (process.client) {
      isMobile.value = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    }
  }

  // Listen for beforeinstallprompt event
  const setupInstallListener = () => {
    if (process.client) {
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault()
        deferredPrompt.value = e
        canInstall.value = true
      })
    }
  }

  // Listen for appinstalled event
  const setupInstalledListener = () => {
    if (process.client) {
      window.addEventListener('appinstalled', () => {
        isInstalled.value = true
        canInstall.value = false
        deferredPrompt.value = null
      })
    }
  }

  // Install the PWA
  const installPWA = async () => {
    if (process.client && deferredPrompt.value) {
      deferredPrompt.value.prompt()
      const { outcome } = await deferredPrompt.value.userChoice
      
      if (outcome === 'accepted') {
        console.log('PWA installed successfully')
      } else {
        console.log('PWA installation declined')
      }
      
      deferredPrompt.value = null
      canInstall.value = false
    }
  }

  // Initialize on mount
  onMounted(() => {
    checkIfInstalled()
    checkIfMobile()
    setupInstallListener()
    setupInstalledListener()
  })

  return {
    isInstalled: readonly(isInstalled),
    canInstall: readonly(canInstall),
    isMobile: readonly(isMobile),
    installPWA
  }
}