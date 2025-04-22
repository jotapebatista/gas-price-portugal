<template>
	<div class="relative h-screen w-screen overflow-hidden">
		<!-- Fullscreen Map -->
		<StationMap :stations="stations" :user-location="userCoords" />
		<!-- Geolocation Slide-Down -->
		<transition
			name="slide-down"
			enter-active-class="transition transform duration-300 ease-out"
			leave-active-class="transition transform duration-200 ease-in"
			enter-from-class="-translate-y-full opacity-0"
			enter-to-class="translate-y-0 opacity-100"
			leave-from-class="translate-y-0 opacity-100"
			leave-to-class="-translate-y-full opacity-0"
		>
			<div
				v-if="!isGeolocationEnabled"
				class="absolute top-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 p-4 rounded-b-2xl"
			>
				<GeoLocation
					@useGeolocation="handleGeolocation"
					@skipGeolocation="handleSkipGeolocation"
				/>
			</div>
		</transition>

		<!-- Toggle Button -->
		<button
			class="absolute z-30 bottom-4 left-4 bg-white dark:bg-gray-900 text-sm px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
			@click="filtersVisible = !filtersVisible"
		>
			<span>{{ filtersVisible ? "← Close" : "☰ Filters" }}</span>
		</button>

		<!-- Sidebar Transition -->
		<transition
			name="slide-left"
			enter-active-class="transition duration-300 ease-out"
			leave-active-class="transition duration-300 ease-in"
			enter-from-class="-translate-x-full opacity-0"
			enter-to-class="translate-x-0 opacity-100"
			leave-from-class="translate-x-0 opacity-100"
			leave-to-class="-translate-x-full opacity-0"
		>
			<div
				v-if="filtersVisible"
				class="absolute top-0 left-0 h-full w-[85vw] max-w-sm bg-white dark:bg-gray-800 z-20 overflow-auto p-4 rounded-r-2xl"
			>
				<div class="grid gap-4">
					<!-- <div>
						<GeoLocation
							v-if="!isGeolocationEnabled"
							@useGeolocation="handleGeolocation"
							@skipGeolocation="handleSkipGeolocation"
						/>
					</div> -->
					<div>
						<SelectInput
							id="district"
							label="District"
							:options="districtOptions"
							placeholder="Select a district"
							v-model="selectedDistrict"
							@update:modelValue="onDistrictChange"
						/>
					</div>
					<div>
						<SelectInput
							id="municipality"
							label="Municipality"
							:options="municipalityOptions"
							placeholder="Select a municipality"
							v-model="selectedMunicipality"
							:disabled="!selectedDistrict"
							@update:modelValue="onMunicipalityChange"
						/>
					</div>
					<div>
						<MultiSelect
							label="Gas Types"
							:options="fuelTypes"
							v-model="selectedGasTypes"
							:disabled="!selectedMunicipality"
							@update:model-value="load"
						/>
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>

<script setup>
const { fetchDistricts, fetchMunicipalities, fetchStations, fetchFuelTypes } =
	useGasStationsAPI();

// State
const filtersVisible = ref(false);
const districts = ref([]);
const municipalities = ref([]);
const fuels = ref([]);
const stations = ref([]);
const loading = ref(false);
const attemptedLoad = ref(false);
const isGeolocationEnabled = ref(false);
const userCoords = ref({ latitude: null, longitude: null });
const watchId = ref(null);
// let watchId = null;

// Selection
const selectedDistrict = ref("");
const selectedMunicipality = ref("");
const selectedGasTypes = ref([]);

// Options (for UI dropdowns)
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
				// console.warn("Geolocation timed out, retrying...");
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

// Handlers for geolocation choice
const handleGeolocation = async ({ district, municipality }) => {
	isGeolocationEnabled.value = true;
	startLiveGeolocation();
	// userCoords.value = { latitude, longitude };
	// Check if districts.value is populated
	if (districts.value && districts.value.length > 0) {
		const selectedGeoDistrict = districts.value.find(
			(d) => d.Descritivo === district
		);

		municipalities.value =
			(await fetchMunicipalities(selectedDistrict.value)).resultado || [];

		const selectedGeoMunicipality = municipalities.value.find(
			(m) => m.Descritivo === municipality
		);

		if (selectedGeoDistrict && selectedGeoMunicipality) {
			selectedDistrict.value = selectedGeoDistrict.Id;
			selectedMunicipality.value = selectedGeoMunicipality.Id;
		} else {
			console.warn("No matching district found");
		}
	} else {
		console.warn("Districts data not available yet");
	}

	// Use the latitude and longitude to fetch nearby stations, etc.
};

const handleSkipGeolocation = () => {
	isGeolocationEnabled.value = true;
	// Show the district/municipality selection UI instead
};

// On mount, load districts and fuel types
onMounted(async () => {
	loading.value = true;
	districts.value = (await fetchDistricts()).resultado || [];
	fuels.value = await fetchFuelTypes();
	loading.value = false;
});

// When district changes, fetch municipalities
const onDistrictChange = async () => {
	selectedMunicipality.value = "";
	selectedGasTypes.value = [];
	stations.value = [];

	if (!selectedDistrict.value) return;

	loading.value = true;
	municipalities.value =
		(await fetchMunicipalities(selectedDistrict.value)).resultado || [];
	loading.value = false;
};

// When municipality changes, reset fuel types
const onMunicipalityChange = () => {
	selectedGasTypes.value = [];
	stations.value = [];
};

// Load stations
const load = async () => {
	if (
		!selectedDistrict.value ||
		!selectedMunicipality.value ||
		!selectedGasTypes.value.length
	)
		return;

	loading.value = true;
	attemptedLoad.value = true;
	stations.value = []; // Reset

	const fuelTypeIds = selectedGasTypes.value.map((type) => type.value);

	try {
		const data = await fetchStations({
			idDistrito: selectedDistrict.value,
			idsMunicipios: [selectedMunicipality.value],
			idsTiposComb: fuelTypeIds.join(","),
		});

		// If response is invalid or empty
		if (!data || !data.resultado || !Array.isArray(data.resultado)) {
			stations.value = [];
			return;
		}

		// Group prices by station
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

		// Sort if geolocation is enabled
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
		console.error("Error loading stations:", error);
		stations.value = [];
	} finally {
		loading.value = false;
	}
};
</script>
