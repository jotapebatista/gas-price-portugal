<template>
	<div class="w-full max-w-sm">
		<label
			:for="id"
			class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
		>
			{{ label }}
		</label>
		<div class="relative w-full" ref="dropdownRef">
			<!-- Dropdown Button -->
			<button
				type="button"
				class="relative py-2.5 px-4 pe-9 w-full text-left bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-base text-gray-800 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
				@click="toggleDropdown"
			>
				<span v-if="selectedValues.length === 0">
					{{ placeholder || 'Select one or more options...' }}
				</span>
				<span v-else>
					{{ selectedValues.map((opt) => opt.label).join(', ') }}
				</span>
				<div class="absolute top-1/2 right-3 -translate-y-1/2">
					<svg
						v-if="!isDropdownOpen"
						class="size-4 text-gray-500 dark:text-gray-400"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="m7 9 5 5 5-5" />
					</svg>
					<svg
						v-else
						class="size-4 text-gray-500 dark:text-gray-400"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="m7 15 5-5 5 5" />
					</svg>
				</div>
			</button>

			<!-- Dropdown Menu -->
			<div
				v-if="isDropdownOpen"
				class="absolute z-50 mt-2 w-full max-h-60 overflow-auto rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 shadow-lg"
			>
				<div
					v-for="option in options"
					:key="option.value"
					@click="toggleOption(option)"
					class="px-4 py-2 text-sm text-gray-800 dark:text-gray-200 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 flex justify-between items-center"
					:class="{ 'bg-gray-100 dark:bg-gray-700': isSelected(option) }"
				>
					<span>{{ option.label }}</span>
					<span v-if="isSelected(option)">
						<svg
							class="size-4 text-blue-600"
							xmlns="http://www.w3.org/2000/svg"
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
	id: String,
	options: {
		type: Array,
		required: true,
	},
	modelValue: {
		type: Array,
		default: () => [],
	},
	placeholder: String,
	disabled: Boolean,
});

const emit = defineEmits(["update:modelValue"]);
const isDropdownOpen = ref(false);
const selectedValues = ref([...props.modelValue]);
const dropdownRef = ref(null);

// Watch for changes to modelValue prop
watch(() => props.modelValue, (newValue) => {
	selectedValues.value = [...newValue];
}, { deep: true });

const toggleDropdown = () => {
	if (!props.disabled) {
		isDropdownOpen.value = !isDropdownOpen.value;
	}
};

const isSelected = (option) => {
	return selectedValues.value.some((opt) => opt.value === option.value);
};

const toggleOption = (option) => {
	const index = selectedValues.value.findIndex((opt) => opt.value === option.value);
	if (index === -1) {
		selectedValues.value.push(option);
	} else {
		selectedValues.value.splice(index, 1);
	}
	emit("update:modelValue", [...selectedValues.value]);
};

// Handle click outside
const handleClickOutside = (event) => {
	if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
		isDropdownOpen.value = false;
	}
};

onMounted(() => {
	document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
	document.removeEventListener("click", handleClickOutside);
});
</script>
