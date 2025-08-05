<template>
  <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div class="space-y-4 sm:space-y-6">
        <!-- Fuel Type Selector -->
        <FuelTypeSelector 
          :fuel-types="fuelTypes"
          :selected-fuel-types="selectedFuelTypes"
          @update:selected-fuel-types="$emit('update:selectedFuelTypes', $event)"
          @change="$emit('fuelTypeChange')"
        />

        <!-- Location Selector -->
        <LocationSelector 
          :districts="districts"
          :municipalities="municipalities"
          :selected-district="selectedDistrict"
          :selected-municipality="selectedMunicipality"
          @update:selected-district="$emit('update:selectedDistrict', $event)"
          @update:selected-municipality="$emit('update:selectedMunicipality', $event)"
          @district-change="$emit('districtChange')"
          @municipality-change="$emit('municipalityChange')"
        />

        <!-- Search Button -->
        <div class="pt-2">
          <SearchButton 
            :loading="loading"
            :disabled="selectedFuelTypes.length === 0"
            @click="$emit('search')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface FuelType {
  id: number
  nome: string
  ativo: boolean
}

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
  fuelTypes: FuelType[]
  districts: District[]
  municipalities: Municipality[]
  selectedFuelTypes: number[]
  selectedDistrict: string | number
  selectedMunicipality: string | number
  loading: boolean
}

interface Emits {
  (e: 'update:selectedFuelTypes', value: number[]): void
  (e: 'update:selectedDistrict', value: string): void
  (e: 'update:selectedMunicipality', value: string): void
  (e: 'fuelTypeChange'): void
  (e: 'districtChange'): void
  (e: 'municipalityChange'): void
  (e: 'search'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script> 