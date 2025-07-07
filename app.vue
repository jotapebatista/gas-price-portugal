<template>
	<NuxtLayout>
	  <SplashScreen :time="1500" />
	  <NuxtLoadingIndicator />
	  <NuxtPage />
	</NuxtLayout>
  </template>
  
  <script>
  export default {
	mounted() {
	  this.registerServiceWorker();
	},
  
	methods: {
	  async registerServiceWorker() {
		const scope = ".";
		const workerPath = "worker.js";
  
		if ("serviceWorker" in navigator) {
		  try {
			const registration = await navigator.serviceWorker.register(workerPath, { scope });
			console.log("Service Worker registered successfully:", registration.scope);
		  } catch (error) {
			console.error(`Service Worker registration failed: ${error}`);
		  }
		}
	  },
	},
  };
  </script>
  