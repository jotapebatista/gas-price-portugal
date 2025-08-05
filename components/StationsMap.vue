<template>
	<ClientOnly>
		<div class="fixed inset-0 z-50 bg-white dark:bg-gray-900">
			<!-- Full Screen Map -->
			<div
				ref="mapContainer"
				class="absolute inset-0 bg-blue-200 dark:bg-blue-800"
				style="z-index: 1"
			>
				<!-- Loading State -->
				<div
					v-if="!map"
					class="absolute inset-0 flex items-center justify-center bg-blue-200 dark:bg-blue-800"
				>
					<div class="text-center">
						<div class="mx-auto h-16 w-16 text-blue-500 mb-4">
							<svg
								class="animate-spin"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
								></circle>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
						</div>
						<h3
							class="text-lg font-medium text-gray-900 dark:text-white mb-2"
						>
							{{ $t("loadingMap") }}
						</h3>
						<p class="text-sm text-gray-500 dark:text-gray-400">
							{{ $t("initializingMap") }}
						</p>
					</div>
				</div>
			</div>

			<!-- Map Header -->
			<MapHeader />

			<!-- Map Controls -->
			<MapControls :map="map" />

			<!-- Results Badge -->
			<ResultsBadge :count="stations.length" />

			<!-- Bottom Filter Sheet -->
			<div
				class="absolute bottom-0 left-0 right-0 z-[1000] bg-white dark:bg-gray-800 rounded-t-2xl shadow-2xl border-t border-gray-200 dark:border-gray-700 transition-all duration-300 ease-out"
				:class="isFilterOpen ? 'h-[85vh] max-h-[600px]' : 'h-20'"
			>
				<!-- Handle -->
				<div class="flex justify-center pt-3 pb-2">
					<div
						class="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"
					></div>
				</div>

				<!-- Filter Toggle -->
				<div
					v-if="!isFilterOpen"
					@click="isFilterOpen = true"
					class="px-4 pb-4 cursor-pointer"
				>
					<div class="flex items-center justify-between">
						<div class="flex-1">
							<h3
								class="text-sm font-medium text-gray-900 dark:text-white"
							>
								{{ $t("filters") }}
							</h3>
							<div class="flex items-center mt-2 gap-2 flex-wrap">
								<template v-if="!isFilterOpen">
									<span
										v-if="
											fuelTypeSummaryBadge.type === 'info'
										"
										class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
									>
										{{ fuelTypeSummaryBadge.label }}
									</span>
									<span
										v-else
										class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
									>
										{{ fuelTypeSummaryBadge.label }}
									</span>
								</template>
								<template v-else>
									<template
										v-if="selectedFuelTypes.length === 0"
									>
										<span
											class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
										>
											{{ $t("selectAtLeastOneFuel") }}
										</span>
									</template>
									<template v-else>
										<span
											v-for="id in selectedFuelTypes"
											:key="id"
											class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 mr-1"
										>
											{{ getFuelTypeName(id) }}
										</span>
									</template>
								</template>
								<!-- District Badge -->
								<span
									v-if="selectedDistrict"
									class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
								>
									<svg
										class="w-3 h-3 mr-1"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fill-rule="evenodd"
											d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
											clip-rule="evenodd"
										/>
									</svg>
									{{ getDistrictName() }}
								</span>
								<!-- Municipality Badge -->
								<span
									v-if="selectedMunicipality"
									class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
								>
									<svg
										class="w-3 h-3 mr-1"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fill-rule="evenodd"
											d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z"
											clip-rule="evenodd"
										/>
									</svg>
									{{ getMunicipalityName() }}
								</span>
							</div>
						</div>
						<div class="flex items-center space-x-2">
							<!-- Clear All Button -->
							<button
								v-if="hasActiveFilters()"
								@click.stop="clearAllFilters"
								class="p-3 text-gray-400 hover:text-red-500 transition-colors rounded-full bg-gray-100 dark:bg-gray-700"
								:title="$t('clearAllFilters')"
								style="min-width: 44px; min-height: 44px"
							>
								<svg
									class="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
									/>
								</svg>
							</button>
							<svg
								class="w-6 h-6 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 9l-7 7-7-7"
								/>
							</svg>
						</div>
					</div>
				</div>

				<!-- Filter Content -->
				<div
					v-if="isFilterOpen"
					class="px-4 pb-4 h-full overflow-y-auto"
				>
					<div class="flex items-center justify-between mb-6">
						<h3
							class="text-lg font-semibold text-gray-900 dark:text-white"
						>
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
							<button
								@click="isFilterOpen = false"
								class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
							>
								<svg
									class="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>
					</div>

					<div class="space-y-6">
						<!-- Fuel Type Selector -->
						<FuelTypeSelector
							:fuel-types="fuelTypes"
							:selected-fuel-types="selectedFuelTypes"
							@update:selectedFuelTypes="
								(val) => emit('update:selectedFuelTypes', val)
							"
							@change="() => emit('fuelTypeChange')"
						/>

						<!-- Location Selector -->
						<div class="space-y-4">
							<h4
								class="text-sm font-medium text-gray-700 dark:text-gray-300"
							>
								{{ $t("location") }}
							</h4>
							<button @click="autofillLocation" :disabled="geolocLoading" class="mb-2 px-3 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50">
								<span v-if="geolocLoading">{{ $t('locating') }}</span>
								<span v-else>{{ $t('useMyLocation') }}</span>
							</button>
							<p v-if="geolocError" class="text-xs text-red-500">{{ geolocError }}</p>
							<!-- District -->
							<div class="space-y-2">
								<label
									class="block text-sm font-medium text-gray-700 dark:text-gray-300"
								>
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
									<div
										class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
									>
										<svg
											class="h-4 w-4 text-gray-400"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M19 9l-7 7-7-7"
											/>
										</svg>
									</div>
								</div>
							</div>

							<!-- Municipality -->
							<div class="space-y-2">
								<label
									class="block text-sm font-medium text-gray-700 dark:text-gray-300"
								>
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
									<div
										class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
									>
										<svg
											class="h-4 w-4 text-gray-400"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M19 9l-7 7-7-7"
											/>
										</svg>
									</div>
								</div>
							</div>
						</div>

						<!-- Search Button -->
						<div class="pt-4">
							<button
								@click="searchStations"
								:disabled="
									loading || selectedFuelTypes.length === 0
								"
								class="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center text-base"
							>
								<span
									v-if="loading"
									class="flex items-center justify-center"
								>
									<svg
										class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											class="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											stroke-width="4"
										></circle>
										<path
											class="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										></path>
									</svg>
									{{ $t("searching") }}
								</span>
								<span
									v-else
									class="flex items-center justify-center"
								>
									<svg
										class="w-5 h-5 mr-2"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
										/>
									</svg>
									{{ $t("search") }}
								</span>
							</button>
						</div>
					</div>
				</div>
			</div>

			<!-- Station Popup -->
			<StationPopup :station="selectedStation" @close="closePopup" />
		</div>
	</ClientOnly>
</template>

<script setup lang="ts">
import { useGeolocation } from '@/composables/useGeolocation'
const geolocation = useGeolocation()
const geolocLoading = ref(false)
const geolocError = ref('')

interface Combustivel {
	tipo: string;
	preco: number;
	dataAtualizacao: string;
}

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

interface GroupedStation {
	id: number;
	nome: string;
	morada: string;
	codigoPostal: string;
	localidade: string;
	latitude: number;
	longitude: number;
	marca: string;
	municipio: string;
	distrito: string;
	combustiveis: Combustivel[];
}

interface Props {
	stations: GroupedStation[];
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

const mapContainer = ref<HTMLElement>();
const map = ref<any>();
const markers = ref<any[]>([]);
const selectedStation = ref<GroupedStation | null>(null);
const isFilterOpen = ref(false);
const tileLayer = ref<any>();

// Computed summary for closed filter bar
const fuelTypeSummaryBadge = computed(() => {
	if (props.selectedFuelTypes.length === 0) {
		return { type: "info", label: $t("selectAtLeastOneFuel") };
	}
	if (props.selectedFuelTypes.length === 1) {
		return {
			type: "single",
			label: getFuelTypeName(props.selectedFuelTypes[0]),
		};
	}
	const firstName = getFuelTypeName(props.selectedFuelTypes[0]);
	const more = Math.max(1, props.selectedFuelTypes.length - 1);
	return { type: "multi", label: `${firstName} +${more}` };
});

// Initialize map when container is available
watch(
	mapContainer,
	async (newContainer) => {
		if (newContainer && process.client) {
			try {
				const L = await import("leaflet");
				await import("leaflet/dist/leaflet.css");
				// Fix Leaflet icon paths
				delete (L.default.Icon.Default.prototype as any)._getIconUrl;
				L.default.Icon.Default.mergeOptions({
					iconRetinaUrl:
						"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
					iconUrl:
						"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
					shadowUrl:
						"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
				});
				// Create map centered on Portugal
				map.value = L.default.map(newContainer).setView([39.5, -8], 7);
				// Add tile layer based on current theme
				updateMapTiles(L.default);
				// Force map to resize after initialization
				setTimeout(() => {
					if (map.value) {
						map.value.invalidateSize();
					}
				}, 100);
			} catch (error) {
				// Optionally handle error
			}
		}
	},
	{ immediate: true }
);

// Watch for stations changes
watch(
	() => props.stations,
	(newStations) => {
		if (process.client) {
			updateMarkers(newStations);
		}
	},
	{ deep: true }
);

// Update markers on map
const updateMarkers = async (stations: GroupedStation[]) => {
	if (!process.client) return;

	const L = await import("leaflet");

	// Clear existing markers
	markers.value.forEach((marker) => {
		if (map.value && marker.remove) {
			marker.remove();
		}
	});
	markers.value = [];

	if (!map.value || stations.length === 0) return;

	// Add new markers
	const bounds = L.default.latLngBounds([]);

	stations.forEach((station) => {
		const marker = L.default
			.marker([station.latitude, station.longitude])
			.addTo(map.value!);

		marker.on("click", () => {
			selectedStation.value = station;
		});

		markers.value.push(marker);
		bounds.extend([station.latitude, station.longitude]);
	});

	// Fit map to show all markers
	if (bounds.isValid()) {
		map.value.fitBounds(bounds, { padding: [20, 20] });
	}
};

// Create popup content
const createPopupContent = (station: GroupedStation) => {
	const fuelPrices = station.combustiveis
		.map(
			(fuel) =>
				`<div class="flex justify-between"><span>${fuel.tipo}</span><span class="font-bold text-green-600">${formatPrice(fuel.preco)}</span></div>`
		)
		.join("");

	return `
    <div class="p-2">
      <h3 class="font-bold text-lg mb-2">${station.nome}</h3>
      <p class="text-sm text-gray-600 mb-2">${station.marca}</p>
      <p class="text-sm text-gray-500 mb-3">${station.morada}, ${station.codigoPostal} ${station.localidade}</p>
      <div class="space-y-1">
        ${fuelPrices}
      </div>
    </div>
  `;
};

// Utility functions
const formatPrice = (price: number) => {
	if (!price || price === 0) return "N/A";
	return new Intl.NumberFormat("pt-PT", {
		style: "currency",
		currency: "EUR",
		minimumFractionDigits: 3,
	}).format(price);
};

// Utility functions for filter management
const getDistrictName = () => {
	if (!props.selectedDistrict) return "";
	const district = props.districts.find(
		(d) => d.id === Number(props.selectedDistrict)
	);
	return district ? district.nome : "";
};

const getMunicipalityName = () => {
	if (!props.selectedMunicipality) return "";
	const municipality = props.municipalities.find(
		(m) => m.id === Number(props.selectedMunicipality)
	);
	return municipality ? municipality.nome : "";
};

// Helper to get fuel type name by ID
const getFuelTypeName = (id: number) => {
	const fuel = props.fuelTypes.find((f) => f.id === id);
	return fuel ? fuel.nome : id;
};

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
};

const selectAllFuelTypes = () => {
	const allFuelTypeIds = props.fuelTypes.map((fuel) => fuel.id);
	emit("update:selectedFuelTypes", allFuelTypeIds);
};

const toggleFuelType = (fuelId: number) => {
	let newSelectedTypes;
	if (props.selectedFuelTypes.includes(fuelId)) {
		newSelectedTypes = props.selectedFuelTypes.filter(
			(id) => id !== fuelId
		);
	} else {
		newSelectedTypes = Array.from(
			new Set([...props.selectedFuelTypes, fuelId])
		);
	}
	emit("update:selectedFuelTypes", newSelectedTypes);
	emit("fuelTypeChange");
};

const closePopup = () => {
	selectedStation.value = null;
};

// Filter handlers
const onFuelTypeChange = (fuelId: number, event: Event) => {
	const target = event.target as HTMLInputElement;
	let newSelectedTypes;
	if (target.checked) {
		newSelectedTypes = Array.from(
			new Set([...props.selectedFuelTypes, fuelId])
		);
	} else {
		newSelectedTypes = props.selectedFuelTypes.filter(
			(id) => id !== fuelId
		);
	}
	emit("update:selectedFuelTypes", newSelectedTypes);
	emit("fuelTypeChange");
};

const onDistrictChange = (event: Event) => {
	const target = event.target as HTMLSelectElement;
	emit("update:selectedDistrict", target.value);
	emit("districtChange");
};

const onMunicipalityChange = (event: Event) => {
	const target = event.target as HTMLSelectElement;
	emit("update:selectedMunicipality", target.value);
	emit("municipalityChange");
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
    // Try to find matching district and municipality IDs
    const districtObj = props.districts.find(d => d.nome.toLowerCase() === district.toLowerCase())
    const municipalityObj = props.municipalities.find(m => m.nome.toLowerCase() === municipality.toLowerCase())
    if (districtObj) emit('update:selectedDistrict', String(districtObj.id))
    if (municipalityObj) emit('update:selectedMunicipality', String(municipalityObj.id))
    if (!districtObj || !municipalityObj) {
      geolocError.value = $t('locationNotFound')
    }
  } catch (err) {
    geolocError.value = $t('locationError')
  } finally {
    geolocLoading.value = false
  }
}

// Cleanup
onUnmounted(() => {
	if (map.value && process.client) {
		map.value.remove();
	}
});

// Function to update map tiles based on theme
const updateMapTiles = async (L: any) => {
	if (!map.value) return;

	// Remove existing tile layer
	if (tileLayer.value) {
		map.value.removeLayer(tileLayer.value);
	}

	// Add new tile layer based on theme
	const colorMode = useColorMode();
	const isDark = colorMode.value === "dark";
	const tileUrl = isDark
		? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
		: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

	const attribution = isDark
		? "© CARTO © OpenStreetMap contributors"
		: "© OpenStreetMap contributors";

	tileLayer.value = L.tileLayer(tileUrl, {
		attribution,
		subdomains: isDark ? "abcd" : "abc",
	}).addTo(map.value);
};

// Watch for theme changes
watch(
	() => useColorMode().value,
	async () => {
		if (map.value && process.client) {
			const L = await import("leaflet");
			updateMapTiles(L.default);
		}
	}
);

watch(isFilterOpen, (open) => {
	if (open) {
		selectedStation.value = null;
	}
});
</script>

<style scoped>
/* Override Leaflet's default z-index values */
:deep(.leaflet-container) {
	z-index: 1 !important;
}

:deep(.leaflet-control-container) {
	z-index: 1000 !important;
}

:deep(.leaflet-popup) {
	z-index: 1001 !important;
}

:deep(.leaflet-tooltip) {
	z-index: 1002 !important;
}

:deep(.station-popup .leaflet-popup-content-wrapper) {
	border-radius: 0.5rem;
	box-shadow:
		0 10px 15px -3px rgba(0, 0, 0, 0.1),
		0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

:deep(.station-popup .leaflet-popup-tip) {
	background: white;
}

:deep(.leaflet-popup-content) {
	margin: 0;
	min-width: 200px;
}
</style>
