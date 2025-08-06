<template>
	<div class="space-y-2">
		<div class="flex items-center justify-between">
			<label
				class="block text-sm font-medium text-gray-700 dark:text-gray-300"
			>
				{{ $t("fuelType") }}
			</label>
			<div class="flex space-x-2">
				<button
					@click="selectAllFuelTypes"
					class="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
				>
					{{ $t("selectAll") }}
				</button>
				<button
					@click="clearAllFuelTypes"
					class="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
				>
					{{ $t("clearAll") }}
				</button>
			</div>
		</div>
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

function selectAllFuelTypes() {
	const allFuelIds = props.fuelTypes.map(fuel => fuel.id);
	emit("update:selectedFuelTypes", allFuelIds);
	emit("change");
}

function clearAllFuelTypes() {
	emit("update:selectedFuelTypes", []);
	emit("change");
}
</script>
