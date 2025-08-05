<template>
  <div 
    v-if="station"
    class="absolute bottom-16 left-4 right-4 z-[1000] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4"
  >
    <div class="flex items-start justify-between mb-3">
      <div class="flex-1 min-w-0">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1 truncate">
          {{ station.nome }}
        </h3>
        <div class="flex items-center mb-2">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {{ station.marca }}
          </span>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-400 truncate">
          {{ station.morada }}, {{ station.codigoPostal }} {{ station.localidade }}
        </p>
      </div>
      <button 
        @click="$emit('close')"
        class="ml-3 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    
    <!-- Fuel Prices -->
    <div class="space-y-2 mb-3">
      <div 
        v-for="combustivel in station.combustiveis" 
        :key="combustivel.tipo"
        class="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded"
      >
        <span class="text-sm text-gray-700 dark:text-gray-300">
          {{ combustivel.tipo }}
        </span>
        <span class="text-sm font-bold text-green-600 dark:text-green-400">
          {{ formatPrice(combustivel.preco) }}
        </span>
      </div>
    </div>
    
    <!-- Actions -->
    <div class="flex gap-2">
      <button 
        @click="openDirections"
        class="flex-1 px-3 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
        </svg>
        {{ $t('directions') }}
      </button>
      <button 
        @click="copyAddress"
        class="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        {{ $t('copy') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Combustivel {
  tipo: string
  preco: number
  dataAtualizacao: string
}

interface GroupedStation {
  id: number
  nome: string
  morada: string
  codigoPostal: string
  localidade: string
  latitude: number
  longitude: number
  marca: string
  municipio: string
  distrito: string
  combustiveis: Combustivel[]
}

interface Props {
  station: GroupedStation | null
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const openDirections = () => {
  if (!props.station) return
  const url = `https://www.google.com/maps/dir/?api=1&destination=${props.station.latitude},${props.station.longitude}`
  window.open(url, '_blank')
}

const copyAddress = async () => {
  if (!props.station) return
  const address = `${props.station.morada}, ${props.station.codigoPostal} ${props.station.localidade}`
  try {
    await navigator.clipboard.writeText(address)
  } catch (err) {
    console.error('Error copying address:', err)
  }
}

const formatPrice = (price: number) => {
  if (!price || price === 0) return 'N/A'
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 3
  }).format(price)
}
</script> 