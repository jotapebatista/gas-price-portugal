export function useOfflineData() {
  const dbName = 'GasAppDB';
  const dbVersion = 2; // Force upgrade to create appData store
  const storeName = 'gasStations';
  
  let db: IDBDatabase | null = null;

  // Make deleteDatabase available globally for debugging
  if (process.client) {
    (window as any).clearGasAppDatabase = async () => {
      const { deleteDatabase } = useOfflineData();
      try {
        await deleteDatabase();
        console.log('Database cleared successfully');
        window.location.reload();
      } catch (error) {
        console.error('Failed to clear database:', error);
      }
    };
  }

  // Check if IndexedDB is available
  const isIndexedDBAvailable = () => {
    return process.client && typeof window !== 'undefined' && 'indexedDB' in window;
  };

  // Initialize IndexedDB
  const initDB = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        if (!isIndexedDBAvailable()) {
          reject(new Error('IndexedDB is not available'));
          return;
        }
        
        const request = indexedDB.open(dbName, dbVersion);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          db = request.result;
          
          // Verify that all required stores exist
          if (!db.objectStoreNames.contains(storeName) || !db.objectStoreNames.contains('appData')) {
            // Close the database and delete it to force recreation
            db.close();
            const deleteRequest = indexedDB.deleteDatabase(dbName);
            
            deleteRequest.onerror = () => reject(deleteRequest.error);
            deleteRequest.onsuccess = () => {
              // Try to open again
              const retryRequest = indexedDB.open(dbName, dbVersion);
              retryRequest.onerror = () => reject(retryRequest.error);
              retryRequest.onsuccess = () => {
                db = retryRequest.result;
                resolve();
              };
              retryRequest.onupgradeneeded = (event) => {
                const database = (event.target as IDBOpenDBRequest).result;
                
                // Create object store for gas stations data
                if (!database.objectStoreNames.contains(storeName)) {
                  const store = database.createObjectStore(storeName, { keyPath: 'id' });
                  store.createIndex('municipality', 'municipality', { unique: false });
                  store.createIndex('district', 'district', { unique: false });
                  store.createIndex('lastUpdated', 'lastUpdated', { unique: false });
                }
                
                // Create object store for app data
                if (!database.objectStoreNames.contains('appData')) {
                  const appDataStore = database.createObjectStore('appData', { keyPath: 'key' });
                }
              };
            };
            return;
          }
          
          resolve();
        };
        
        request.onupgradeneeded = (event) => {
          const database = (event.target as IDBOpenDBRequest).result;
          
          // Create object store for gas stations data
          if (!database.objectStoreNames.contains(storeName)) {
            const store = database.createObjectStore(storeName, { keyPath: 'id' });
            store.createIndex('municipality', 'municipality', { unique: false });
            store.createIndex('district', 'district', { unique: false });
            store.createIndex('lastUpdated', 'lastUpdated', { unique: false });
          }
          
          // Create object store for app data
          if (!database.objectStoreNames.contains('appData')) {
            const appDataStore = database.createObjectStore('appData', { keyPath: 'key' });
          }
        };
      } catch (error) {
        reject(error);
      }
    });
  };

  // Store districts data
  const storeDistricts = async (districts: any[]): Promise<void> => {
    try {
      if (!db) await initDB();
      return new Promise((resolve, reject) => {
        const transaction = db!.transaction(['appData'], 'readwrite');
        const store = transaction.objectStore('appData');
        const request = store.put({
          key: 'districts',
          data: districts,
          lastUpdated: new Date().toISOString()
        });
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.warn('Error storing districts in IndexedDB:', error);
      throw error;
    }
  };

  // Store municipalities data
  const storeMunicipalities = async (municipalities: any[]): Promise<void> => {
    try {
      if (!db) await initDB();
      return new Promise((resolve, reject) => {
        const transaction = db!.transaction(['appData'], 'readwrite');
        const store = transaction.objectStore('appData');
        const request = store.put({
          key: 'municipalities',
          data: municipalities,
          lastUpdated: new Date().toISOString()
        });
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.warn('Error storing municipalities in IndexedDB:', error);
      throw error;
    }
  };

  // Store fuel types data
  const storeFuelTypes = async (fuelTypes: any[]): Promise<void> => {
    try {
      if (!db) await initDB();
      return new Promise((resolve, reject) => {
        const transaction = db!.transaction(['appData'], 'readwrite');
        const store = transaction.objectStore('appData');
        const request = store.put({
          key: 'fuelTypes',
          data: fuelTypes,
          lastUpdated: new Date().toISOString()
      });
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.warn('Error storing fuel types in IndexedDB:', error);
      throw error;
    }
  };

  // Store gas stations data for a municipality
  const storeGasStations = async (municipalityId: number, stations: any[]): Promise<void> => {
    try {
      if (!db) await initDB();
      return new Promise((resolve, reject) => {
        const transaction = db!.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put({
          id: `municipality_${municipalityId}`,
          municipality: municipalityId,
          data: stations,
          lastUpdated: new Date().toISOString()
        });
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.warn('Error storing gas stations in IndexedDB:', error);
      throw error;
    }
  };

  // Get districts data
  const getDistricts = async (): Promise<any[]> => {
    try {
      if (!db) await initDB();
      return new Promise((resolve, reject) => {
        try {
          const transaction = db!.transaction(['appData'], 'readonly');
          const store = transaction.objectStore('appData');
          const request = store.get('districts');
          
          request.onsuccess = () => {
            resolve(request.result?.data || []);
          };
          request.onerror = () => reject(request.error);
        } catch (transactionError) {
          reject(transactionError);
        }
      });
    } catch (error) {
      console.warn('Error getting districts from IndexedDB:', error);
      return [];
    }
  };

  // Get municipalities data
  const getMunicipalities = async (): Promise<any[]> => {
    try {
      if (!db) await initDB();
      return new Promise((resolve, reject) => {
        const transaction = db!.transaction(['appData'], 'readonly');
        const store = transaction.objectStore('appData');
        const request = store.get('municipalities');
        
        request.onsuccess = () => {
          resolve(request.result?.data || []);
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.warn('Error getting municipalities from IndexedDB:', error);
      return [];
    }
  };

  // Get fuel types data
  const getFuelTypes = async (): Promise<any[]> => {
    try {
      if (!db) await initDB();
      return new Promise((resolve, reject) => {
        const transaction = db!.transaction(['appData'], 'readonly');
        const store = transaction.objectStore('appData');
        const request = store.get('fuelTypes');
        
        request.onsuccess = () => {
          resolve(request.result?.data || []);
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.warn('Error getting fuel types from IndexedDB:', error);
      return [];
    }
  };

  // Get gas stations data for a municipality
  const getGasStations = async (municipalityId: number): Promise<any[]> => {
    try {
      if (!db) await initDB();
      return new Promise((resolve, reject) => {
        const transaction = db!.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(`municipality_${municipalityId}`);
        
        request.onsuccess = () => {
          resolve(request.result?.data || []);
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.warn('Error getting gas stations from IndexedDB:', error);
      return [];
    }
  };

  // Get all cached municipalities
  const getAllCachedMunicipalities = async (): Promise<any[]> => {
    try {
      if (!db) await initDB();
      return new Promise((resolve, reject) => {
        const transaction = db!.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();
        
        request.onsuccess = () => {
          resolve(request.result || []);
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.warn('Error getting all cached municipalities from IndexedDB:', error);
      return [];
    }
  };

  // Check if data is cached
  const isDataCached = async (key: string): Promise<boolean> => {
    try {
      if (!db) await initDB();
      return new Promise((resolve, reject) => {
        const transaction = db!.transaction(['appData'], 'readonly');
        const store = transaction.objectStore('appData');
        const request = store.get(key);
        
        request.onsuccess = () => {
          resolve(!!request.result);
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.warn('Error checking if data is cached:', error);
      return false;
    }
  };

  // Get last update time
  const getLastUpdated = async (key: string): Promise<string | null> => {
    try {
      if (!db) await initDB();
      return new Promise((resolve, reject) => {
        const transaction = db!.transaction(['appData'], 'readonly');
        const store = transaction.objectStore('appData');
        const request = store.get(key);
        
        request.onsuccess = () => {
          resolve(request.result?.lastUpdated || null);
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.warn('Error getting last updated time:', error);
      return null;
    }
  };

  // Clear all cached data
  const clearAllData = async (): Promise<void> => {
    try {
      if (!db) await initDB();
      return new Promise((resolve, reject) => {
        const transaction = db!.transaction([storeName, 'appData'], 'readwrite');
        
        // Clear gas stations
        const stationsStore = transaction.objectStore(storeName);
        const stationsRequest = stationsStore.clear();
        
        // Clear app data
        const appDataStore = transaction.objectStore('appData');
        const appDataRequest = appDataStore.clear();
        
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      });
    } catch (error) {
      console.warn('Error clearing all data from IndexedDB:', error);
      throw error;
    }
  };

  // Delete database completely (for troubleshooting)
  const deleteDatabase = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        if (db) {
          db.close();
          db = null;
        }
        
        if (!isIndexedDBAvailable()) {
          reject(new Error('IndexedDB is not available'));
          return;
        }
        
        const deleteRequest = indexedDB.deleteDatabase(dbName);
        deleteRequest.onerror = () => reject(deleteRequest.error);
        deleteRequest.onsuccess = () => resolve();
      } catch (error) {
        reject(error);
      }
    });
  };

  return {
    initDB,
    isIndexedDBAvailable,
    storeDistricts,
    storeMunicipalities,
    storeFuelTypes,
    storeGasStations,
    getDistricts,
    getMunicipalities,
    getFuelTypes,
    getGasStations,
    getAllCachedMunicipalities,
    isDataCached,
    getLastUpdated,
    clearAllData,
    deleteDatabase
  };
} 