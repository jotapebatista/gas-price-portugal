<template>
	<div
		class="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg space-y-6 animate-fade-in"
	>
		<div class="space-y-2 text-center">
			<h3 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
				<!-- <LocateFixed class="w-6 h-6 text-blue-600 dark:text-blue-400" /> -->
				Use Your Geolocation?
			</h3>
			<p class="text-gray-600 dark:text-gray-300">
				Allow us to detect your location to show gas stations near you.
			</p>
		</div>

		<div class="flex flex-col sm:flex-row gap-3 justify-center">
			<button
				@click="getGeolocation"
				class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
			>
				Yes, Use My Location
			</button>
			<button
				@click="skipGeolocation"
				class="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition"
			>
				No, I’ll Select Manually
			</button>
		</div>
	</div>
</template>

<script setup>
import Cookies from "js-cookie";

const emit = defineEmits(["useGeolocation", "skipGeolocation"]);

onMounted(async () => {
	const userChoice = Cookies.get("geolocationPreference");

	if (userChoice === "yes" && navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(async (position) => {
			const { latitude, longitude } = position.coords;
			const locationData = await getLocationFromCoordinates(latitude, longitude);

			emit("useGeolocation", {
				latitude,
				longitude,
				district: locationData.district,
				municipality: locationData.municipality,
			});
		});
	} else if (userChoice === "no") {
		emit("skipGeolocation");
	}
});

const getGeolocation = () => {
	if (!navigator.geolocation) {
		alert("Geolocation is not supported by your browser.");
		return;
	}

	navigator.geolocation.getCurrentPosition(
		async (position) => {
			const { latitude, longitude } = position.coords;

			if (latitude && longitude) {
				Cookies.set("geolocationPreference", "yes", { expires: 365 });

				const locationData = await getLocationFromCoordinates(latitude, longitude);

				emit("useGeolocation", {
					latitude,
					longitude,
					district: locationData.district,
					municipality: locationData.municipality,
				});
			} else {
				console.error("Invalid geolocation data");
			}
		},
		(error) => {
			console.error("Error getting geolocation:", error);
			alert("Could not retrieve your location. Please try again.");
		}
	);
};

const skipGeolocation = () => {
	Cookies.set("geolocationPreference", "no", { expires: 365 });
	emit("skipGeolocation");
};
</script>

<style scoped>
@keyframes fade-in {
	from {
		opacity: 0;
		transform: translateY(20px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.animate-fade-in {
	animation: fade-in 0.4s ease-out;
}
</style>
