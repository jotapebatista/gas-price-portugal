<template>
  <div class="flex gap-2 sm:gap-3">
    <button 
      @click="openDirections"
      class="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 flex items-center justify-center"
    >
      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
      </svg>
      {{ $t('directions') }}
    </button>
    <button 
      @click="copyAddress"
      class="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 flex items-center justify-center"
    >
      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
      {{ $t('copy') }}
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  latitude: number
  longitude: number
  morada: string
  codigoPostal: string
  localidade: string
}

const props = defineProps<Props>()

const openDirections = () => {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${props.latitude},${props.longitude}`
  window.open(url, '_blank')
}

const copyAddress = async () => {
  const address = `${props.morada}, ${props.codigoPostal} ${props.localidade}`
  try {
    await navigator.clipboard.writeText(address)
    // You could add a toast notification here
  } catch (err) {
    console.error('Error copying address:', err)
  }
}
</script> 