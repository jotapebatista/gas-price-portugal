<template>
	<div class="relative w-full">
		<!-- Dropdown Button -->
		<button
			type="button"
			class="hs-select-toggle hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 max-w-full cursor-pointer bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-start text-sm text-gray-800 dark:text-gray-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
			@click="toggleDropdown"
			:aria-expanded="isDropdownOpen.toString()"
		>
			<span v-if="selectedValues.length === 0"
				>Select multiple options...</span
			>
			<span v-else>{{
				selectedValues.map((opt) => opt.label).join(", ")
			}}</span>
			<div class="absolute top-1/2 end-3 -translate-y-1/2">
				<svg
					v-if="!isDropdownOpen"
					class="shrink-0 size-3.5 text-gray-500 dark:text-gray-400"
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="m7 15 5 5 5-5" />
					<path d="m7 9 5-5 5 5" />
				</svg>
				<svg
					v-if="isDropdownOpen"
					class="shrink-0 size-3.5 text-gray-500 dark:text-gray-400"
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="m7 15 5 5 5-5" />
				</svg>
			</div>
		</button>

		<!-- Dropdown Menu -->
		<div
			v-if="isDropdownOpen"
			class="hs-select-dropdown mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden overflow-y-auto max-w-full"
		>
			<div
				v-for="option in options"
				:key="option.value"
				class="hs-select-option py-2 px-4 w-full text-sm text-gray-800 dark:text-gray-200 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg focus:outline-hidden focus:bg-gray-100 dark:focus:bg-gray-700"
				@click="toggleOption(option)"
			>
				<div class="flex justify-between items-center w-full">
					<span>{{ option.label }}</span>
					<span v-if="isSelected(option)">
						<svg
							class="shrink-0 size-3.5 text-blue-600"
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<polyline points="20 6 9 17 4 12" />
						</svg>
					</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
const props = defineProps({
	label: String,
	options: {
		type: Array,
		required: true,
	},
	modelValue: {
		type: Array,
		default: () => [],
	},
});

const emit = defineEmits(["update:modelValue"]);

const selectedValues = ref([...props.modelValue]); // Initialize with modelValue
const isDropdownOpen = ref(false);

const toggleDropdown = () => {
	isDropdownOpen.value = !isDropdownOpen.value;
};

// Check if option is selected
const isSelected = (option) => {
	return selectedValues.value.some(
		(selected) => selected.value === option.value
	);
};

// Toggle option selection
const toggleOption = (option) => {
	const index = selectedValues.value.findIndex(
		(selected) => selected.value === option.value
	);
	if (index === -1) {
		selectedValues.value.push(option);
	} else {
		selectedValues.value.splice(index, 1);
	}
	emit("update:modelValue", selectedValues.value); // Emit the updated modelValue
};

//   // Close dropdown when clicked outside
//   const closeDropdown = (e) => {
// 	if (!e.target.closest('.hs-select-toggle')) {
// 	  isDropdownOpen.value = false;
// 	}
//   };

//   onMounted(() => {
// 	window.addEventListener('click', closeDropdown);
//   });

//   onBeforeUnmount(() => {
// 	window.removeEventListener('click', closeDropdown);
//   });
</script>

<style scoped>
.hs-select-toggle {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

/* .hs-select-option:hover {
	background-color: #f3f4f6;
} */

.hs-select-dropdown {
	max-height: 300px;
	overflow-y: auto;
	max-width: 100%;
}

.hs-select-option {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
</style>
