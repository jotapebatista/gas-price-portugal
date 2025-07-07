<template>
  <div class="bg-white dark:bg-neutral-900 min-h-screen pb-20">
    <!-- Header -->
    <div class="sticky top-0 z-40 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 px-4 py-4">
      <div class="flex items-center justify-between">
        <h1 class="text-xl font-bold text-neutral-900 dark:text-white">Filters</h1>
        <button 
          @click="$emit('close')"
          class="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <Icon name="ph:x" class="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="px-4 py-6 space-y-6">
      <!-- Location Section -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
            <Icon name="ph:map-pin" class="w-5 h-5 text-primary-600" />
            Location
          </h2>
          <div v-if="isGeolocationEnabled" class="flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400">
            <Icon name="ph:navigation-arrow" class="w-4 h-4" />
            <span>Live Location Active</span>
          </div>
        </div>
        
        <div class="space-y-4">
          <SelectInput
            id="district"
            label="District"
            :options="districtOptions"
            placeholder="Select a district"
            :model-value="selectedDistrict"
            @update:modelValue="onDistrictChange"
          />
          
          <SelectInput
            id="municipality"
            label="Municipality"
            :options="municipalityOptions"
            placeholder="Select a municipality"
            :model-value="selectedMunicipality"
            :disabled="!selectedDistrict"
            @update:modelValue="onMunicipalityChange"
          />
        </div>
        
        <!-- Location Success Message -->
        <div v-if="isLocationSet && isGeolocationEnabled" class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-3">
          <div class="flex items-center gap-2 text-green-700 dark:text-green-300">
            <Icon name="ph:check-circle" class="w-4 h-4" />
            <span class="text-sm font-medium">Location set to {{ selectedDistrictLabel }}, {{ selectedMunicipalityLabel }}</span>
          </div>
        </div>
      </div>

      <!-- Fuel Types Section -->
      <div class="space-y-4">
        <h2 class="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
          <Icon name="ph:gas-pump" class="w-5 h-5 text-primary-600" />
          Fuel Types
        </h2>
        
        <MultiSelect
          label="Select fuel types"
          :options="fuelTypes"
          :model-value="selectedGasTypes"
          :disabled="!selectedMunicipality"
          @update:model-value="onGasTypesChange"
        />
      </div>

      <!-- Quick Actions -->
      <div class="space-y-4">
        <h2 class="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
          <Icon name="ph:lightning" class="w-5 h-5 text-primary-600" />
          Quick Actions
        </h2>
        
        <div class="grid grid-cols-2 gap-3">
          <button
            @click="useCurrentLocation"
            :disabled="isLocationLoading || isGeolocationEnabled"
            class="flex items-center justify-center gap-2 p-4 rounded-xl border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :class="isGeolocationEnabled 
              ? 'border-primary-200 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/20' 
              : 'border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800'"
          >
            <Icon v-if="isLocationLoading" name="ph:spinner" class="w-5 h-5 text-primary-600 animate-spin" />
            <Icon v-else-if="isGeolocationEnabled" name="ph:check-circle" class="w-5 h-5 text-primary-600" />
            <Icon v-else name="ph:navigation-arrow" class="w-5 h-5 text-primary-600" />
            <span class="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              {{ isLocationLoading ? 'Getting Location...' : isGeolocationEnabled ? 'Location Set' : 'Use My Location' }}
            </span>
          </button>
          
          <button
            @click="clearFilters"
            class="flex items-center justify-center gap-2 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            <Icon name="ph:arrow-clockwise" class="w-5 h-5 text-neutral-600" />
            <span class="text-sm font-medium text-neutral-700 dark:text-neutral-300">Clear All</span>
          </button>
        </div>
      </div>

      <!-- Results Summary -->
      <div v-if="stations.length > 0" class="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-primary-700 dark:text-primary-300">
              Found {{ stations.length }} stations
            </p>
            <p class="text-xs text-primary-600 dark:text-primary-400 mt-1">
              {{ selectedMunicipalityLabel }}
            </p>
          </div>
          <button
            @click="$emit('viewResults')"
            class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            View Results
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  districts: {
    type: Array,
    default: () => []
  },
  municipalities: {
    type: Array,
    default: () => []
  },
  fuels: {
    type: Array,
    default: () => []
  },
  stations: {
    type: Array,
    default: () => []
  },
  selectedDistrict: [String, Number],
  selectedMunicipality: [String, Number],
  selectedGasTypes: {
    type: Array,
    default: () => []
  },
  isLocationLoading: {
    type: Boolean,
    default: false
  },
  isGeolocationEnabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:selectedDistrict', 'update:selectedMunicipality', 'update:selectedGasTypes', 'close', 'viewResults', 'useLocation']);

// Computed properties
const districtOptions = computed(() =>
  props.districts
    .map((d) => ({ label: d.Descritivo, value: d.Id }))
    .sort((a, b) => a.label.localeCompare(b.label))
);

const municipalityOptions = computed(() =>
  props.municipalities
    .map((m) => ({ label: m.Descritivo, value: m.Id }))
    .sort((a, b) => a.label.localeCompare(b.label))
);

const fuelTypes = computed(() =>
  props.fuels
    .map((f) => ({ label: f.Descritivo, value: f.Id }))
    .sort((a, b) => a.label.localeCompare(b.label))
);

const selectedMunicipalityLabel = computed(() => {
  if (!props.selectedMunicipality) return '';
  const municipality = props.municipalities.find(m => m.Id === props.selectedMunicipality);
  return municipality ? municipality.Descritivo : '';
});

const selectedDistrictLabel = computed(() => {
  if (!props.selectedDistrict) return '';
  const district = props.districts.find(d => d.Id === props.selectedDistrict);
  return district ? district.Descritivo : '';
});

const isLocationSet = computed(() => {
  return props.selectedDistrict && props.selectedMunicipality;
});

// Methods
const onDistrictChange = (value) => {
  emit('update:selectedDistrict', value);
  emit('update:selectedMunicipality', '');
  emit('update:selectedGasTypes', []);
};

const onMunicipalityChange = (value) => {
  emit('update:selectedMunicipality', value);
  emit('update:selectedGasTypes', []);
};

const onGasTypesChange = (value) => {
  emit('update:selectedGasTypes', value);
};

const load = () => {
  // This will be handled by the parent component
};

const useCurrentLocation = () => {
  emit('useLocation');
};

const clearFilters = () => {
  emit('update:selectedDistrict', '');
  emit('update:selectedMunicipality', '');
  emit('update:selectedGasTypes', []);
};
</script> 