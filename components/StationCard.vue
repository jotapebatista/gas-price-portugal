<template>
	<div class="bg-white dark:bg-neutral-900 rounded-2xl shadow-soft border border-neutral-200 dark:border-neutral-700 overflow-hidden">
		<!-- Header -->
		<div class="p-4 border-b border-neutral-100 dark:border-neutral-800">
			<div class="flex items-start justify-between">
				<div class="flex-1 min-w-0">
					<h3 class="text-lg font-semibold text-neutral-900 dark:text-white truncate">
						{{ station.Nome }}
					</h3>
					<p class="text-sm text-neutral-600 dark:text-neutral-400 mt-1 line-clamp-2">
						{{ station.Morada }}
					</p>
				</div>
				
				<!-- Distance Badge -->
				<div v-if="station.distance" class="ml-3 flex-shrink-0">
					<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200">
						<Icon name="ph:map-pin" class="w-3 h-3 mr-1" />
						{{ formatDistance(station.distance) }}
					</span>
				</div>
			</div>
		</div>

		<!-- Fuel Prices -->
		<div class="p-4">
			<div class="space-y-3">
				<div
					v-for="price in station.prices"
					:key="price.fuelType"
					class="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800"
				>
					<div class="flex items-center gap-3">
						<div 
							class="w-3 h-3 rounded-full"
							:style="{ backgroundColor: getFuelColor(price.fuelType) }"
						></div>
						<div>
							<p class="text-sm font-medium text-neutral-900 dark:text-white">
								{{ price.fuelType }}
							</p>
						</div>
					</div>
					<div class="text-right">
						<p class="text-lg font-bold text-neutral-900 dark:text-white">
							€{{ price.price }}
						</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Actions -->
		<div class="p-4 pt-0">
			<div class="grid grid-cols-2 gap-3">
				<button
					@click="navigateToStation"
					class="flex items-center justify-center gap-2 py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors"
				>
					<Icon name="ph:navigation-arrow" class="w-4 h-4" />
					<span>Navigate</span>
				</button>
				
				<button
					@click="toggleFavorite"
					class="flex items-center justify-center gap-2 py-3 px-4 border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl font-medium transition-colors"
					:class="isFavorite ? 'text-red-600 dark:text-red-400 border-red-300 dark:border-red-600' : 'text-neutral-700 dark:text-neutral-300'"
				>
					<Icon 
						:name="isFavorite ? 'ph:heart-fill' : 'ph:heart'" 
						class="w-4 h-4" 
					/>
					<span>{{ isFavorite ? 'Saved' : 'Save' }}</span>
				</button>
			</div>
		</div>
	</div>
</template>

<script setup>
const props = defineProps({
	station: {
		type: Object,
		required: true
	},
	isFavorite: {
		type: Boolean,
		default: false
	}
});

const emit = defineEmits(['navigate', 'toggleFavorite']);

const formatDistance = (distance) => {
	if (!distance) return '';
	if (distance < 1) return `${Math.round(distance * 1000)} m`;
	return `${distance.toFixed(1)} km`;
};

const getFuelColor = (fuelType) => {
	const map = {
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

const navigateToStation = () => {
	const url = `https://www.google.com/maps/dir/?api=1&destination=${props.station.Latitude},${props.station.Longitude}`;
	window.open(url, '_blank');
	emit('navigate', props.station);
};

const toggleFavorite = () => {
	emit('toggleFavorite', props.station);
};
</script>

<style scoped>
.line-clamp-2 {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}
</style>
