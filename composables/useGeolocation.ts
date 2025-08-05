export function useGeolocation() {
  const getLocationFromCoordinates = async (lat: number, lng: number) => {
    const apiKey = "37d2b3b104b0433f844bea6a7d52e312"; // Replace with your OpenCage API key
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat},${lng}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const components = data.results[0]?.components || {};
        const district = components.county || "Unknown District";
        const municipality = components.city || "Unknown Municipality";
		console.log("district", district)
		console.log("municipality", municipality)
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

  const getCurrentPosition = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser."));
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            reject(error);
          }
        );
      }
    });
  };

  return {
    getLocationFromCoordinates,
    getCurrentPosition,
  };
} 