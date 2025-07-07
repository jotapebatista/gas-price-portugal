<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center p-4">
    <div class="max-w-md w-full text-center">
      <!-- Offline Icon -->
      <div class="mb-8">
        <Icon name="ph:wifi-slash" class="w-20 h-20 text-neutral-400 mx-auto" />
      </div>
      
      <!-- Title -->
      <h1 class="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
        You're Offline
      </h1>
      
      <!-- Description -->
      <p class="text-neutral-600 dark:text-neutral-400 mb-8">
        Don't worry! GasApp Portugal works offline. You can still browse gas stations and prices that were previously loaded.
      </p>
      
      <!-- Features Available -->
      <div class="bg-white dark:bg-neutral-800 rounded-xl p-6 mb-8">
        <h3 class="font-semibold text-neutral-900 dark:text-white mb-4">
          Available Offline:
        </h3>
        <ul class="space-y-3 text-left">
          <li class="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
            <Icon name="ph:check-circle" class="w-5 h-5 text-green-500 flex-shrink-0" />
            <span>Browse all districts and municipalities</span>
          </li>
          <li class="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
            <Icon name="ph:check-circle" class="w-5 h-5 text-green-500 flex-shrink-0" />
            <span>View gas station locations and prices</span>
          </li>
          <li class="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
            <Icon name="ph:check-circle" class="w-5 h-5 text-green-500 flex-shrink-0" />
            <span>Access your favorite stations</span>
          </li>
          <li class="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
            <Icon name="ph:check-circle" class="w-5 h-5 text-green-500 flex-shrink-0" />
            <span>Use location-based features</span>
          </li>
        </ul>
      </div>
      
      <!-- Actions -->
      <div class="space-y-3">
        <button
          @click="goToApp"
          class="w-full py-3 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors"
        >
          Continue to App
        </button>
        
        <button
          @click="retryConnection"
          class="w-full py-3 px-6 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-xl font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
        >
          Try Again
        </button>
      </div>
      
      <!-- Last Updated Info -->
      <div v-if="lastUpdated" class="mt-6 p-4 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
        <p class="text-xs text-neutral-500 dark:text-neutral-400">
          Data last updated: {{ formatDate(lastUpdated) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
const { getLastUpdated } = useOfflineData();

const lastUpdated = ref(null);

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return 'Unknown';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return 'Unknown';
  }
};

// Go to main app
const goToApp = () => {
  navigateTo('/');
};

// Retry connection
const retryConnection = () => {
  window.location.reload();
};

// Get last updated time on mount
onMounted(async () => {
  try {
    const districtsUpdated = await getLastUpdated('districts');
    const fuelTypesUpdated = await getLastUpdated('fuelTypes');
    
    // Use the most recent update time
    if (districtsUpdated && fuelTypesUpdated) {
      const districtsDate = new Date(districtsUpdated);
      const fuelTypesDate = new Date(fuelTypesUpdated);
      lastUpdated.value = districtsDate > fuelTypesDate ? districtsUpdated : fuelTypesUpdated;
    } else if (districtsUpdated) {
      lastUpdated.value = districtsUpdated;
    } else if (fuelTypesUpdated) {
      lastUpdated.value = fuelTypesUpdated;
    }
  } catch (error) {
    console.error('Error getting last updated time:', error);
  }
});
</script> 