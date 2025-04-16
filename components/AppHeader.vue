<template>
	<header class="sticky top-0 z-40 backdrop-blur-md bg-slate-900/80">
	  <nav class="max-w-7xl mx-auto flex items-center justify-between p-5">
		<div class="flex items-center space-x-5">
		  <NuxtLink to="/">
			<img src="/logo.png" alt="Logo" class="w-10 h-10" />
		  </NuxtLink>
  
		  <ul class="hidden lg:flex space-x-5 items-center">
			<li>
			  <NuxtLink class="hover:text-white" to="/about">
				About this app
			  </NuxtLink>
			</li>
		  </ul>
		</div>
  
		<Switch class="hidden lg:flex" />
  
		<!-- Burger icon -->
		<button @click="menuOpen = true" class="lg:hidden focus:outline-none">
		  <Icon name="mingcute:menu-line" class="text-gray-200 w-7 h-7" />
		</button>
	  </nav>
  
	  <MobileMenu :open="menuOpen" @close="menuOpen = false" />
	</header>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import MobileMenu from './MobileMenu.vue'
  
  const menuOpen = ref(false)
  </script>
  