const API_KEY = '5b3ce3597851110001cf6248a846f669ead540f2bc15925173aa55e2';

export async function getTravelDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
	const url = 'https://api.openrouteservice.org/v2/directions/driving-car';

	try {
		const result = await $fetch(url, {
			method: 'POST',
			headers: {
				'Authorization': API_KEY,
				'Content-Type': 'application/json',
			},
			body: {
				coordinates: [
					[lon1, lat1],
					[lon2, lat2]
				]
			}
		});

		console.log('API result:', result);

		if (!result?.routes?.length) {
			throw new Error('Invalid response: No route data returned.');
		}

		const route = result.routes[0];
		const summary = route.summary;

		return {
			distanceKm: summary.distance / 1000,
			durationMin: summary.duration / 60,
			geometry: route.geometry,
		};

	} catch (error) {
		console.error('Error in getTravelDistance:', error);
		return null;
	}
}
