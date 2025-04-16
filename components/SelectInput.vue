<template>
	<div class="w-full max-w-sm">
		<label
			:for="id"
			class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
		>
			{{ label }}
		</label>
		<div class="relative w-full" ref="dropdownRef">
			<!-- Custom Dropdown Button -->
			<button
				type="button"
				class="relative py-2.5 px-4 pe-9 w-full text-left bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-base text-gray-800 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
				@click="toggleDropdown"
			>
				<span v-if="!selectedLabel">
					{{ placeholder || 'Select an option...' }}
				</span>
				<span v-else>
					{{ selectedLabel }}
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
					@click="selectOption(option)"
					class="px-4 py-2 text-sm text-gray-800 dark:text-gray-200 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
					:class="{ 'bg-gray-100 dark:bg-gray-700': modelValue === option.value }"
				>
					{{ option.label }}
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>


const props = defineProps({
	label: String,
	id: String,
	options: Array,
	placeholder: String,
	modelValue: [String, Number, Boolean],
	disabled: Boolean,
});

const emit = defineEmits(['update:modelValue']);
const isDropdownOpen = ref(false);
const dropdownRef = ref(null);

const toggleDropdown = () => {
	if (!props.disabled) {
		isDropdownOpen.value = !isDropdownOpen.value;
	}
};

const selectOption = (option) => {
	emit('update:modelValue', option.value);
	isDropdownOpen.value = false;
};

const selectedLabel = computed(() => {
	const found = props.options.find((opt) => opt.value === props.modelValue);
	return found ? found.label : '';
});

// Custom onClickOutside handler
const handleClickOutside = (event) => {
	if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
		isDropdownOpen.value = false;
	}
};

onMounted(() => {
	document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
	document.removeEventListener('click', handleClickOutside);
});
</script>
