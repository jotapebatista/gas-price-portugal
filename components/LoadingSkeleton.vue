<template>
  <div class="animate-pulse">
    <!-- Station Card Skeleton -->
    <div v-if="type === 'station-card'" class="bg-white dark:bg-neutral-900 rounded-2xl shadow-soft border border-neutral-200 dark:border-neutral-700 overflow-hidden">
      <!-- Header -->
      <div class="p-4 border-b border-neutral-100 dark:border-neutral-800">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="h-6 bg-neutral-200 dark:bg-neutral-700 rounded mb-2"></div>
            <div class="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4"></div>
          </div>
          <div class="ml-3">
            <div class="h-6 w-16 bg-neutral-200 dark:bg-neutral-700 rounded-full"></div>
          </div>
        </div>
      </div>

      <!-- Fuel Prices -->
      <div class="p-4">
        <div class="space-y-3">
          <div v-for="i in 3" :key="i" class="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800">
            <div class="flex items-center gap-3">
              <div class="w-3 h-3 bg-neutral-200 dark:bg-neutral-700 rounded-full"></div>
              <div class="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-24"></div>
            </div>
            <div class="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-16"></div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="p-4 pt-0">
        <div class="grid grid-cols-2 gap-3">
          <div class="h-12 bg-neutral-200 dark:bg-neutral-700 rounded-xl"></div>
          <div class="h-12 bg-neutral-200 dark:bg-neutral-700 rounded-xl"></div>
        </div>
      </div>
    </div>

    <!-- Map Skeleton -->
    <div v-else-if="type === 'map'" class="w-full h-full bg-neutral-200 dark:bg-neutral-700 rounded-2xl flex items-center justify-center">
      <div class="text-center">
        <Icon name="ph:map-trifold" class="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" />
        <div class="h-4 bg-neutral-300 dark:bg-neutral-600 rounded w-32 mx-auto"></div>
      </div>
    </div>

    <!-- List Skeleton -->
    <div v-else-if="type === 'list'" class="space-y-4">
      <div v-for="i in count" :key="i" class="bg-white dark:bg-neutral-900 rounded-2xl shadow-soft border border-neutral-200 dark:border-neutral-700 p-4">
        <div class="flex items-center justify-between mb-3">
          <div class="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2"></div>
          <div class="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-16"></div>
        </div>
        <div class="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 mb-3"></div>
        <div class="space-y-2">
          <div class="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3"></div>
          <div class="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2"></div>
        </div>
      </div>
    </div>

    <!-- Default Skeleton -->
    <div v-else class="bg-neutral-200 dark:bg-neutral-700 rounded-2xl h-32 flex items-center justify-center">
      <div class="text-center">
        <Icon name="ph:circle-notch" class="w-8 h-8 text-neutral-400 dark:text-neutral-600 mx-auto mb-2 animate-spin" />
        <div class="h-3 bg-neutral-300 dark:bg-neutral-600 rounded w-24 mx-auto"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'default',
    validator: (value) => ['station-card', 'map', 'list', 'default'].includes(value)
  },
  count: {
    type: Number,
    default: 3
  }
});
</script> 