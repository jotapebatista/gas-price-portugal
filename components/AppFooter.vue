<template>
	<footer class="w-full border-t border-1 border-dashed p-5 dark:border-gray-600">
		<div class="flex max-w-7xl mx-auto justify-between items-center">
			<p>© jotapbatista {{ new Date().getFullYear() }}</p>

			<div id="social" class="flex items-center dark:text-gray-200 text-gray-700">
				<NuxtLink
					to="https://github.com/jotapbatista"
					target="_blank"
					rel="noopener noreferrer"
					aria-label="GitHub"
				>
					<Icon name="uil:github-alt" class="w-5 h-5 m-2" />
				</NuxtLink>
				<NuxtLink
					to="https://www.linkedin.com/in/jotapbatista"
					target="_blank"
					rel="noopener noreferrer"
					aria-label="LinkedIn"
				>
					<Icon name="mingcute:linkedin-fill" class="w-6 h-6 m-2" />
				</NuxtLink>
			</div>
		</div>
	</footer>
</template>
