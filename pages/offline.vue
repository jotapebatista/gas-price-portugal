<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <div class="text-center max-w-md">
      <div class="mb-8">
        <Icon name="ph:wifi-slash" class="w-24 h-24 mx-auto text-gray-400 dark:text-gray-600" />
      </div>
      
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        You're Offline
      </h1>
      
      <p class="text-gray-600 dark:text-gray-400 mb-8">
        Please check your internet connection and try again. GasApp needs an internet connection to show you the latest fuel prices.
      </p>
      
      <button 
        @click="retryConnection"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
</template>

<script setup>
const router = useRouter();

const retryConnection = () => {
  if (navigator.onLine) {
    router.push('/');
  } else {
    // Show a toast or alert that user is still offline
    alert('You are still offline. Please check your internet connection.');
  }
};
</script> 