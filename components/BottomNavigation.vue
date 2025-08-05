<template>
  <div class="fixed bottom-0 left-0 right-0 z-[1000] bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg">
    <div class="flex items-center justify-between px-1 py-2">
      <!-- Map Tab -->
      <button
        @click="activeTab = 'map'"
        class="flex flex-col items-center justify-center px-2 py-2 rounded-lg transition-all duration-200"
        :class="activeTab === 'map' 
          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'"
      >
        <Icon name="heroicons:map" class="w-5 h-5 mb-1" />
        <span class="text-xs font-medium">{{ $t('map') }}</span>
      </button>

      <!-- Filters Tab -->
      <button
        @click="activeTab = 'filters'"
        class="flex flex-col items-center justify-center px-2 py-2 rounded-lg transition-all duration-200 relative"
        :class="activeTab === 'filters' 
          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'"
      >
        <Icon name="heroicons:funnel" class="w-5 h-5 mb-1" />
        <span class="text-xs font-medium">{{ $t('filters') }}</span>
        <!-- Active filters indicator -->
        <div v-if="hasActiveFilters" class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
      </button>

      <!-- Results Tab -->
      <button
        @click="activeTab = 'results'"
        class="flex flex-col items-center justify-center px-2 py-2 rounded-lg transition-all duration-200 relative"
        :class="activeTab === 'results' 
          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'"
      >
        <Icon name="heroicons:document-text" class="w-5 h-5 mb-1" />
        <span class="text-xs font-medium">{{ $t('results') }}</span>
        <!-- Results count badge -->
        <div v-if="resultsCount > 0" class="absolute -top-1 -right-1 min-w-[20px] h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center px-1">
          {{ resultsCount > 99 ? '99+' : resultsCount }}
        </div>
      </button>

      <!-- Favorites Tab -->
      <button
        @click="activeTab = 'favorites'"
        class="flex flex-col items-center justify-center px-2 py-2 rounded-lg transition-all duration-200 relative"
        :class="activeTab === 'favorites' 
          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'"
      >
        <Icon name="heroicons:heart" class="w-5 h-5 mb-1" />
        <span class="text-xs font-medium">{{ $t('favorites') }}</span>
        <div v-if="favoriteCount > 0" class="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center px-1">
          {{ favoriteCount > 99 ? '99+' : favoriteCount }}
        </div>
      </button>

      <!-- Settings Tab -->
      <button
        @click="activeTab = 'settings'"
        class="flex flex-col items-center justify-center px-2 py-2 rounded-lg transition-all duration-200"
        :class="activeTab === 'settings' 
          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'"
      >
        <Icon name="heroicons:cog-6-tooth" class="w-5 h-5 mb-1" />
        <span class="text-xs font-medium">{{ $t('settings') }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  activeTab: string;
  hasActiveFilters: boolean;
  resultsCount: number;
  favoriteCount: number;
}

interface Emits {
  (e: 'update:activeTab', value: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { t: $t } = useI18n();

// Computed property to handle the activeTab prop
const activeTab = computed({
  get: () => props.activeTab,
  set: (value: string) => emit('update:activeTab', value)
});
</script> 