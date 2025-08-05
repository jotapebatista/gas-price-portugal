<template>
  <div class="absolute top-20 right-4 z-[1000] flex flex-col gap-2">
    <!-- Zoom Controls -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
      <button 
        @click="zoomIn"
        class="block w-full p-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-200 dark:border-gray-700"
        :title="$t('zoomIn')"
      >
        <svg class="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
      <button 
        @click="zoomOut"
        class="block w-full p-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        :title="$t('zoomOut')"
      >
        <svg class="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  map: any
}

const props = defineProps<Props>()

const zoomIn = () => {
  if (props.map && process.client) {
    props.map.zoomIn()
  }
}

const zoomOut = () => {
  if (props.map && process.client) {
    props.map.zoomOut()
  }
}
</script> 