<template>
	<div
		class="flex flex-col items-center justify-center p-6 space-y-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md"
	>
		<h3 class="text-xl font-semibold text-gray-800 dark:text-white">
			Use Your Geolocation?
		</h3>
		<p class="text-gray-700 dark:text-gray-300">
			We can automatically detect your location. Do you want to use it for
			finding nearby gas stations?
		</p>
		<div class="flex space-x-4">
			<button
				@click="getGeolocation"
				class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
			>
				Yes, Use My Location
			</button>
			<button
				@click="skipGeolocation"
				class="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md"
			>
				No, I’ll Select Manually
			</button>
		</div>
	</div>
</template>
<script setup>
import Cookies from "js-cookie";

// Emit events to handle user's response
const emit = defineEmits(["useGeolocation", "skipGeolocation"]);

// Check if the user has already made a choice
onMounted(async () => {
	const userChoice = Cookies.get("geolocationPreference");

	if (userChoice === "yes") {
		// Try to get location again
		if (navigator.geolocation) {
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
		}
	} else if (userChoice === "no") {
		emit("skipGeolocation");
	}
});

// const userChoice = Cookies.get("geolocationPreference");

const getGeolocation = () => {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(
			async (position) => {
				// console.log("Geolocation position: ", position);
				const { latitude, longitude } = position.coords;

				// Check if lat and lng are valid
				if (latitude && longitude) {
					// console.log("Geolocation retrieved: ", latitude, longitude);

					// Save preference in cookie
					Cookies.set("geolocationPreference", "yes", {
						expires: 365,
					});

					// Get district and municipality using reverse geocoding
					const locationData = await getLocationFromCoordinates(
						latitude,
						longitude
					);

					// Send geolocation data (latitudeitude, longitude, district, municipality) back to parent
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
	} else {
		alert("Geolocation is not supported by your browser.");
	}
};

const skipGeolocation = () => {
	Cookies.set("geolocationPreference", "no", { expires: 365 });

	emit("skipGeolocation");
};
</script>
