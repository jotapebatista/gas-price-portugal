<template>
	<div class="flex items-center space-x-3">
		<button
			class="relative inline-flex items-center h-7 w-14 rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
			:class="colorMode.preference === 'dark' ? 'bg-gray-800' : 'bg-yellow-400'"
			@click="toggleTheme"
			:title="colorMode.preference === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
		>
			<span
				class="absolute left-1 flex h-5 w-5 items-center justify-center transform rounded-full bg-white text-gray-800 shadow-md transition-all duration-300"
				:class="colorMode.preference === 'dark' ? 'translate-x-0' : 'translate-x-7'"
			>
				<span v-if="colorMode.preference === 'dark'">🌙</span>
				<span v-else>☀️</span>
			</span>
		</button>
	</div>
</template>

<script setup>
import { useColorMode } from '#imports'

const colorMode = useColorMode()

const toggleTheme = () => {
	colorMode.preference = colorMode.preference === 'dark' ? 'light' : 'dark'
}
</script>
