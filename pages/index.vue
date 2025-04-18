<template>
	<div
		class="container mx-auto p-4 space-y-6 text-gray-800 dark:text-gray-200"
	>
		<!-- District Selection -->
		<div>
			<GeoLocation
				v-if="!isGeolocationEnabled"
				@useGeolocation="handleGeolocation"
				@skipGeolocation="handleSkipGeolocation"
			/>
		</div>
		<div class="grid gap-4 sm:grid-cols-2">
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

			<!-- Municipality Selection -->
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

			<!-- Fuel Type Selection -->
			<div class="sm:col-span-2">
				<MultiSelect
					:options="fuelTypes"
					v-model="selectedGasTypes"
					:disabled="!selectedMunicipality"
					@update:model-value="onFuelTypeChange"
				/>
			</div>
		</div>

		<!-- Load Button -->
		<button
			class="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded disabled:opacity-50"
			@click="load"
			:disabled="
				!selectedMunicipality || !selectedGasTypes.length || loading
			"
		>
			🔄 Load Prices
		</button>

		<!-- Stations Grid -->
		<div v-if="stations.length" class="grid gap-4 sm:grid-cols-2">
			<!-- <StationCard
				v-for="station in stations"
				:key="station.Id"
				:station="station"
			/> -->

			<StationMap :stations="stations" />
		</div>

		<!-- No Stations Message -->
		<div
			v-if="attemptedLoad && !stations.length && !loading"
			class="p-4 border-l-4 border-yellow-400 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-100 text-yellow-800 rounded"
		>
			⚠️ No stations found for this area.
		</div>
	</div>
</template>

<script setup>
const { fetchDistricts, fetchMunicipalities, fetchStations, fetchFuelTypes } =
	useGasStationsAPI();

// State
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
		console.log("Districts data available:", districts.value);
		const selectedGeoDistrict = districts.value.find(
			(d) => d.Descritivo === district
		);

		municipalities.value =
			(await fetchMunicipalities(selectedDistrict.value)).resultado || [];

		const selectedGeoMunicipality = municipalities.value.find(
			(m) => m.Descritivo === municipality
		);
		console.log(municipalities.value);

		if (selectedGeoDistrict && selectedGeoMunicipality) {
			selectedDistrict.value = selectedGeoDistrict.Id;
			selectedMunicipality.value = selectedGeoMunicipality.Id;
			console.log("Selected district:", selectedDistrict.value);
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
