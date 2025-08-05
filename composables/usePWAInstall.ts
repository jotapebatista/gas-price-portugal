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

  // Check if PWA meets installation criteria
  const checkPWACriteria = () => {
    if (process.client) {
      // Check if service worker is registered
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          console.log('Service Worker Registrations:', registrations.length)
          if (registrations.length > 0) {
            console.log('Service Worker is active')
          }
        })
      }

      // Check if manifest is accessible
      const manifestLink = document.querySelector('link[rel="manifest"]')
      if (manifestLink) {
        console.log('Manifest link found:', manifestLink.getAttribute('href'))
        
        // Test if manifest is actually accessible
        const manifestHref = manifestLink.getAttribute('href')
        if (manifestHref) {
          fetch(manifestHref)
            .then(response => {
              if (response.ok) {
                console.log('Manifest is accessible')
                return response.json()
              } else {
                console.log('Manifest not accessible:', response.status)
              }
            })
            .then(data => {
              if (data) {
                console.log('Manifest content:', data)
              }
            })
            .catch(error => {
              console.log('Manifest fetch error:', error)
            })
        }
      } else {
        console.log('No manifest link found')
      }

      // Check if running on HTTPS
      const isHTTPS = location.protocol === 'https:'
      console.log('HTTPS:', isHTTPS)
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
      
      // Check for existing deferred prompt (in case event fired before listener was added)
      if ((window as any).deferredPrompt) {
        console.log('Found existing deferred prompt')
        deferredPrompt.value = (window as any).deferredPrompt
        canInstall.value = true
        debugInfo.value.hasBeforeInstallPrompt = true
      }
      
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
    checkPWACriteria()
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