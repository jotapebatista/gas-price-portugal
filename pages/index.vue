<template>
	<div class="h-screen flex flex-col overflow-hidden bg-neutral-50 dark:bg-neutral-900">
		<!-- Data Preloader -->
		<DataPreloader 
			:show-preloader="showDataPreloader"
			@complete="handleDataPreloaderComplete"
			@skip="handleDataPreloaderSkip"
		/>
		
		<!-- First Launch Modal -->
		<FirstLaunchModal 
			:show="showFirstLaunchModal"
			@complete="handleFirstLaunchComplete"
		/>
		
		<!-- Offline Indicator -->
		<OfflineIndicator />
		
		<!-- Main App Content -->
		<div v-if="isAppReady" class="h-full flex flex-col">
		<!-- Header -->
		<header class="flex-shrink-0 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 px-4 py-3">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-3">
					<Icon name="ph:gas-pump" class="w-8 h-8 text-primary-600" />
					<div>
						<h1 class="text-lg font-bold text-neutral-900 dark:text-white">GasApp</h1>
						<p class="text-xs text-neutral-600 dark:text-neutral-400">Find the best prices</p>
					</div>
				</div>
				
				<div class="flex items-center gap-2">
					<button
						@click="refreshData"
						class="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
						:class="{ 'animate-spin': loading }"
					>
						<Icon name="ph:arrow-clockwise" class="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
					</button>
					
					<button
						@click="toggleTheme"
						class="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
					>
						<Icon 
							:name="colorMode?.value === 'dark' ? 'ph:sun' : 'ph:moon'" 
							class="w-5 h-5 text-neutral-600 dark:text-neutral-400" 
						/>
					</button>
				</div>
			</div>
		</header>

		<!-- Main Content -->
		<main class="flex-1 overflow-hidden">
			<!-- Map View -->
			<div v-if="activeTab === 'map'" class="h-full relative">
				<StationMap 
					:stations="stations" 
					:user-location="userCoords" 
					:favorite-station-ids="favoriteStations.map(s => s.Id)"
					class="h-full"
				/>
				
				<!-- Floating Action Button -->
				<button
					@click="activeTab = 'filters'"
					class="absolute bottom-20 right-4 z-40 w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-large flex items-center justify-center transition-all duration-200"
				>
					<Icon name="ph:funnel" class="w-6 h-6" />
				</button>
			</div>

			<!-- Filters View -->
			<div v-else-if="activeTab === 'filters'" class="h-full overflow-y-auto">
				<FiltersPanel
					:districts="districts"
					:municipalities="municipalities"
					:fuels="fuels"
					:stations="stations"
					:selected-district="selectedDistrict"
					:selected-municipality="selectedMunicipality"
					:selected-gas-types="selectedGasTypes"
					:is-location-loading="isLocationLoading"
					:is-geolocation-enabled="isGeolocationEnabled"
					@update:selected-district="selectedDistrict = $event"
					@update:selected-municipality="selectedMunicipality = $event"
					@update:selected-gas-types="selectedGasTypes = $event"
					@close="activeTab = 'map'"
					@view-results="activeTab = 'list'"
					@use-location="enableGeolocation"
				/>
			</div>

			<!-- List View -->
			<div v-else-if="activeTab === 'list'" class="h-full overflow-y-auto pb-20">
				<div class="p-4">
					<!-- Header -->
					<div class="flex items-center justify-between mb-4">
						<div>
							<h2 class="text-xl font-bold text-neutral-900 dark:text-white">
								Gas Stations
							</h2>
							<p class="text-sm text-neutral-600 dark:text-neutral-400">
								{{ stations.length }} stations found
							</p>
						</div>
						<button
							@click="activeTab = 'map'"
							class="flex items-center gap-2 px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
						>
							<Icon name="ph:map-trifold" class="w-4 h-4" />
							<span>Map</span>
						</button>
					</div>

					<!-- Loading State -->
					<div v-if="loading" class="space-y-4">
						<LoadingSkeleton type="station-card" v-for="i in 3" :key="i" />
					</div>

					<!-- Empty State -->
					<div v-else-if="!stations.length && attemptedLoad" class="text-center py-12">
						<Icon name="ph:gas-pump" class="w-16 h-16 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" />
						<h3 class="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
							No stations found
						</h3>
						<p class="text-neutral-600 dark:text-neutral-400 mb-6">
							Try adjusting your filters or location
						</p>
						<button
							@click="activeTab = 'filters'"
							class="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
						>
							Adjust Filters
						</button>
					</div>

					<!-- Stations List -->
					<div v-else-if="stations.length" class="space-y-4">
						<StationCard
							v-for="station in stations"
							:key="station.Id"
							:station="station"
							:is-favorite="isFavorite(station.Id)"
							@navigate="handleNavigate"
							@toggle-favorite="toggleFavorite"
						/>
					</div>

					<!-- Initial State -->
					<div v-else class="text-center py-12">
						<Icon name="ph:map-pin" class="w-16 h-16 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" />
						<h3 class="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
							Welcome to GasApp
						</h3>
						<p class="text-neutral-600 dark:text-neutral-400 mb-6">
							Select your location and fuel types to find the best prices
						</p>
						<button
							@click="activeTab = 'filters'"
							class="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
						>
							Get Started
						</button>
					</div>
				</div>
			</div>

			<!-- Favorites View -->
			<div v-else-if="activeTab === 'favorites'" class="h-full overflow-y-auto pb-20">
				<div class="p-4">
					<h2 class="text-xl font-bold text-neutral-900 dark:text-white mb-4">
						Favorite Stations
					</h2>
					
					<div v-if="favoriteStations.length" class="space-y-4">
						<StationCard
							v-for="station in favoriteStations"
							:key="station.Id"
							:station="station"
							:is-favorite="true"
							@navigate="handleNavigate"
							@toggle-favorite="toggleFavorite"
						/>
					</div>
					
					<div v-else class="text-center py-12">
						<Icon name="ph:heart" class="w-16 h-16 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" />
						<h3 class="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
							No favorites yet
						</h3>
						<p class="text-neutral-600 dark:text-neutral-400">
							Save your favorite stations to access them quickly
						</p>
					</div>
				</div>
			</div>

			<!-- Settings View -->
			<div v-else-if="activeTab === 'settings'" class="h-full overflow-y-auto pb-20">
				<div class="p-4">
					<h2 class="text-xl font-bold text-neutral-900 dark:text-white mb-6">
						Settings
					</h2>
					
					<div class="space-y-6">
						<!-- App Mode -->
						<div class="bg-white dark:bg-neutral-900 rounded-2xl p-4 border border-neutral-200 dark:border-neutral-700">
							<div class="flex items-center justify-between mb-4">
								<div>
									<h3 class="font-semibold text-neutral-900 dark:text-white">App Mode</h3>
									<p class="text-sm text-neutral-600 dark:text-neutral-400">
										{{ getAppMode === 'offline' ? 'Offline mode - Data cached locally' : 'Live mode - Always fetch latest data' }}
									</p>
								</div>
								<Icon 
									:name="getAppMode === 'offline' ? 'ph:device-mobile' : 'ph:wifi-high'" 
									class="w-5 h-5 text-primary-600" 
								/>
							</div>
							<div class="flex gap-2">
								<button
									@click="setAppMode('offline')"
									class="flex-1 py-2 px-4 text-sm rounded-lg transition-colors"
									:class="getAppMode === 'offline' 
										? 'bg-primary-600 text-white' 
										: 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600'"
								>
									Offline
								</button>
								<button
									@click="setAppMode('live')"
									class="flex-1 py-2 px-4 text-sm rounded-lg transition-colors"
									:class="getAppMode === 'live' 
										? 'bg-primary-600 text-white' 
										: 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600'"
								>
									Live
								</button>
							</div>
						</div>

						<!-- Theme Toggle -->
						<div class="bg-white dark:bg-neutral-900 rounded-2xl p-4 border border-neutral-200 dark:border-neutral-700">
							<div class="flex items-center justify-between">
								<div>
									<h3 class="font-semibold text-neutral-900 dark:text-white">Theme</h3>
									<p class="text-sm text-neutral-600 dark:text-neutral-400">
										Choose your preferred appearance
									</p>
								</div>
								<Switch :model-value="colorMode?.value === 'dark'" @update:model-value="toggleTheme" />
							</div>
						</div>

						<!-- Location Settings -->
						<div class="bg-white dark:bg-neutral-900 rounded-2xl p-4 border border-neutral-200 dark:border-neutral-700">
							<div class="flex items-center justify-between mb-4">
								<div>
									<h3 class="font-semibold text-neutral-900 dark:text-white">Location</h3>
									<p class="text-sm text-neutral-600 dark:text-neutral-400">
										{{ getGeolocationEnabled ? 'Location access enabled' : 'Location access disabled' }}
									</p>
								</div>
								<Icon 
									:name="getGeolocationEnabled ? 'ph:map-pin-fill' : 'ph:map-pin'" 
									class="w-5 h-5 text-primary-600" 
								/>
							</div>
							<button
								@click="requestLocationPermission"
								class="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-medium transition-colors"
							>
								{{ getGeolocationEnabled ? 'Manage Location Access' : 'Enable Location Access' }}
							</button>
						</div>

						<!-- Data Status -->
						<div class="bg-white dark:bg-neutral-900 rounded-2xl p-4 border border-neutral-200 dark:border-neutral-700">
							<div class="flex items-center justify-between mb-4">
								<div>
									<h3 class="font-semibold text-neutral-900 dark:text-white">Offline Data</h3>
									<p class="text-sm text-neutral-600 dark:text-neutral-400">
										{{ isDataPreloaded ? 'Data available offline' : 'No offline data available' }}
									</p>
								</div>
								<Icon 
									:name="isDataPreloaded ? 'ph:check-circle' : 'ph:x-circle'" 
									:class="isDataPreloaded ? 'w-5 h-5 text-green-600' : 'w-5 h-5 text-red-600'" 
								/>
							</div>
							<button
								v-if="!isDataPreloaded"
								@click="showDataPreloader = true"
								class="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-medium transition-colors"
							>
								Download Offline Data
							</button>
							<button
								v-else
								@click="clearOfflineData"
								class="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-medium transition-colors"
							>
								Clear Offline Data
							</button>
						</div>

						<!-- About -->
						<div class="bg-white dark:bg-neutral-900 rounded-2xl p-4 border border-neutral-200 dark:border-neutral-700">
							<NuxtLink to="/about" class="flex items-center justify-between">
								<div>
									<h3 class="font-semibold text-neutral-900 dark:text-white">About GasApp</h3>
									<p class="text-sm text-neutral-600 dark:text-neutral-400">
										Learn more about this app
									</p>
								</div>
								<Icon name="ph:arrow-right" class="w-5 h-5 text-neutral-400" />
							</NuxtLink>
						</div>
					</div>
				</div>
			</div>
		</main>

		<!-- Bottom Navigation -->
		<BottomNavigation v-model="activeTab" />

		<!-- Geolocation Permission Modal -->
		<div v-if="showGeolocationModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
			<div class="bg-white dark:bg-neutral-900 rounded-2xl p-6 max-w-sm w-full">
				<div class="text-center">
					<Icon name="ph:map-pin" class="w-12 h-12 text-primary-600 mx-auto mb-4" />
					<h3 class="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
						Enable Location Access
					</h3>
					<p class="text-neutral-600 dark:text-neutral-400 mb-6">
						Allow GasApp to access your location to show nearby gas stations and provide better recommendations.
					</p>
					
					<div class="flex gap-3">
						<button
							@click="showGeolocationModal = false"
							class="flex-1 py-3 px-4 border border-neutral-300 dark:border-neutral-600 rounded-xl text-neutral-700 dark:text-neutral-300 font-medium transition-colors"
						>
							Not Now
						</button>
						<button
							@click="enableGeolocation"
							class="flex-1 py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors"
						>
							Enable
						</button>
					</div>
				</div>
			</div>
		</div>
		</div>
	</div>
</template>

<script setup>
const { fetchDistricts, fetchMunicipalities, fetchStations, fetchFuelTypes, isOnline, isInitialized } = useEnhancedGasStationsAPI();
const { colorMode } = useColorMode();
const { getDistanceFromLatLonInKm } = useDistance();
const { getLocationFromCoordinates } = useGeolocation();
const { 
	setAppMode, 
	setGeolocationEnabled, 
	getAppMode, 
	getGeolocationEnabled, 
	hasCompletedFirstLaunch, 
	isDataPreloaded,
	markDataPreloaded
} = useUserPreferences();

// State
const activeTab = ref('map');
const districts = ref([]);
const municipalities = ref([]);
const fuels = ref([]);
const stations = ref([]);
const loading = ref(false);
const attemptedLoad = ref(false);
const isGeolocationEnabled = ref(false);
const userCoords = ref({ latitude: null, longitude: null });
const watchId = ref(null);
const showGeolocationModal = ref(false);
const favoriteStations = ref([]);
const isLocationLoading = ref(false);
const isGeolocationSetting = ref(false);
const showDataPreloader = ref(true);
const isAppReady = ref(false);
const showFirstLaunchModal = ref(false);

// Selection
const selectedDistrict = ref("");
const selectedMunicipality = ref("");
const selectedGasTypes = ref([]);



// Computed properties
const districtOptions = computed(() =>
	districts.value
		.map((d) => ({ label: d.Descritivo, value: d.Id }))
		.sort((a, b) => a.label.localeCompare(b.label))
);

const fuelTypes = computed(() =>
	fuels.value
		.map((f) => ({ label: f.Descritivo, value: f.Id }))
		.sort((a, b) => a.label.localeCompare(b.label))
);

const municipalityOptions = computed(() =>
	municipalities.value
		.map((m) => ({ label: m.Descritivo, value: m.Id }))
		.sort((a, b) => a.label.localeCompare(b.label))
);

// Methods
const toggleTheme = (isDark) => {
	if (colorMode?.value !== undefined) {
		colorMode.value = isDark ? 'dark' : 'light';
	}
};

const refreshData = async () => {
	if (selectedDistrict.value && selectedMunicipality.value && selectedGasTypes.value.length) {
		await load();
	}
};

// Handle first launch completion
const handleFirstLaunchComplete = (preferences) => {
	showFirstLaunchModal.value = false;
	
	// Handle geolocation if enabled
	if (preferences.geolocationEnabled) {
		enableGeolocation();
	}
	
	// Handle app mode
	if (preferences.appMode === 'offline' && !isDataPreloaded.value) {
		showDataPreloader.value = true;
	} else {
		showDataPreloader.value = false;
		isAppReady.value = true;
		loadInitialData();
	}
};

// Clear offline data
const clearOfflineData = async () => {
	const { clearAllData } = useOfflineData();
	await clearAllData();
	// Refresh the page to reset state
	window.location.reload();
};

// Load initial data
const loadInitialData = async () => {
	loading.value = true;
	
	try {
		const districtsResponse = await fetchDistricts();
		districts.value = districtsResponse.resultado || [];
		
		const fuelsResponse = await fetchFuelTypes();
		fuels.value = fuelsResponse;
	} catch (error) {
		// Silently handle initialization errors
	} finally {
		loading.value = false;
	}
};

const startLiveGeolocation = async () => {
	if (!navigator.geolocation) {
		console.warn("Geolocation not supported by your browser.");
		return;
	}
	
	watchId.value = navigator.geolocation.watchPosition(
		(position) => {
			const { latitude, longitude } = position.coords;
			userCoords.value = { latitude, longitude };
		},
		(error) => {
			if (error.code === error.TIMEOUT) {
				stopLiveGeolocation();
				setTimeout(() => {
					startLiveGeolocation();
				}, 3000);
			} else {
				console.error("Error watching geolocation:", error);
			}
		},
		{
			enableHighAccuracy: true,
			maximumAge: 5000,
			timeout: 3000,
		}
	);
};

const stopLiveGeolocation = () => {
	if (watchId.value !== null) {
		navigator.geolocation.clearWatch(watchId.value);
		watchId.value = null;
	}
};

const handleGeolocation = async (data) => {
	isGeolocationEnabled.value = true;
	startLiveGeolocation();
	
	// If we have district and municipality data, use it
	if (data && data.district && data.municipality && districts.value && districts.value.length > 0) {
		const selectedGeoDistrict = districts.value.find(
			(d) => d.Descritivo === data.district
		);

		if (selectedGeoDistrict) {
			municipalities.value =
				(await fetchMunicipalities(selectedGeoDistrict.Id)).resultado || [];

			const selectedGeoMunicipality = municipalities.value.find(
				(m) => m.Descritivo === data.municipality
			);

			if (selectedGeoMunicipality) {
				selectedDistrict.value = selectedGeoDistrict.Id.toString();
				selectedMunicipality.value = selectedGeoMunicipality.Id.toString();
			}
		}
	}
	// Otherwise, just enable geolocation for distance calculations
};

const requestLocationPermission = () => {
	showGeolocationModal.value = true;
};

const enableGeolocation = async () => {
	showGeolocationModal.value = false;
	isLocationLoading.value = true;
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(
			async (position) => {
				const { latitude, longitude } = position.coords;
				userCoords.value = { latitude, longitude };
				isGeolocationEnabled.value = true;
				startLiveGeolocation();
				
				// Use reverse geocoding to auto-fill location
				try {
					const locationData = await getLocationFromCoordinates(latitude, longitude);
					
					// Auto-fill district and municipality if we have the data
					if (locationData && locationData.district && locationData.municipality && districts.value && districts.value.length > 0) {
						// Try to find matching district
						const selectedGeoDistrict = districts.value.find(
							(d) => {
								const districtName = d.Descritivo.toLowerCase();
								const geoDistrict = locationData.district.toLowerCase();
								
								// Exact match
								if (districtName === geoDistrict) return true;
								
								// Contains match
								if (districtName.includes(geoDistrict) || geoDistrict.includes(districtName)) return true;
								
								// Handle common variations
								const variations = {
									'lisboa': 'lisboa',
									'porto': 'porto',
									'braga': 'braga',
									'coimbra': 'coimbra',
									'aveiro': 'aveiro',
									'faro': 'faro',
									'setubal': 'setúbal',
									'leiria': 'leiria',
									'santarem': 'santarém',
									'viana do castelo': 'viana do castelo',
									'vila real': 'vila real',
									'braganca': 'bragança',
									'guarda': 'guarda',
									'castelo branco': 'castelo branco',
									'portalegre': 'portalegre',
									'evora': 'évora',
									'beja': 'beja'
								};
								
								return variations[geoDistrict] === districtName || variations[districtName] === geoDistrict;
							}
						);

						if (selectedGeoDistrict) {
							// Fetch municipalities for this district
							const districtId = typeof selectedGeoDistrict.Id === 'string' ? parseInt(selectedGeoDistrict.Id) : selectedGeoDistrict.Id;
							municipalities.value = (await fetchMunicipalities(districtId)).resultado || [];

							// Try to find matching municipality
							const selectedGeoMunicipality = municipalities.value.find(
								(m) => {
									const municipalityName = m.Descritivo.toLowerCase();
									const geoMunicipality = locationData.municipality.toLowerCase();
									
									// Exact match
									if (municipalityName === geoMunicipality) return true;
									
									// Contains match
									if (municipalityName.includes(geoMunicipality) || geoMunicipality.includes(municipalityName)) return true;
									
									return false;
								}
							);

							if (selectedGeoMunicipality) {
								// Set flag to prevent watcher conflicts
								isGeolocationSetting.value = true;
								
								// Set values as integers (not strings)
								selectedDistrict.value = selectedGeoDistrict.Id;
								selectedMunicipality.value = selectedGeoMunicipality.Id;
								
								// Clear flag after a longer delay to ensure all watchers have processed
								setTimeout(() => {
									isGeolocationSetting.value = false;
								}, 500);
							} else {
								// Still set the district even if municipality doesn't match
								selectedDistrict.value = selectedGeoDistrict.Id;
							}
						}
					}
				} catch (error) {
					// Silently handle geolocation errors
				}
			},
			(error) => {
				// Silently handle geolocation errors
			}
		);
	}
	isLocationLoading.value = false;
};

const onDistrictChange = async () => {
	// Don't clear municipality if we're setting location via geolocation
	if (!isGeolocationSetting.value) {
		selectedMunicipality.value = "";
		selectedGasTypes.value = [];
		stations.value = [];
	}

	if (!selectedDistrict.value) return;

	loading.value = true;
	// Convert to number for API call
	const districtId = typeof selectedDistrict.value === 'string' ? parseInt(selectedDistrict.value) : selectedDistrict.value;
	municipalities.value =
		(await fetchMunicipalities(districtId)).resultado || [];
	loading.value = false;
};

const onMunicipalityChange = () => {
	// Don't clear gas types if we're setting location via geolocation
	if (!isGeolocationSetting.value) {
		selectedGasTypes.value = [];
		stations.value = [];
	}
};

const load = async () => {
	if (
		!selectedDistrict.value ||
		!selectedMunicipality.value ||
		!selectedGasTypes.value.length
	) {
		return;
	}

	loading.value = true;
	attemptedLoad.value = true;
	stations.value = [];

	const fuelTypeIds = selectedGasTypes.value.map((type) => type.value);

	try {
		// Convert to numbers for API call
		const districtId = typeof selectedDistrict.value === 'string' ? parseInt(selectedDistrict.value) : selectedDistrict.value;
		const municipalityId = typeof selectedMunicipality.value === 'string' ? parseInt(selectedMunicipality.value) : selectedMunicipality.value;

		const data = await fetchStations({
			idDistrito: districtId,
			idsMunicipios: [municipalityId],
			idsTiposComb: fuelTypeIds.join(","),
		});

		if (!data || !data.resultado || !Array.isArray(data.resultado)) {
			stations.value = [];
			return;
		}

		const groupedStations = {};
		data.resultado.forEach((station) => {
			if (!groupedStations[station.Id]) {
				groupedStations[station.Id] = {
					...station,
					prices: [],
				};
			}
			groupedStations[station.Id].prices.push({
				fuelType: station.Combustivel,
				price: station.Preco,
			});
		});

		let stationsArray = Object.values(groupedStations);

		if (
			isGeolocationEnabled.value &&
			userCoords.value.latitude &&
			userCoords.value.longitude
		) {
			stationsArray.forEach((station) => {
				station.distance = getDistanceFromLatLonInKm(
					userCoords.value.latitude,
					userCoords.value.longitude,
					station.Latitude,
					station.Longitude
				);
			});

			stationsArray.sort((a, b) => a.distance - b.distance);
		}

		stations.value = stationsArray;
	} catch (error) {
		stations.value = [];
	} finally {
		loading.value = false;
	}
};

const handleNavigate = (station) => {
	// Handle navigation action
};

const isFavorite = (stationId) => {
	return favoriteStations.value.some(station => station.Id === stationId);
};

const toggleFavorite = (station) => {
	const index = favoriteStations.value.findIndex(s => s.Id === station.Id);
	
	if (index > -1) {
		favoriteStations.value.splice(index, 1);
	} else {
		favoriteStations.value.push(station);
	}
	
	// Save to localStorage
	localStorage.setItem('gasapp-favorites', JSON.stringify(favoriteStations.value));
};

// Watch for changes
watch(selectedDistrict, (newVal, oldVal) => {
	if (!isGeolocationSetting.value) {
		onDistrictChange();
	}
});
watch(selectedMunicipality, (newVal, oldVal) => {
	if (!isGeolocationSetting.value) {
		onMunicipalityChange();
	}
});
watch(selectedGasTypes, (newVal, oldVal) => {
	load();
}, { deep: true });

// Handle data preloader completion
const handleDataPreloaderComplete = () => {
	showDataPreloader.value = false;
	isAppReady.value = true;
	markDataPreloaded();
	loadInitialData();
};

const handleDataPreloaderSkip = () => {
	showDataPreloader.value = false;
	isAppReady.value = true;
	loadInitialData();
};

// On mount, check if we need to show preloader or first launch modal
onMounted(async () => {
	// Load favorites from localStorage
	const savedFavorites = localStorage.getItem('gasapp-favorites');
	if (savedFavorites) {
		favoriteStations.value = JSON.parse(savedFavorites);
	}
	
	// Check if this is the first launch
	if (!hasCompletedFirstLaunch.value) {
		showFirstLaunchModal.value = true;
	} else if (isInitialized.value) {
		// If data is already initialized, skip preloader
		showDataPreloader.value = false;
		isAppReady.value = true;
		loadInitialData();
	}
});

// Cleanup
onBeforeUnmount(() => {
	stopLiveGeolocation();
});
</script>
