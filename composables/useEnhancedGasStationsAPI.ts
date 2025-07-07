export function useEnhancedGasStationsAPI() {
  const { fetchDistricts: originalFetchDistricts, fetchMunicipalities: originalFetchMunicipalities, fetchFuelTypes: originalFetchFuelTypes, fetchStations: originalFetchStations } = useGasStationsAPI();
  const { 
    storeDistricts, 
    storeMunicipalities, 
    storeFuelTypes, 
    storeGasStations,
    getDistricts, 
    getMunicipalities, 
    getFuelTypes, 
    getGasStations,
    isDataCached,
    getLastUpdated,
    isIndexedDBAvailable
  } = useOfflineData();

  const isOnline = ref(true); // Default to true for SSR
  const isInitialized = ref(false);

  // Listen for online/offline changes
  onMounted(() => {
    // Set initial online status
    isOnline.value = navigator.onLine;
    
    // Add event listeners
    window.addEventListener('online', () => isOnline.value = true);
    window.addEventListener('offline', () => isOnline.value = false);
  });

  // Enhanced fetch with offline fallback
  const enhancedFetch = async (url: string, options?: RequestInit) => {
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        return response;
      }
      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      if (process.client && !isOnline.value) {
        throw new Error('OFFLINE');
      }
      throw error;
    }
  };

  // Fetch districts with caching
  const fetchDistricts = async () => {
    try {
      // Try to fetch from API if online
      if (process.client && isOnline.value) {
        const response = await enhancedFetch('https://precoscombustiveis.dgeg.gov.pt/api/PrecoComb/GetDistritos');
        const data = await response.json();
        
        // Cache the data if IndexedDB is available
        try {
          if (isIndexedDBAvailable()) {
            await storeDistricts(data.resultado || []);
          }
        } catch (cacheError) {
          console.warn('Failed to cache districts:', cacheError);
        }
        
        return data;
      } else {
        // Return cached data if offline
        try {
          const cachedData = await getDistricts();
          return { resultado: cachedData };
        } catch (cacheError) {
          console.warn('Failed to get cached districts:', cacheError);
          return { resultado: [] };
        }
      }
    } catch (error) {
      console.warn('Failed to fetch districts from API:', error);
      // Fallback to cached data
      try {
        const cachedData = await getDistricts();
        return { resultado: cachedData };
      } catch (cacheError) {
        console.warn('Failed to get cached districts:', cacheError);
        return { resultado: [] };
      }
    }
  };

  // Fetch municipalities with caching
  const fetchMunicipalities = async (districtId: number) => {
    try {
      if (process.client && isOnline.value) {
        const response = await enhancedFetch(`https://precoscombustiveis.dgeg.gov.pt/api/PrecoComb/GetMunicipios?idDistrito=${districtId}`);
        const data = await response.json();
        
        // Cache the data if IndexedDB is available
        try {
          if (isIndexedDBAvailable()) {
            await storeMunicipalities(data.resultado || []);
          }
        } catch (cacheError) {
          console.warn('Failed to cache municipalities:', cacheError);
        }
        
        return data;
      } else {
        try {
          const cachedData = await getMunicipalities();
          return { resultado: cachedData };
        } catch (cacheError) {
          console.warn('Failed to get cached municipalities:', cacheError);
          return { resultado: [] };
        }
      }
    } catch (error) {
      console.warn('Failed to fetch municipalities from API:', error);
      try {
        const cachedData = await getMunicipalities();
        return { resultado: cachedData };
      } catch (cacheError) {
        console.warn('Failed to get cached municipalities:', cacheError);
        return { resultado: [] };
      }
    }
  };

  // Fetch fuel types with caching
  const fetchFuelTypes = async () => {
    try {
      if (process.client && isOnline.value) {
        const response = await enhancedFetch('https://precoscombustiveis.dgeg.gov.pt/api/PrecoComb/GetTiposCombustiveis?idTipoCombustivel=&fl_viewWebSite=true&fl_ativo=true');
        const data = await response.json();
        
        // Cache the data if IndexedDB is available
        if (isIndexedDBAvailable()) {
          await storeFuelTypes(data.resultado || []);
        }
        return data.resultado || [];
      } else {
        return await getFuelTypes();
      }
    } catch (error) {
      return await getFuelTypes();
    }
  };

  // Fetch stations with caching
  const fetchStations = async (params: {
    idsTiposComb?: number;
    idDistrito?: number;
    idsMunicipios?: number[];
    pagina?: number;
  }) => {
    const { idsMunicipios } = params;
    
    try {
      if (process.client && isOnline.value) {
        const urlParams = new URLSearchParams({
          idsTiposComb: (params.idsTiposComb || 3201).toString(),
          idDistrito: (params.idDistrito || 1).toString(),
          idsMunicipios: idsMunicipios?.join(',') || '',
          qtdPorPagina: '50',
          pagina: (params.pagina || 1).toString()
        });
        
        const response = await enhancedFetch(`https://precoscombustiveis.dgeg.gov.pt/api/PrecoComb/PesquisarPostos?${urlParams}`);
        const data = await response.json();
        
        // Cache the data for each municipality if IndexedDB is available
        if (isIndexedDBAvailable() && idsMunicipios && idsMunicipios.length > 0) {
          for (const municipalityId of idsMunicipios) {
            await storeGasStations(municipalityId, data.resultado || []);
          }
        }
        
        return data;
      } else {
        // Return cached data for the first municipality
        if (idsMunicipios && idsMunicipios.length > 0) {
          const cachedData = await getGasStations(idsMunicipios[0]);
          return { resultado: cachedData };
        }
        return { resultado: [] };
      }
    } catch (error) {
      // Fallback to cached data
      if (idsMunicipios && idsMunicipios.length > 0) {
        const cachedData = await getGasStations(idsMunicipios[0]);
        return { resultado: cachedData };
      }
      return { resultado: [] };
    }
  };

  // Pre-load all data for offline functionality
  const preloadAllData = async (progressCallback?: (progress: number) => void) => {
    try {
      // Ensure database is available
      if (!isIndexedDBAvailable()) {
        console.warn('IndexedDB not available, skipping preload');
        return false;
      }
      
      let progress = 0;
      
      // 1. Load districts
      progressCallback?.(progress += 10);
      const districtsResponse = await fetchDistricts();
      const districts = districtsResponse.resultado || [];
      
      // 2. Load fuel types
      progressCallback?.(progress += 10);
      const fuelTypes = await fetchFuelTypes();
      
      // 3. Load municipalities for each district
      progressCallback?.(progress += 20);
      const allMunicipalities = [];
      for (const district of districts) {
        const municipalitiesResponse = await fetchMunicipalities(district.Id);
        const municipalities = municipalitiesResponse.resultado || [];
        allMunicipalities.push(...municipalities);
      }
      
      // 4. Load gas stations for each municipality (this will take time)
      const totalMunicipalities = allMunicipalities.length;
      let processed = 0;
      
      for (const municipality of allMunicipalities) {
        try {
          await fetchStations({
            idDistrito: municipality.IdDistrito,
            idsMunicipios: [municipality.Id],
            idsTiposComb: 3201 // Default fuel type
          });
          
          processed++;
          const currentProgress = 60 + (processed / totalMunicipalities) * 40;
          progressCallback?.(Math.min(currentProgress, 100));
        } catch (error) {
          // Continue with next municipality if one fails
          processed++;
        }
      }
      
      isInitialized.value = true;
      return true;
    } catch (error) {
      console.error('Error preloading data:', error);
      return false;
    }
  };

  // Check if data is available offline
  const isDataAvailableOffline = async () => {
    try {
      if (!isIndexedDBAvailable()) {
        return false;
      }
      const hasDistricts = await isDataCached('districts');
      const hasFuelTypes = await isDataCached('fuelTypes');
      return hasDistricts && hasFuelTypes;
    } catch (error) {
      console.warn('Error checking offline data availability:', error);
      return false;
    }
  };

  return {
    fetchDistricts,
    fetchMunicipalities,
    fetchFuelTypes,
    fetchStations,
    preloadAllData,
    isDataAvailableOffline,
    isOnline: readonly(isOnline),
    isInitialized: readonly(isInitialized)
  };
} 