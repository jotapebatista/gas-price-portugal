<template>
	<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
		<!-- Main Content Area -->
		<div class="flex flex-col h-screen">
			<!-- Content Area -->
			<div class="flex-1 relative">
				<!-- Map View (always visible) -->
				<div class="absolute inset-0">
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

				<!-- Overlay Panels -->
				<div 
					v-if="activeTab !== 'map'"
					class="absolute inset-0 bg-black/50 z-[999]"
					@click="activeTab = 'map'"
				></div>

				<!-- Filters Panel -->
				<div
					v-if="activeTab === 'filters'"
					class="absolute inset-0 z-[1000] flex flex-col"
				>
					<div class="flex-1 overflow-hidden">
						<FiltersPanel
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
				</div>

				<!-- Results Panel -->
				<div
					v-if="activeTab === 'results'"
					class="absolute inset-0 z-[1000] flex flex-col"
				>
					<div class="flex-1 overflow-hidden">
						<ResultsPanel
							:stations="groupedStations"
							:loading="loading"
							:show-success-message="showSuccessMessage"
							@show-on-map="showStationOnMap"
							@go-to-filters="goToFilters"
							@go-to-map="goToMap"
						/>
					</div>
				</div>

				<!-- Favorites Panel -->
				<div
					v-if="activeTab === 'favorites'"
					class="absolute inset-0 z-[1000] flex flex-col"
				>
					<div class="flex-1 overflow-hidden">
						<FavoritesPanel
							:all-stations="groupedStations"
							@show-on-map="showStationOnMap"
						/>
					</div>
				</div>

				<!-- Settings Panel -->
				<div
					v-if="activeTab === 'settings'"
					class="absolute inset-0 z-[1000] flex flex-col"
				>
					<div class="flex-1 overflow-hidden">
						<SettingsPanel />
					</div>
				</div>
			</div>

			<!-- Bottom Navigation -->
			<BottomNavigation
				:active-tab="activeTab"
				:has-active-filters="hasActiveFilters"
				:results-count="groupedStations.length"
				:favorite-count="favoriteCount"
				@update:active-tab="activeTab = $event"
			/>
		</div>


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

const { favoriteCount } = useFavorites();

// Reactive state
const selectedFuelTypes: Ref<number[]> = ref([]); 
const selectedDistrict = ref("");
const selectedMunicipality = ref("");
const hasSearched = ref(false);
const activeTab = ref("map");
const showSuccessMessage = ref(false);

// Load initial data
onMounted(async () => {
	try {
		await Promise.all([fetchDistricts(), fetchFuelTypes()]);
	    } catch (err) {
      // Error loading initial data
    }
});

// Computed properties
const hasActiveFilters = computed(() => {
	return (
		selectedFuelTypes.value.length > 0 ||
		selectedDistrict.value !== "" ||
		selectedMunicipality.value !== ""
	);
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
      // Error fetching municipalities
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
  hasSearched.value = true
  showSuccessMessage.value = false
  
  try {
    // If no district and no municipality, fetch by fuel types only
    if (!selectedDistrict.value && !selectedMunicipality.value) {
      await fetchStations({
        idsTiposComb: selectedFuelTypes.value
      })
    } else {
      // Otherwise, use full filter
      await fetchStations({
        idsTiposComb: selectedFuelTypes.value,
        idDistrito: Number(selectedDistrict.value),
        idsMunicipios: selectedMunicipality.value ? [Number(selectedMunicipality.value)] : []
      })
    }
    
    // Auto-navigate to Results tab after successful search
    activeTab.value = "results"
    
    // Show success message briefly
    showSuccessMessage.value = true
    setTimeout(() => {
      showSuccessMessage.value = false
    }, 3000)
    
  } catch (err) {
    // Error searching stations
    // Stay in filters tab if there's an error
    activeTab.value = "filters"
  }
}

const showStationOnMap = (station: any) => {
	// Switch to map tab and center on the selected station
	activeTab.value = "map";
	// You can add logic here to center the map on the selected station
	// This would require passing the station data to the map component
};

const goToFilters = () => {
	activeTab.value = "filters";
};

const goToMap = () => {
	activeTab.value = "map";
};
</script>
