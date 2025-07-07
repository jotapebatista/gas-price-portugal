<template>
  <div v-if="!isOnline && isClient" class="fixed top-0 left-0 right-0 z-40 bg-yellow-500 dark:bg-yellow-600 text-white px-4 py-2">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <Icon name="ph:wifi-slash" class="w-4 h-4" />
        <span class="text-sm font-medium">You're offline. Using cached data.</span>
      </div>
      
      <button
        @click="retryConnection"
        class="text-sm underline hover:no-underline transition-all"
      >
        Retry
      </button>
    </div>
  </div>
</template>

<script setup>
const { isOnline } = useEnhancedGasStationsAPI();
const isClient = ref(false);

// Retry connection
const retryConnection = () => {
  window.location.reload();
};

// Set client flag on mount
onMounted(() => {
  isClient.value = true;
});
</script> 