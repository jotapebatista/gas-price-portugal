<template>
  <div class="h-full bg-white dark:bg-gray-900 overflow-y-auto">
    <div class="p-4">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ $t("filters") }}
        </h3>
        <div class="flex items-center space-x-2">
          <!-- Clear All Button -->
          <button
            v-if="hasActiveFilters()"
            @click="clearAllFilters"
            class="px-3 py-1.5 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
          >
            {{ $t("clearAll") }}
          </button>
        </div>
      </div>

      <div class="space-y-6">
        <!-- Fuel Type Selector -->
        <FuelTypeSelector
          :fuel-types="fuelTypes"
          :selected-fuel-types="selectedFuelTypes"
          @update:selectedFuelTypes="(val) => emit('update:selectedFuelTypes', val)"
          @change="() => emit('fuelTypeChange')"
        />

        <!-- Location Selector -->
        <div class="space-y-4">
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ $t("location") }}
          </h4>
          							<button 
								@click="autofillLocation" 
								:disabled="geolocLoading" 
								:class="[
									'mb-2 px-3 py-2 rounded flex items-center space-x-2',
									usingUserLocation 
										? 'bg-green-500 text-white hover:bg-green-600' 
										: 'bg-blue-500 text-white hover:bg-blue-600',
									'disabled:opacity-50'
								]"
							>
								<Icon name="heroicons:map-pin" class="w-4 h-4" />
								<span v-if="geolocLoading">{{ $t('locating') }}</span>
								<span v-else-if="usingUserLocation">{{ $t('usingUserLocation') }}</span>
								<span v-else>{{ $t('useMyLocation') }}</span>
							</button>
          <p v-if="geolocError" class="text-xs text-red-500">{{ geolocError }}</p>
          
          <!-- District -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ $t("district") }}
            </label>
            <div class="relative">
              <select
                :value="selectedDistrict"
                @change="onDistrictChange"
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer text-sm"
              >
                <option value="">
                  {{ $t("selectDistrict") }}
                </option>
                <option
                  v-for="district in districts"
                  :key="district.id"
                  :value="district.id"
                >
                  {{ district.nome }}
                </option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Icon name="heroicons:chevron-down" class="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          <!-- Municipality -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ $t("municipality") }}
            </label>
            <div class="relative">
              <select
                :value="selectedMunicipality"
                @change="onMunicipalityChange"
                :disabled="!selectedDistrict"
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {{ $t("selectMunicipality") }}
                </option>
                <option
                  v-for="municipality in municipalities"
                  :key="municipality.id"
                  :value="municipality.id"
                >
                  {{ municipality.nome }}
                </option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Icon name="heroicons:chevron-down" class="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        <!-- Search Button -->
        <div class="pt-4">
          <button
            @click="searchStations"
            :disabled="loading"
            class="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center text-base"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <Icon name="heroicons:arrow-path" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
              {{ $t("searching") }}
            </span>
            <span v-else class="flex items-center justify-center">
              <Icon name="heroicons:magnifying-glass" class="w-5 h-5 mr-2" />
              {{ $t("search") }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGeolocation } from '@/composables/useGeolocation'

const geolocation = useGeolocation()
const geolocLoading = ref(false)
const geolocError = ref('')
const usingUserLocation = ref(false)

interface FuelType {
  id: number;
  nome: string;
  ativo: boolean;
}

interface District {
  id: number;
  nome: string;
}

interface Municipality {
  id: number;
  nome: string;
  idDistrito: number;
}

interface Props {
  fuelTypes: FuelType[];
  districts: District[];
  municipalities: Municipality[];
  selectedFuelTypes: number[];
  selectedDistrict: string | number;
  selectedMunicipality: string | number;
  loading: boolean;
}

interface Emits {
  (e: "update:selectedFuelTypes", value: number[]): void;
  (e: "update:selectedDistrict", value: string): void;
  (e: "update:selectedMunicipality", value: string): void;
  (e: "fuelTypeChange"): void;
  (e: "districtChange"): void;
  (e: "municipalityChange"): void;
  (e: "search"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { t: $t } = useI18n();

const hasActiveFilters = () => {
  return (
    props.selectedFuelTypes.length > 0 ||
    (props.selectedDistrict !== "" &&
      props.selectedDistrict !== null &&
      props.selectedDistrict !== undefined) ||
    (props.selectedMunicipality !== "" &&
      props.selectedMunicipality !== null &&
      props.selectedMunicipality !== undefined)
  );
};

const clearAllFilters = () => {
  emit("update:selectedFuelTypes", []);
  emit("update:selectedDistrict", "");
  emit("update:selectedMunicipality", "");
  usingUserLocation.value = false;
};

const onDistrictChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit("update:selectedDistrict", target.value);
  emit("districtChange");
  // Reset user location state when manually changing district
  usingUserLocation.value = false;
};

const onMunicipalityChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit("update:selectedMunicipality", target.value);
  emit("municipalityChange");
  // Reset user location state when manually changing municipality
  usingUserLocation.value = false;
};

const searchStations = () => {
  emit("search");
};

async function autofillLocation() {
  geolocLoading.value = true
  geolocError.value = ''
  try {
    const { lat, lng } = await geolocation.getCurrentPosition()
    const { district, municipality } = await geolocation.getLocationFromCoordinates(lat, lng)
    
    // Try to find matching district with more flexible matching
    const districtObj = props.districts.find(d => 
      d.nome.toLowerCase().includes(district.toLowerCase()) || 
      district.toLowerCase().includes(d.nome.toLowerCase())
    )
    
    if (districtObj) {
      emit('update:selectedDistrict', String(districtObj.id))
      emit('districtChange') // Trigger the district change handler
      
      // Wait for municipalities to be loaded
      let attempts = 0
      while (props.municipalities.length === 0 && attempts < 10) {
        await new Promise(resolve => setTimeout(resolve, 200))
        attempts++
      }
      
      const municipalityObj = props.municipalities.find(m => 
        m.nome.toLowerCase().includes(municipality.toLowerCase()) || 
        municipality.toLowerCase().includes(m.nome.toLowerCase())
      )
      
      if (municipalityObj) {
        emit('update:selectedMunicipality', String(municipalityObj.id))
        usingUserLocation.value = true // Set to true when location is successfully used
      } else {
        geolocError.value = $t('locationNotFound')
      }
    } else {
      geolocError.value = $t('locationNotFound')
    }
  } catch (err) {
    geolocError.value = $t('locationError')
  } finally {
    geolocLoading.value = false
  }
}
</script> 