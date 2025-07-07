export function useUserPreferences() {
  const STORAGE_KEY = 'gasapp-preferences';
  
  // Default preferences
  const defaultPreferences = {
    appMode: 'offline', // 'offline' | 'live'
    geolocationEnabled: false,
    theme: 'system', // 'light' | 'dark' | 'system'
    firstLaunch: true,
    dataPreloaded: false
  };

  // Reactive preferences
  const preferences = ref(defaultPreferences);

  // Load preferences from localStorage
  const loadPreferences = () => {
    if (process.client) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          preferences.value = { ...defaultPreferences, ...parsed };
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    }
  };

  // Save preferences to localStorage
  const savePreferences = () => {
    if (process.client) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences.value));
      } catch (error) {
        console.error('Error saving preferences:', error);
      }
    }
  };

  // Update a specific preference
  const updatePreference = (key: keyof typeof defaultPreferences, value: string | boolean) => {
    (preferences.value as any)[key] = value;
    savePreferences();
  };

  // Set app mode
  const setAppMode = (mode: 'offline' | 'live') => {
    updatePreference('appMode', mode);
  };

  // Set geolocation preference
  const setGeolocationEnabled = (enabled: boolean) => {
    updatePreference('geolocationEnabled', enabled);
  };

  // Set theme preference
  const setTheme = (theme: 'light' | 'dark' | 'system') => {
    updatePreference('theme', theme);
  };

  // Mark first launch as completed
  const completeFirstLaunch = () => {
    updatePreference('firstLaunch', false);
  };

  // Mark data as preloaded
  const markDataPreloaded = () => {
    updatePreference('dataPreloaded', true);
  };

  // Check if user has completed first launch
  const hasCompletedFirstLaunch = computed(() => !preferences.value.firstLaunch);

  // Check if data has been preloaded
  const isDataPreloaded = computed(() => preferences.value.dataPreloaded);

  // Get current app mode
  const getAppMode = computed(() => preferences.value.appMode);

  // Get geolocation preference
  const getGeolocationEnabled = computed(() => preferences.value.geolocationEnabled);

  // Get theme preference
  const getTheme = computed(() => preferences.value.theme);

  // Load preferences on mount
  onMounted(() => {
    loadPreferences();
  });

  return {
    preferences: readonly(preferences),
    setAppMode,
    setGeolocationEnabled,
    setTheme,
    completeFirstLaunch,
    markDataPreloaded,
    hasCompletedFirstLaunch,
    isDataPreloaded,
    getAppMode,
    getGeolocationEnabled,
    getTheme,
    updatePreference
  };
} 