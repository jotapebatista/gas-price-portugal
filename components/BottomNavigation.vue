<template>
  <nav class="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-700">
    <div class="flex items-center justify-around px-4 py-2">
      <!-- Map Tab -->
      <button
        @click="activeTab = 'map'"
        class="flex flex-col items-center justify-center py-3 px-4 rounded-xl transition-all duration-200"
        :class="activeTab === 'map' 
          ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' 
          : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'"
      >
        <Icon name="ph:map-trifold" class="w-6 h-6 mb-1" />
        <span class="text-xs font-medium">Map</span>
      </button>

      <!-- Filters Tab -->
      <button
        @click="activeTab = 'filters'"
        class="flex flex-col items-center justify-center py-3 px-4 rounded-xl transition-all duration-200"
        :class="activeTab === 'filters' 
          ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' 
          : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'"
      >
        <Icon name="ph:funnel" class="w-6 h-6 mb-1" />
        <span class="text-xs font-medium">Filters</span>
      </button>

      <!-- Favorites Tab -->
      <button
        @click="activeTab = 'favorites'"
        class="flex flex-col items-center justify-center py-3 px-4 rounded-xl transition-all duration-200"
        :class="activeTab === 'favorites' 
          ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' 
          : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'"
      >
        <Icon name="ph:heart" class="w-6 h-6 mb-1" />
        <span class="text-xs font-medium">Favorites</span>
      </button>

      <!-- Settings Tab -->
      <button
        @click="activeTab = 'settings'"
        class="flex flex-col items-center justify-center py-3 px-4 rounded-xl transition-all duration-200"
        :class="activeTab === 'settings' 
          ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' 
          : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'"
      >
        <Icon name="ph:gear" class="w-6 h-6 mb-1" />
        <span class="text-xs font-medium">Settings</span>
      </button>
    </div>
  </nav>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: 'map'
  }
});

const emit = defineEmits(['update:modelValue']);

const activeTab = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});
</script> 