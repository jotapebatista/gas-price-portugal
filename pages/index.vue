<template>
	<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
		<!-- Full Screen Map View -->
		<StationsMap
			:stations="groupedStations"
			:fuel-types="fuelTypes"
			:districts="districts"
			:municipalities="municipalities"
			:selected-fuel-types="selectedFuelTypes"
			:selected-district="selectedDistrict"
			:selected-municipality="selectedMunicipality"
			:loading="loading"
			@update:selected-fuel-types="selectedFuelTypes = $event"
			@update:selected-district="selectedDistrict = $event"
			@update:selected-municipality="selectedMunicipality = $event"
			@fuel-type-change="onFuelTypeChange"
			@district-change="onDistrictChange"
			@municipality-change="onMunicipalityChange"
			@search="searchStations"
		/>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, type Ref } from "vue";
const {
	districts,
	municipalities,
	fuelTypes,
	stations,
	groupedStations,
	loading,
	error,
	fetchDistricts,
	fetchMunicipalities,
	fetchFuelTypes,
	fetchStations,
} = useGasStationsAPI();

// Reactive state
const selectedFuelTypes: Ref<number[]> = ref([]); 
const selectedDistrict = ref("");
const selectedMunicipality = ref("");
const hasSearched = ref(false);

// Load initial data
onMounted(async () => {
	try {
		await Promise.all([fetchDistricts(), fetchFuelTypes()]);
	} catch (err) {
		console.error("Error loading initial data:", err);
	}
});

// Event handlers
const onFuelTypeChange = () => {
	if (hasSearched.value) {
		searchStations();
	}
};

const onDistrictChange = async () => {
	selectedMunicipality.value = "";
	municipalities.value = [];

	if (selectedDistrict.value) {
		try {
			await fetchMunicipalities(Number(selectedDistrict.value));
		} catch (err) {
			console.error("Error fetching municipalities:", err);
		}
	}

	if (hasSearched.value) {
		searchStations();
	}
};

const onMunicipalityChange = () => {
	if (hasSearched.value) {
		searchStations();
	}
};

const searchStations = async () => {
  // If no district and no municipality, fetch by fuel types only
  if (!selectedDistrict.value && !selectedMunicipality.value) {
    try {
      await fetchStations({
        idsTiposComb: selectedFuelTypes.value
      })
    } catch (err) {
      console.error('Error searching stations:', err)
    }
    return
  }
  // Otherwise, use full filter
  hasSearched.value = true
  try {
    await fetchStations({
      idsTiposComb: selectedFuelTypes.value,
      idDistrito: Number(selectedDistrict.value),
      idsMunicipios: selectedMunicipality.value ? [Number(selectedMunicipality.value)] : []
    })
  } catch (err) {
    console.error('Error searching stations:', err)
  }
}
</script>
