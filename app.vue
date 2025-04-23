<template>
	<NuxtLayout>
	  <SplashScreen :src="'/favicon.ico'" :time="1000" width="100px" />
	  <NuxtLoadingIndicator />
	  <BuyMeACoffeeButton />
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
			// console.log("SW scope:", registration.scope);
		  } catch (error) {
			console.error(`SW registration failed: ${error}`);
		  }
		}
	  },
	},
  };
  </script>
  