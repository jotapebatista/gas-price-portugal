interface FavoriteStation {
  id: number;
  nome: string;
  morada: string;
  codigoPostal: string;
  localidade: string;
  latitude: number;
  longitude: number;
  marca: string;
  municipio: string;
  distrito: string;
  combustiveis: {
    tipo: string;
    preco: number;
    dataAtualizacao: string;
  }[];
  addedAt: string;
}

export const useFavorites = () => {
  const favorites = ref<FavoriteStation[]>([])

  // Load favorites from localStorage on client side
  const loadFavorites = () => {
    if (process.client) {
      try {
        const stored = localStorage.getItem('gas-station-favorites')
        if (stored) {
          favorites.value = JSON.parse(stored)
        }
      } catch (error) {
        favorites.value = []
      }
    }
  }

  // Save favorites to localStorage
  const saveFavorites = () => {
    if (process.client) {
      try {
        localStorage.setItem('gas-station-favorites', JSON.stringify(favorites.value))
      } catch (error) {
        // Error saving favorites
      }
    }
  }

  // Add station to favorites with full station data
  const addFavorite = (station: any) => {
    const existing = favorites.value.find(f => f.id === station.id)
    if (!existing) {
      favorites.value.push({
        ...station,
        addedAt: new Date().toISOString()
      })
      saveFavorites()
    }
  }

  // Remove station from favorites
  const removeFavorite = (stationId: number) => {
    favorites.value = favorites.value.filter(f => f.id !== stationId)
    saveFavorites()
  }

  // Check if station is favorited
  const isFavorite = (stationId: number) => {
    return favorites.value.some(f => f.id === stationId)
  }

  // Toggle favorite status
  const toggleFavorite = (station: any) => {
    if (isFavorite(station.id)) {
      removeFavorite(station.id)
    } else {
      addFavorite(station)
    }
  }

  // Get favorite count
  const favoriteCount = computed(() => favorites.value.length)

  // Get favorite stations (now independent of current search results)
  const favoriteStations = computed(() => favorites.value)

  // Load favorites on mount
  onMounted(() => {
    loadFavorites()
  })

  return {
    favorites: readonly(favorites),
    favoriteStations: readonly(favoriteStations),
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    favoriteCount
  }
} 