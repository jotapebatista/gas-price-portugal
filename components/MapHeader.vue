<template>
  <div class="absolute top-0 left-0 right-0 z-[9999] bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-gray-700">
    <div class="flex items-center justify-between p-4">
      <div>
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">
          {{ $t('appTitle') }}
        </h1>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {{ $t('appSubtitle') }}
        </p>
      </div>
      
      <!-- Theme Toggle -->
      <button
        @click="toggleTheme"
        class="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md"
        :aria-label="$t('toggleTheme')"
      >
        <!-- Sun icon for dark mode -->
        <svg v-if="colorMode.value === 'dark'" class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
        </svg>
        <!-- Moon icon for light mode -->
        <svg v-else class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode()

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script> 