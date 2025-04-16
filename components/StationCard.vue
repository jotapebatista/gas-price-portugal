<template>
	<div class="p-4 border rounded shadow bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-200 space-y-2">
		<div class="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2">
			<p class="font-semibold text-lg">{{ station.Nome }}</p>
			<p class="text-sm text-gray-600 dark:text-gray-400">
				({{ station.DataAtualizacao }})
			</p>
		</div>

		<p class="text-sm text-gray-600 dark:text-gray-400">📍 {{ station.Morada }}</p>

		<div
			v-for="price in station.prices"
			:key="price.fuelType"
			class="mt-2"
		>
			<p class="font-medium text-green-600 dark:text-green-400 text-xl">
				{{ price.fuelType }}: €{{ price.price }}
			</p>
		</div>
	</div>
</template>

<script setup>
const props = defineProps({
	station: {
		type: Object,
		required: true
	}
});
</script>
