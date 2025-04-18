<template>
	<div
		class="p-4 border rounded-2xl shadow-md bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100 space-y-3"
	>
		<div
			class="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2"
		>
			<p class="font-semibold text-xl">{{ station.Nome }}</p>
			<p class="text-sm text-gray-500 dark:text-gray-400">
				({{ station.DataAtualizacao }})
			</p>
		</div>

		<p
			class="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1"
		>
			📍 {{ station.Morada }}
		</p>

		<div
			v-for="price in station.prices"
			:key="price.fuelType"
			class="flex items-center gap-2 mt-3 text-lg font-medium"
		>
			<Icon
				name="ph:gas-pump"
				:class="['w-5 h-5', fuelColor(price.fuelType)]"
			/>
			<span>{{ price.fuelType }}:</span>
			<span class="ml-auto font-bold">€{{ price.price }}</span>
		</div>

		<p
			v-if="station.distance"
			class="text-sm text-gray-500 dark:text-gray-400"
		>
			🧭 Distance: {{ station.distance.toFixed(1) }} km
		</p>
	</div>
</template>

<script setup>
const props = defineProps({
	station: {
		type: Object,
		required: true
	}
});
const fuelColor = (fuelType) => {
	const colors = {
		"Gasolina simples 95": "text-green-600",
		"Gasolina especial 95": "text-emerald-600",
		"Gasolina especial 98": "text-lime-600",
		"Gasolina 98": "text-lime-600",
		"Gasóleo simples": "text-blue-600",
		"Gasóleo especial": "text-cyan-600",
		"Gasóleo colorido": "text-indigo-600",
		"Gasóleo de aquecimento": "text-gray-500",
		"Biodiesel B15": "text-yellow-600",
		"GPL Auto": "text-pink-600",
		"GNC (gás natural comprimido) - €/kg": "text-orange-600",
		"GNC (gás natural comprimido) - €/m3": "text-orange-500",
		"GNL (gás natural liquefeito) - €/kg": "text-red-600",
		"Gasolina de mistura (motores a 2 tempos)": "text-fuchsia-600"
	};

	return colors[fuelType] || "text-gray-500";
};
</script>
