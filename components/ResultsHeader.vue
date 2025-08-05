<template>
  <div v-if="count > 0" class="mb-4 sm:mb-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
          {{ $t('foundStations', { count }) }}
        </h2>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {{ $t('lastUpdate') }}
        </p>
      </div>
      <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        {{ count }} {{ $t('stations') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  count: number
}

defineProps<Props>()
</script> 