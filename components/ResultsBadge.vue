<template>
  <div 
    v-if="count > 0"
    class="absolute top-20 left-4 z-[1000] bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 px-3 py-2"
  >
    <div class="flex items-center text-sm">
      <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      <span class="font-medium text-gray-900 dark:text-white">
        {{ $t('foundStations', { count }) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  count: number
}

defineProps<Props>()
</script> 