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
      // Check multiple ways to detect if PWA is installed
      const displayMode = window.matchMedia('(display-mode: standalone)').matches
      const isStandalone = (window.navigator as any).standalone === true
      const isInApp = window.navigator.userAgent.includes('wv') // Android WebView
      const isInPWA = window.location.href.includes('standalone') || window.location.href.includes('pwa')
      
      isInstalled.value = displayMode || isStandalone || isInApp || isInPWA
      
      // Debug info (only in development)
      if (process.dev) {
        debugInfo.value.displayMode = displayMode ? 'standalone' : 'browser'
        debugInfo.value.isStandalone = isStandalone
        debugInfo.value.userAgent = navigator.userAgent
      }
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
    if (process.client && process.dev) {
      // Check if service worker is registered
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          // Service worker check completed
        })
      }

      // Check if manifest is accessible
      const manifestLink = document.querySelector('link[rel="manifest"]')
      if (manifestLink) {
        // Manifest link found
        const manifestHref = manifestLink.getAttribute('href')
        if (manifestHref) {
          fetch(manifestHref)
            .then(response => {
              if (response.ok) {
                return response.json()
              }
            })
            .then(data => {
              // Manifest loaded successfully
            })
            .catch(error => {
              // Manifest fetch error
            })
        }
      }

      // Check if running on HTTPS
      const isHTTPS = location.protocol === 'https:'
    }
  }

  // Listen for beforeinstallprompt event
  const setupInstallListener = () => {
    if (process.client) {
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault()
        deferredPrompt.value = e
        canInstall.value = true
        debugInfo.value.hasBeforeInstallPrompt = true
      })
      
      // Check for existing deferred prompt (in case event fired before listener was added)
      if ((window as any).deferredPrompt) {
        deferredPrompt.value = (window as any).deferredPrompt
        canInstall.value = true
        debugInfo.value.hasBeforeInstallPrompt = true
      }
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
    if (process.client) {
      if (deferredPrompt.value) {
        try {
          // Check if the prompt method exists (Firefox compatibility)
          if (typeof deferredPrompt.value.prompt === 'function') {
            deferredPrompt.value.prompt()
            const { outcome } = await deferredPrompt.value.userChoice
          } else {
            // For Firefox and other browsers that don't support prompt()
            if (deferredPrompt.value.userChoice) {
              const choice = await deferredPrompt.value.userChoice
            }
          }
        } catch (error) {
          // Error during PWA installation
        }
        
        deferredPrompt.value = null
        canInstall.value = false
      } else {
        // For iOS, show manual installation instructions
        if (isMobile.value && /iPad|iPhone|iPod/.test(navigator.userAgent)) {
          alert('To install this app on iOS:\n\n1. Tap the Share button\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add"')
        }
      }
    }
  }

  // Initialize on mount
  onMounted(() => {
    checkIfInstalled()
    checkIfMobile()
    checkPWACriteria()
    setupInstallListener()
    setupInstalledListener()
    
    // Periodically check installation status (useful for when user installs and returns)
    if (process.client) {
      setInterval(() => {
        checkIfInstalled()
      }, 5000) // Check every 5 seconds
    }
  })

  return {
    isInstalled: readonly(isInstalled),
    canInstall: readonly(canInstall),
    isMobile: readonly(isMobile),
    installPWA,
    debugInfo: readonly(debugInfo)
  }
}