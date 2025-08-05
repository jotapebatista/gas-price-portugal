<template>
  <div class="space-y-3 sm:space-y-4">
    <!-- District -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {{ $t('district') }}
      </label>
      <div class="relative">
        <select 
          :value="selectedDistrict" 
          @change="onDistrictChange"
          class="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer"
        >
          <option value="">{{ $t('selectDistrict') }}</option>
          <option v-for="district in districts" :key="district.id" :value="district.id">
            {{ district.nome }}
          </option>
        </select>
        <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Municipality -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {{ $t('municipality') }}
      </label>
      <div class="relative">
        <select 
          :value="selectedMunicipality" 
          @change="onMunicipalityChange"
          :disabled="!selectedDistrict"
          class="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">{{ $t('selectMunicipality') }}</option>
          <option v-for="municipality in municipalities" :key="municipality.id" :value="municipality.id">
            {{ municipality.nome }}
          </option>
        </select>
        <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface District {
  id: number
  nome: string
}

interface Municipality {
  id: number
  nome: string
  idDistrito: number
}

interface Props {
  districts: District[]
  municipalities: Municipality[]
  selectedDistrict: string | number
  selectedMunicipality: string | number
}

interface Emits {
  (e: 'update:selectedDistrict', value: string): void
  (e: 'update:selectedMunicipality', value: string): void
  (e: 'districtChange'): void
  (e: 'municipalityChange'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const onDistrictChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:selectedDistrict', target.value)
  emit('districtChange')
}

const onMunicipalityChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:selectedMunicipality', target.value)
  emit('municipalityChange')
}
</script> 