<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
    <div class="bg-white dark:bg-neutral-900 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
      <div class="text-center mb-6">
        <Icon name="ph:gas-pump" class="w-16 h-16 text-primary-600 mx-auto mb-4" />
        <h2 class="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
          Welcome to GasApp Portugal
        </h2>
        <p class="text-neutral-600 dark:text-neutral-400">
          Let's set up your preferences for the best experience
        </p>
      </div>

      <!-- App Mode Selection -->
      <div class="mb-6">
        <h3 class="font-semibold text-neutral-900 dark:text-white mb-3">
          How would you like to use GasApp?
        </h3>
        
        <div class="space-y-3">
          <!-- Offline Mode -->
          <button
            @click="selectedAppMode = 'offline'"
            class="w-full p-4 border-2 rounded-xl text-left transition-all"
            :class="selectedAppMode === 'offline' 
              ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20' 
              : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'"
          >
            <div class="flex items-start gap-3">
              <div class="flex-shrink-0 w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Icon name="ph:device-mobile" class="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 class="font-semibold text-neutral-900 dark:text-white mb-1">
                  Offline Mode (Recommended)
                </h4>
                <p class="text-sm text-neutral-600 dark:text-neutral-400">
                  Download all data for offline use. Works without internet connection.
                </p>
              </div>
            </div>
          </button>

          <!-- Live Mode -->
          <button
            @click="selectedAppMode = 'live'"
            class="w-full p-4 border-2 rounded-xl text-left transition-all"
            :class="selectedAppMode === 'live' 
              ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20' 
              : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'"
          >
            <div class="flex items-start gap-3">
              <div class="flex-shrink-0 w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <Icon name="ph:wifi-high" class="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 class="font-semibold text-neutral-900 dark:text-white mb-1">
                  Live Mode
                </h4>
                <p class="text-sm text-neutral-600 dark:text-neutral-400">
                  Always fetch latest data. Requires internet connection.
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- Geolocation Permission -->
      <div class="mb-6">
        <h3 class="font-semibold text-neutral-900 dark:text-white mb-3">
          Location Access
        </h3>
        
        <div class="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-4">
          <div class="flex items-start gap-3">
            <Icon name="ph:map-pin" class="w-5 h-5 text-primary-600 mt-0.5" />
            <div>
              <h4 class="font-medium text-neutral-900 dark:text-white mb-1">
                Enable Location Access
              </h4>
              <p class="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                Show nearby gas stations and provide better recommendations based on your location.
              </p>
              
              <div class="flex gap-2">
                <button
                  @click="selectedGeolocation = true"
                  class="px-4 py-2 text-sm rounded-lg transition-colors"
                  :class="selectedGeolocation 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600'"
                >
                  Enable
                </button>
                <button
                  @click="selectedGeolocation = false"
                  class="px-4 py-2 text-sm rounded-lg transition-colors"
                  :class="!selectedGeolocation 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600'"
                >
                  Not Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Theme Selection -->
      <div class="mb-6">
        <h3 class="font-semibold text-neutral-900 dark:text-white mb-3">
          Appearance
        </h3>
        
        <div class="grid grid-cols-3 gap-2">
          <button
            @click="selectedTheme = 'light'"
            class="p-3 border-2 rounded-lg transition-all"
            :class="selectedTheme === 'light' 
              ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20' 
              : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'"
          >
            <Icon name="ph:sun" class="w-6 h-6 text-yellow-500 mx-auto mb-2" />
            <span class="text-sm font-medium text-neutral-900 dark:text-white">Light</span>
          </button>
          
          <button
            @click="selectedTheme = 'dark'"
            class="p-3 border-2 rounded-lg transition-all"
            :class="selectedTheme === 'dark' 
              ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20' 
              : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'"
          >
            <Icon name="ph:moon" class="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <span class="text-sm font-medium text-neutral-900 dark:text-white">Dark</span>
          </button>
          
          <button
            @click="selectedTheme = 'system'"
            class="p-3 border-2 rounded-lg transition-all"
            :class="selectedTheme === 'system' 
              ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20' 
              : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'"
          >
            <Icon name="ph:monitor" class="w-6 h-6 text-neutral-500 mx-auto mb-2" />
            <span class="text-sm font-medium text-neutral-900 dark:text-white">Auto</span>
          </button>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3">
        <button
          @click="handleContinue"
          class="flex-1 py-3 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['complete']);

const { setAppMode, setGeolocationEnabled, setTheme, completeFirstLaunch } = useUserPreferences();
const { colorMode } = useColorMode();

// Local state
const selectedAppMode = ref('offline');
const selectedGeolocation = ref(false);
const selectedTheme = ref('system');

// Handle continue button
const handleContinue = () => {
  // Save preferences
  setAppMode(selectedAppMode.value);
  setGeolocationEnabled(selectedGeolocation.value);
  setTheme(selectedTheme.value);
  
  // Apply theme immediately
  if (colorMode?.value !== undefined) {
    colorMode.value = selectedTheme.value === 'system' ? 'system' : selectedTheme.value;
  }
  
  // Mark first launch as completed
  completeFirstLaunch();
  
  // Emit completion event
  emit('complete', {
    appMode: selectedAppMode.value,
    geolocationEnabled: selectedGeolocation.value,
    theme: selectedTheme.value
  });
};

// Initialize with current theme
onMounted(() => {
  if (colorMode?.value) {
    selectedTheme.value = colorMode.value;
  }
});
</script> 