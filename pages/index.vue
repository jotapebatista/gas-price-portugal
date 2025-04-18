<template>
	<div class="relative h-screen w-screen overflow-hidden">
		<!-- Fullscreen Map -->
		<StationMap :stations="stations" :user-location="userCoords" />

		<!-- Toggle Button -->
		<button
			class="absolute z-20 top-4 right-4 bg-white dark:bg-gray-900 text-sm px-3 py-1.5 shadow-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
			@click="filtersVisible = !filtersVisible"
		>
			<span
				>{{ filtersVisible ? "Hide Filters ▲" : "Show Filters ▼" }}
			</span>
		</button>

		<!-- Slide Transition -->
		<transition
			name="slide-down"
			enter-active-class="transition duration-300 ease-out"
			leave-active-class="transition duration-300 ease-in"
			enter-from-class="-translate-y-full opacity-0"
			enter-to-class="translate-y-0 opacity-100"
			leave-from-class="translate-y-0 opacity-100"
			leave-to-class="-translate-y-full opacity-0"
		>
			<div
				v-if="filtersVisible"
				class="absolute top-0 left-1/2 -translate-x-1/2 w-full bg-white dark:bg-gray-800 shadow-xl rounded-b-lg z-10 overflow-auto max-h-[90vh] p-4"
			>
				<div class="grid gap-4 sm:grid-cols-2">
					<div>
						<GeoLocation
							v-if="!isGeolocationEnabled"
							@useGeolocation="handleGeolocation"
							@skipGeolocation="handleSkipGeolocation"
						/>
					</div>
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
					<div class="sm:col-span-2">
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
const filtersVisible = ref(true);
const districts = ref([]);
const municipalities = ref([]);
const fuels = ref([]);
const stations = ref([]);
const loading = ref(false);
const attemptedLoad = ref(false);
const isGeolocationEnabled = ref(false);
const userCoords = ref({ latitude: null, longitude: null });

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

// Handlers for geolocation choice
const handleGeolocation = async ({
	latitude,
	longitude,
	district,
	municipality,
}) => {
	isGeolocationEnabled.value = true;
	userCoords.value = { latitude, longitude };
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
	console.log("User opted to select manually");
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

// When fuel types change, clear previous results
const onFuelTypeChange = () => {
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
