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

			<!-- Map Controls -->
			<MapControls :map="map" />

			<!-- Results Badge -->
			<ResultsBadge :count="stations.length" />

			<!-- Station Popup -->
			<StationPopup :station="selectedStation" @close="closePopup" />
		</div>
	</ClientOnly>
</template>

<style scoped>
.favorite-station-marker {
	background: transparent !important;
	border: none !important;
}

.user-location-marker {
	background: transparent !important;
	border: none !important;
}
</style>

<script setup lang="ts">
import { useGeolocation } from '@/composables/useGeolocation'
import { useFavorites } from '@/composables/useFavorites'

const geolocation = useGeolocation()
const { isFavorite } = useFavorites()
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
const userLocationMarker = ref<any>(null);
const selectedStation = ref<GroupedStation | null>(null);
const tileLayer = ref<any>();
const userLocation = ref<{ lat: number; lng: number } | null>(null);

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
				// Create map centered on Portugal with custom controls disabled
				map.value = L.default.map(newContainer, {
					zoomControl: false, // Disable default zoom controls
					attributionControl: false // Disable default attribution control
				}).setView([39.5, -8], 7);
				// Add tile layer based on current theme
				updateMapTiles(L.default);
				// Force map to resize after initialization
				setTimeout(() => {
					if (map.value) {
						map.value.invalidateSize();
					}
				}, 100);
				
				// Get user location after map is initialized
				getUserLocation();
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
		// Check if station is favorite
		const isStationFavorite = isFavorite(station.id);
		
		// Create custom icon for favorite stations
		let marker;
		if (isStationFavorite) {
			const favoriteIcon = L.default.divIcon({
				className: 'favorite-station-marker',
				html: `
					<div class="w-8 h-8 bg-red-500 border-2 border-white rounded-full shadow-lg flex items-center justify-center">
						<svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
						</svg>
					</div>
				`,
				iconSize: [32, 32],
				iconAnchor: [16, 16]
			});
			marker = L.default.marker([station.latitude, station.longitude], { icon: favoriteIcon });
		} else {
			// Default marker for non-favorite stations
			marker = L.default.marker([station.latitude, station.longitude]);
		}
		
		marker.addTo(map.value!);

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

// Get user location and show on map
const getUserLocation = async () => {
	if (!process.client || !map.value) return;
	
	try {
		const { lat, lng } = await geolocation.getCurrentPosition();
		userLocation.value = { lat, lng };
		
		const L = await import("leaflet");
		
		// Remove existing user location marker
		if (userLocationMarker.value) {
			userLocationMarker.value.remove();
		}
		
		// Create custom icon for user location
		const userIcon = L.default.divIcon({
			className: 'user-location-marker',
			html: `
				<div class="w-6 h-6 bg-blue-500 border-2 border-white rounded-full shadow-lg flex items-center justify-center">
					<div class="w-3 h-3 bg-white rounded-full"></div>
				</div>
			`,
			iconSize: [24, 24],
			iconAnchor: [12, 12]
		});
		
		// Add user location marker
		userLocationMarker.value = L.default.marker([lat, lng], { icon: userIcon })
			.addTo(map.value)
			.bindPopup(`
				<div class="p-2">
					<h3 class="font-bold text-sm mb-1">${$t('yourLocation')}</h3>
					<p class="text-xs text-gray-600">${lat.toFixed(4)}, ${lng.toFixed(4)}</p>
				</div>
			`);
		
		// Center map on user location if no stations are shown
		if (props.stations.length === 0) {
			map.value.setView([lat, lng], 12);
		}
		
	    } catch (error) {
      // Error getting user location
    }
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

const closePopup = () => {
	selectedStation.value = null;
};

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
