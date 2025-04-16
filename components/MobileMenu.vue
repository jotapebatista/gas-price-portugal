<template>
	<teleport to="body">
	  <transition name="fade-slide">
		<div
		  v-if="open"
		  class="fixed inset-0 z-50 bg-black/50 flex justify-end"
		  @click.self="$emit('close')"
		>
		  <nav
			class="w-64 bg-slate-800 text-white h-full shadow-lg p-5 flex flex-col space-y-4"
		  >
			<NuxtLink
			  to="/"
			  class="py-2 px-4 rounded transition hover:bg-slate-700"
			  :class="{ 'bg-slate-700': $route.path === '/' }"
			  @click="$emit('close')"
			>
			  Home
			</NuxtLink>
			<NuxtLink
			  to="/about"
			  class="py-2 px-4 rounded transition hover:bg-slate-700"
			  :class="{ 'bg-slate-700': $route.path === '/about' }"
			  @click="$emit('close')"
			>
			  About
			</NuxtLink>
		  </nav>
		</div>
	  </transition>
	</teleport>
  </template>
  
  <script setup>
  defineProps({ open: Boolean })
  defineEmits(['close'])
  </script>
  
  <style scoped>
  .fade-slide-enter-active,
  .fade-slide-leave-active {
	transition: all 0.3s ease;
  }
  .fade-slide-enter-from {
	opacity: 0;
	transform: translateX(100%);
  }
  .fade-slide-enter-to {
	opacity: 1;
	transform: translateX(0%);
  }
  .fade-slide-leave-from {
	opacity: 1;
	transform: translateX(0%);
  }
  .fade-slide-leave-to {
	opacity: 0;
	transform: translateX(100%);
  }
  </style>
  