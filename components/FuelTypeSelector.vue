<template>
	<div class="space-y-2">
		<label
			class="block text-sm font-medium text-gray-700 dark:text-gray-300"
		>
			{{ $t("fuelType") }}
		</label>
		<div class="max-h-32 sm:max-h-40 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 p-2 space-y-1">
			<div
				v-for="fuel in fuelTypes"
				:key="fuel.id"
				class="flex items-center p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
			>
				<input
					:id="`fuel-${fuel.id}`"
					type="checkbox"
					:value="fuel.id"
					:checked="selectedFuelTypes.includes(fuel.id)"
					@change="onFuelTypeChange(fuel.id, $event)"
					class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded flex-shrink-0"
				>
				<label
					:for="`fuel-${fuel.id}`"
					class="ml-3 text-sm text-gray-900 dark:text-white cursor-pointer flex-1 select-none"
				>
					{{ fuel.nome }}
				</label>
			</div>
		</div>
		<p
			v-if="selectedFuelTypes.length === 0"
			class="text-xs text-red-500 flex items-center"
		>
			<svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
				<path
					fill-rule="evenodd"
					d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
					clip-rule="evenodd"
				/>
			</svg>
			{{ $t("selectAtLeastOneFuel") }}
		</p>
	</div>
</template>

<script setup lang="ts">
interface FuelType {
	id: number;
	nome: string;
	ativo: boolean;
}

interface Props {
	fuelTypes: FuelType[];
	selectedFuelTypes: number[];
}

interface Emits {
	(e: "update:selectedFuelTypes", value: number[]): void;
	(e: "change"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

function onFuelTypeChange(fuelId: number, event: Event) {
	const target = event.target as HTMLInputElement;
	let newSelectedTypes;
	if (target.checked) {
		newSelectedTypes = Array.from(new Set([...props.selectedFuelTypes, fuelId]));
	} else {
		newSelectedTypes = props.selectedFuelTypes.filter((id) => id !== fuelId);
	}
	emit("update:selectedFuelTypes", newSelectedTypes);
	emit("change");
}
</script>
