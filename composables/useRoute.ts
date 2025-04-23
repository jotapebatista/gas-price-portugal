const API_KEY = '5b3ce3597851110001cf6248a846f669ead540f2bc15925173aa55e2';

export async function getTravelDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
	const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${API_KEY}`;
	const body = {
		coordinates: [
			[lon1, lat1],
			[lon2, lat2]
		]
	};

	const res = await axios.post(url, body);
	const summary = res.data.features[0].properties.summary;

	return {
		distanceKm: summary.distance / 1000,
		durationMin: summary.duration / 60,
		geometry: res.data.features[0].geometry,
	};
}
