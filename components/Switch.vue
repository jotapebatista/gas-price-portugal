<template>
	<button
		@click="toggle"
		class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
		:class="modelValue ? 'bg-primary-600' : 'bg-neutral-200 dark:bg-neutral-700'"
	>
		<span
			class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
			:class="modelValue ? 'translate-x-6' : 'translate-x-1'"
		/>
	</button>
</template>

<script setup>
const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false
	}
});

const emit = defineEmits(['update:modelValue']);

const toggle = () => {
	emit('update:modelValue', !props.modelValue);
};
</script>
