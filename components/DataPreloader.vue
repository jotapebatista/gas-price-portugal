<template>
  <div v-if="showPreloader" class="fixed inset-0 z-50 bg-white dark:bg-neutral-900 flex items-center justify-center">
    <div class="max-w-md w-full mx-4 text-center">
      <!-- Logo/Icon -->
      <div class="mb-8">
        <Icon name="ph:gas-pump" class="w-16 h-16 text-primary-600 mx-auto" />
      </div>
      
      <!-- Title -->
      <h1 class="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
        {{ isClient && isOnline ? 'Loading GasApp Data' : 'Offline Mode' }}
      </h1>
      
      <!-- Description -->
      <p class="text-neutral-600 dark:text-neutral-400 mb-8">
        {{ isClient && isOnline 
          ? 'Downloading all gas station data for offline use. This may take a few minutes on first load.' 
          : 'Using cached data. Some features may be limited.' 
        }}
      </p>
      
      <!-- Progress Bar -->
      <div v-if="isClient && isOnline && !isComplete" class="mb-6">
        <div class="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-3 mb-2">
          <div 
            class="bg-primary-600 h-3 rounded-full transition-all duration-300"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
        <p class="text-sm text-neutral-600 dark:text-neutral-400">
          {{ progressText }}
        </p>
      </div>
      
      <!-- Status Messages -->
      <div v-if="statusMessage" class="mb-6">
        <p class="text-sm text-neutral-600 dark:text-neutral-400">
          {{ statusMessage }}
        </p>
      </div>
      
      <!-- Buttons -->
      <div class="space-y-3">
        <button
          v-if="isClient && isOnline && !isComplete"
          @click="skipPreload"
          class="w-full py-3 px-6 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-xl font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
        >
          Skip & Use Online Mode
        </button>
        
        <button
          v-if="isComplete || !isClient || !isOnline"
          @click="continueToApp"
          class="w-full py-3 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors"
        >
          {{ isClient && isOnline ? 'Continue to App' : 'Use Offline Data' }}
        </button>
        
        <button
          v-if="isClient && !isOnline && isDataAvailable"
          @click="retryOnline"
          class="w-full py-3 px-6 border border-primary-300 dark:border-primary-600 text-primary-600 dark:text-primary-400 rounded-xl font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
        >
          Try Online Mode
        </button>
      </div>
      
      <!-- Offline Notice -->
      <div v-if="isClient && !isOnline" class="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl">
        <div class="flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
          <Icon name="ph:wifi-slash" class="w-4 h-4" />
          <span class="text-sm">You're offline. Using cached data.</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  showPreloader: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['complete', 'skip']);

const { preloadAllData, isDataAvailableOffline, isOnline } = useEnhancedGasStationsAPI();
const { isIndexedDBAvailable } = useOfflineData();

const progress = ref(0);
const statusMessage = ref('');
const isComplete = ref(false);
const isDataAvailable = ref(false);
const isClient = ref(false);

// Progress text based on progress percentage
const progressText = computed(() => {
  if (progress.value < 20) return 'Loading districts and fuel types...';
  if (progress.value < 40) return 'Loading municipalities...';
  if (progress.value < 60) return 'Preparing to load gas stations...';
  if (progress.value < 100) return `Loading gas stations... ${Math.round(progress.value)}%`;
  return 'Complete!';
});

// Check if offline data is available
const checkOfflineData = async () => {
  try {
    if (!isIndexedDBAvailable()) {
      isDataAvailable.value = false;
      return;
    }
    isDataAvailable.value = await isDataAvailableOffline();
  } catch (error) {
    console.warn('Error checking offline data availability:', error);
    isDataAvailable.value = false;
  }
};

// Preload all data
const startPreload = async () => {
  if (!isOnline.value) {
    await checkOfflineData();
    return;
  }
  
  try {
    statusMessage.value = 'Starting data download...';
    
    const success = await preloadAllData((currentProgress) => {
      progress.value = currentProgress;
      
      if (currentProgress < 20) {
        statusMessage.value = 'Loading districts and fuel types...';
      } else if (currentProgress < 40) {
        statusMessage.value = 'Loading municipalities...';
      } else if (currentProgress < 60) {
        statusMessage.value = 'Preparing to load gas stations...';
      } else {
        statusMessage.value = `Loading gas stations... ${Math.round(currentProgress)}%`;
      }
    });
    
    if (success) {
      isComplete.value = true;
      statusMessage.value = 'All data loaded successfully!';
    } else {
      statusMessage.value = 'Some data failed to load. You can still use the app with limited functionality.';
    }
  } catch (error) {
    statusMessage.value = 'Error loading data. You can still use the app with limited functionality.';
  }
};

// Skip preload and use online mode
const skipPreload = () => {
  emit('skip');
};

// Continue to app
const continueToApp = () => {
  emit('complete');
};

// Retry online mode
const retryOnline = () => {
  window.location.reload();
};

// Watch for online status changes
watch(isOnline, (newValue) => {
  if (newValue && !isComplete.value) {
    startPreload();
  } else if (!newValue) {
    checkOfflineData();
  }
});

// Start preload on mount
onMounted(async () => {
	try {
		isClient.value = true;
		await checkOfflineData();
		
		if (isOnline.value) {
			startPreload();
		}
	} catch (error) {
		console.warn('Error in DataPreloader mounted hook:', error);
		// If there's an error, we can still continue to the app
		isComplete.value = true;
		statusMessage.value = 'Error initializing offline data. Continuing to app...';
	}
});
</script> 