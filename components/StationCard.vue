<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
    <!-- Station Info -->
    <div class="mb-4">
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
          <div class="flex items-start text-sm text-gray-600 dark:text-gray-400">
            <svg class="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span class="truncate">
              {{ station.morada }}, {{ station.codigoPostal }} {{ station.localidade }}
            </span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Fuel Prices -->
    <FuelPriceList 
      :station-id="station.id"
      :combustiveis="station.combustiveis"
    />
    
    <!-- Actions -->
    <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <StationActions 
        :latitude="station.latitude"
        :longitude="station.longitude"
        :morada="station.morada"
        :codigo-postal="station.codigoPostal"
        :localidade="station.localidade"
      />
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
  station: GroupedStation
}

defineProps<Props>()
</script> 