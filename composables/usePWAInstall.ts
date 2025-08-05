export const usePWAInstall = () => {
  const isInstalled = ref(false)
  const canInstall = ref(false)
  const isMobile = ref(false)
  const deferredPrompt = ref<any>(null)
  const debugInfo = ref({
    userAgent: '',
    displayMode: '',
    isStandalone: false,
    hasBeforeInstallPrompt: false
  })

  // Check if running as PWA
  const checkIfInstalled = () => {
    if (process.client) {
      const displayMode = window.matchMedia('(display-mode: standalone)').matches
      const isStandalone = (window.navigator as any).standalone === true
      
      isInstalled.value = displayMode || isStandalone
      
      // Debug info
      debugInfo.value.displayMode = displayMode ? 'standalone' : 'browser'
      debugInfo.value.isStandalone = isStandalone
      debugInfo.value.userAgent = navigator.userAgent
      
      console.log('PWA Install Debug:', {
        isInstalled: isInstalled.value,
        displayMode,
        isStandalone,
        userAgent: navigator.userAgent
      })
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
        console.log('beforeinstallprompt event fired!')
        e.preventDefault()
        deferredPrompt.value = e
        canInstall.value = true
        debugInfo.value.hasBeforeInstallPrompt = true
      })
      
      // Also check if the event was already fired
      setTimeout(() => {
        console.log('PWA Install Status:', {
          canInstall: canInstall.value,
          isInstalled: isInstalled.value,
          isMobile: isMobile.value,
          hasDeferredPrompt: !!deferredPrompt.value
        })
      }, 2000)
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
    installPWA,
    debugInfo: readonly(debugInfo)
  }
}