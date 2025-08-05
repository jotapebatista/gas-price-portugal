interface FavoriteStation {
  id: number;
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
        console.error('Error loading favorites:', error)
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
        console.error('Error saving favorites:', error)
      }
    }
  }

  // Add station to favorites
  const addFavorite = (stationId: number) => {
    const existing = favorites.value.find(f => f.id === stationId)
    if (!existing) {
      favorites.value.push({
        id: stationId,
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
  const toggleFavorite = (stationId: number) => {
    if (isFavorite(stationId)) {
      removeFavorite(stationId)
    } else {
      addFavorite(stationId)
    }
  }

  // Get favorite count
  const favoriteCount = computed(() => favorites.value.length)

  // Load favorites on mount
  onMounted(() => {
    loadFavorites()
  })

  return {
    favorites: readonly(favorites),
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    favoriteCount
  }
} 