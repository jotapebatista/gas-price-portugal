<template>
	<div class="flex items-center">
		<div
			class="dark:bg-gray-700 bg-gray-200 switcher relative inline-flex h-[24px] w-[56px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
			@click="toggleTheme"
		>
			<span class="sr-only">Use setting</span>
			<span
				aria-hidden="true"
				:class="
					colorMode.preference === 'dark'
						? 'translate-x-0'
						: 'translate-x-8'
				"
				class="pointer-events-none inline-block h-[20px] w-[21px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
			/>
		</div>
	</div>
</template>

<script setup>
import { useColorMode } from '#imports'

const colorMode = useColorMode()

const toggleTheme = () => {
	colorMode.preference = colorMode.preference === 'dark' ? 'light' : 'dark'
}
</script>
