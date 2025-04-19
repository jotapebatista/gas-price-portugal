<template>
	<ClientOnly>
		<div
			class="h-[80vh] w-full rounded-2xl overflow-hidden shadow-lg border dark:border-slate-700"
		>
			<LMap
				class="leaflet-map"
				style="height: 100%"
				:zoom="10"
				:center="defaultCenter"
				:use-global-leaflet="true"
			>
				<!-- Dynamic TileLayer based on theme -->
				<LTileLayer
					v-if="!isDark"
					url="https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
					attribution='&copy; <a href="https://carto.com/">CARTO</a>'
				/>
				<!-- <LTileLayer
					v-else
					url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
					attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a>'
				/> -->
				<LTileLayer
					v-else
					url="https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
					attribution='&copy; <a href="https://carto.com/">CARTO</a>'
				/>
				<!-- User Marker -->
				<LMarker
					v-if="
						props.userLocation?.latitude &&
						props.userLocation?.longitude
					"
					:lat-lng="[
						props.userLocation.latitude,
						props.userLocation.longitude,
					]"
					:icon="userIcon || undefined"
				>
					<LPopup>
						<div
							class="p-2 text-sm rounded-md"
							:class="
								isDark
									? 'bg-slate-800 text-white'
									: 'bg-white text-slate-800'
							"
						>
							<strong>You are here 📍</strong>
						</div>
					</LPopup>
				</LMarker>

				<!-- Station Markers -->
				<LMarker
					v-for="station in stations"
					:key="station.Id"
					:lat-lng="[station.Latitude, station.Longitude]"
				>
					<LPopup>
						<div
							class="text-sm p-2 rounded-md"
							:class="
								isDark
									? 'bg-slate-800 text-white'
									: 'bg-white text-slate-800'
							"
						>
							<strong class="text-base">{{ station.Nome }}</strong
							><br />
							<small
								class="text-xs text-gray-400 dark:text-gray-300"
							>
								{{ station.Morada }}
							</small>
							<ul class="mt-2 space-y-1">
								<li
									v-for="p in station.prices"
									:key="p.fuelType"
									class="flex gap-2 items-center text-xs"
								>
									<span
										class="text-lg"
										:style="{
											color: getFuelColor(p.fuelType),
										}"
									>
										<!-- ⛽ -->
										<Icon
											name="ph:gas-pump"
											class="w-4 h-4"
										/>
									</span>
									{{ p.fuelType }}:
									<strong>€{{ p.price }}</strong>
								</li>
							</ul>

							<a
								:href="`https://www.google.com/maps/dir/?api=1&destination=${station.Latitude},${station.Longitude}`"
								target="_blank"
								rel="noopener"
								class="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
							>
								<Icon name="ph:map-pin" class="w-4 h-4" />
								<span>Navigate</span>
							</a>
						</div>
					</LPopup>
				</LMarker>
			</LMap>
		</div>
	</ClientOnly>
</template>

<script setup lang="ts">
import { useColorMode } from "@vueuse/core";
import { onMounted } from "vue";

const userIcon = ref<L.Icon | null>(null);

// Fix Leaflet marker icon paths
onMounted(async () => {
	const L = await import("leaflet");
	delete L.Icon.Default.prototype._getIconUrl;
	L.Icon.Default.mergeOptions({
		iconRetinaUrl: new URL(
			"leaflet/dist/images/marker-icon-2x.png",
			import.meta.url
		).href,
		iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url)
			.href,
		shadowUrl: new URL(
			"leaflet/dist/images/marker-shadow.png",
			import.meta.url
		).href,
	});
	userIcon.value = L.icon({
		iconUrl:
			"https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
		shadowUrl:
			"https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
		iconSize: [25, 41],
		iconAnchor: [12, 41],
		popupAnchor: [1, -34],
		shadowSize: [41, 41],
	});
});

const props = defineProps<{
	stations: {
		Id: number;
		Nome: string;
		Morada: string;
		Latitude: number;
		Longitude: number;
		prices: { fuelType: string; price: number }[];
	}[];
	userLocation?: {
		latitude: number | null;
		longitude: number | null;
	};
}>();

const defaultCenter = computed(() => {
	if (props.userLocation?.latitude && props.userLocation?.longitude) {
		return [props.userLocation.latitude, props.userLocation.longitude];
	}
	if (props.stations.length) {
		return [props.stations[0].Latitude, props.stations[0].Longitude];
	}
	return [39.5, -8];
});

const getFuelColor = (fuelType: string) => {
	const map: Record<string, string> = {
		"Gasolina simples 95": "#22c55e",
		"Gasolina especial 95": "#10b981",
		"Gasolina especial 98": "#84cc16",
		"Gasolina 98": "#84cc16",
		"Gasóleo simples": "#3b82f6",
		"Gasóleo especial": "#06b6d4",
		"Gasóleo colorido": "#6366f1",
		"Gasóleo de aquecimento": "#9ca3af",
		"Biodiesel B15": "#eab308",
		"GPL Auto": "#ec4899",
		"GNC (gás natural comprimido) - €/kg": "#f97316",
		"GNC (gás natural comprimido) - €/m3": "#fb923c",
		"GNL (gás natural liquefeito) - €/kg": "#ef4444",
		"Gasolina de mistura (motores a 2 tempos)": "#a855f7",
	};
	return map[fuelType] || "#6b7280";
};

const colorMode = useColorMode();

const isDark = ref(colorMode.value === "dark");

watch(
	() => colorMode.value,
	(newVal) => {
		console.log("Color mode changed:", newVal);
		isDark.value = newVal === "dark";
	}
);
</script>

<style scoped>
.leaflet-map {
	filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
	border-radius: 1rem;
}
.leaflet-container {
	z-index: 0 !important;
}
:deep(.leaflet-popup-content-wrapper) {
	@apply bg-slate-800
	/* background: red !important;
	border: none !important;
	box-shadow: none !important;
	padding: 0 !important; */;
}
</style>
