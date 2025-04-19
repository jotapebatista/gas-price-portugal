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

				<!-- Markers -->
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
								>{{ station.Morada }}</small
							>
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
										>⛽</span
									>
									{{ p.fuelType }}:
									<strong>€{{ p.price }}</strong>
								</li>
							</ul>
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
}>();

const defaultCenter = props.stations.length
	? [props.stations[0].Latitude, props.stations[0].Longitude]
	: [38.7223, -9.1393];

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

// watch(
//   () => colorMode.value,
//   (newVal) => {
// 	console.log('Color mode changed:', newVal)
// 	isDark.value = newVal === 'dark'
//   },
//   { immediate: true }
// )

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
</style>
