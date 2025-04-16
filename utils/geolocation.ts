export const getLocationFromCoordinates = async (lat: number, lng: number) => {
	const apiKey = "37d2b3b104b0433f844bea6a7d52e312"; // Replace with your OpenCage API key
	const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat},${lng}&key=${apiKey}`;

	try {
		const response = await fetch(url);
		const data = await response.json();

		if (data.results && data.results.length > 0) {
			const district =
				data.results[0]?.components?.county || "Unknown District";
			const municipality =
				data.results[0]?.components?.city || "Unknown Municipality";
			return { district, municipality };
		} else {
			return {
				district: "Unknown District",
				municipality: "Unknown Municipality",
			};
		}
	} catch (error) {
		console.error("Error fetching geolocation data:", error);
		return { district: "Error", municipality: "Error" };
	}
};
