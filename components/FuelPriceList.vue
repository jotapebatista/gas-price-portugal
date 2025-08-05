<template>
  <div class="space-y-3">
    <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
      <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
      {{ $t('availableFuels') }}
    </h4>
    <div class="space-y-2">
      <div 
        v-for="combustivel in combustiveis" 
        :key="`${stationId}-${combustivel.tipo}`"
        class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
      >
        <div class="flex-1">
          <span class="text-sm font-medium text-gray-900 dark:text-white">
            {{ combustivel.tipo }}
          </span>
          <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {{ formatDate(combustivel.dataAtualizacao) }}
          </div>
        </div>
        <div class="text-right ml-3">
          <div class="text-lg font-bold text-green-600 dark:text-green-400">
            {{ formatPrice(combustivel.preco) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Combustivel {
  tipo: string
  preco: number
  dataAtualizacao: string
}

interface Props {
  stationId: number
  combustiveis: Combustivel[]
}

defineProps<Props>()

// Utility functions
const formatPrice = (price: number) => {
  if (!price || price === 0) return 'N/A'
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 3
  }).format(price)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script> 