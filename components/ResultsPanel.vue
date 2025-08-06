<template>
  <div class="h-full bg-white dark:bg-gray-900 overflow-y-auto">
    <div class="p-4">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ $t("results") }}
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ $t("foundStations", { count: stations.length }) }}
          </p>
        </div>
        <div class="flex items-center space-x-2">
          <button
            @click="goToFilters"
            class="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            :title="$t('modifySearch')"
          >
            <Icon name="heroicons:funnel" class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Success Message -->
      <div v-if="showSuccessMessage" class="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <div class="flex items-center">
          <Icon name="heroicons:check-circle" class="w-5 h-5 text-green-500 mr-2" />
          <span class="text-sm text-green-700 dark:text-green-300">
            {{ $t("searchSuccess", { count: stations.length }) }}
          </span>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="text-center">
          <div class="mx-auto h-12 w-12 text-blue-500 mb-4">
            <Icon name="heroicons:arrow-path" class="animate-spin w-12 h-12" />
          </div>
          <p class="text-gray-600 dark:text-gray-400">{{ $t("searching") }}</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="stations.length === 0 && !loading" class="flex items-center justify-center py-12">
        <div class="text-center">
          <div class="mx-auto h-16 w-16 text-gray-400 mb-4">
            <Icon name="heroicons:document-magnifying-glass" class="w-16 h-16" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {{ $t("noResults") }}
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {{ $t("noResultsDescription") }}
          </p>
          <button
            @click="goToFilters"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {{ $t("modifySearch") }}
          </button>
        </div>
      </div>

      <!-- Results List -->
      <div v-else class="space-y-3">
        <div
          v-for="station in sortedStations"
          :key="station.id"
          class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <!-- Station Header -->
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1">
              <h4 class="font-semibold text-gray-900 dark:text-white text-base">
                {{ station.nome }}
              </h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ station.marca }}
              </p>
            </div>
            <div class="flex items-center space-x-2">
              <!-- Favorite Button -->
              <button
                @click="toggleFavorite(station.id)"
                class="p-2 transition-colors"
                :class="isFavorite(station.id) 
                  ? 'text-red-500 hover:text-red-600' 
                  : 'text-gray-400 hover:text-red-500'"
                :title="isFavorite(station.id) ? $t('removeFromFavorites') : $t('addToFavorites')"
              >
                <Icon 
                  :name="isFavorite(station.id) ? 'heroicons:heart-solid' : 'heroicons:heart'" 
                  class="w-5 h-5" 
                />
              </button>
              <!-- Show on Map Button -->
              <button
                @click="showOnMap(station)"
                class="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                :title="$t('showOnMap')"
              >
                <Icon name="heroicons:map-pin" class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Address -->
          <div class="mb-3">
            <p class="text-sm text-gray-700 dark:text-gray-300">
              {{ station.morada }}, {{ station.codigoPostal }} {{ station.localidade }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-500">
              {{ station.municipio }}, {{ station.distrito }}
            </p>
          </div>

          <!-- Fuel Prices -->
          <div class="space-y-2">
            <h5 class="text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ $t("fuelPrices") }}
            </h5>
            <div 
              :class="station.combustiveis.length === 1 
                ? 'space-y-2' 
                : 'grid grid-cols-1 sm:grid-cols-2 gap-2'"
            >
              <div
                v-for="fuel in station.combustiveis"
                :key="fuel.tipo"
                class="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded"
              >
                <span class="text-sm text-gray-700 dark:text-gray-300">{{ fuel.tipo }}</span>
                <span class="text-sm font-semibold text-green-600 dark:text-green-400">
                  {{ formatPrice(fuel.preco) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Last Updated -->
          <div class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
            <p class="text-xs text-gray-500 dark:text-gray-500">
              {{ $t("lastUpdated") }}: {{ formatDate(getLatestUpdate(station.combustiveis)) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Combustivel {
  tipo: string;
  preco: number;
  dataAtualizacao: string;
}

interface GroupedStation {
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
  combustiveis: Combustivel[];
}

interface Props {
  stations: GroupedStation[];
  loading: boolean;
  showSuccessMessage?: boolean;
}

interface Emits {
  (e: 'showOnMap', station: GroupedStation): void;
  (e: 'goToFilters'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { t: $t } = useI18n();
const { isFavorite, toggleFavorite } = useFavorites();

const sortMenuOpen = ref(false);
const sortBy = ref('name'); // 'name', 'price', 'distance'

const sortedStations = computed(() => {
  const stations = [...props.stations];
  
  switch (sortBy.value) {
    case 'name':
      return stations.sort((a, b) => a.nome.localeCompare(b.nome));
    case 'price':
      return stations.sort((a, b) => {
        const aMinPrice = Math.min(...a.combustiveis.map(f => f.preco || Infinity));
        const bMinPrice = Math.min(...b.combustiveis.map(f => f.preco || Infinity));
        return aMinPrice - bMinPrice;
      });
    default:
      return stations;
  }
});

const toggleSortMenu = () => {
  sortMenuOpen.value = !sortMenuOpen.value;
};

const showOnMap = (station: GroupedStation) => {
  emit('showOnMap', station);
};

const goToFilters = () => {
  emit('goToFilters');
};

const formatPrice = (price: number) => {
  if (!price || price === 0) return "N/A";
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 3,
  }).format(price);
};

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getLatestUpdate = (combustiveis: Combustivel[]) => {
  if (!combustiveis || combustiveis.length === 0) return "";
  return combustiveis.reduce((latest, fuel) => {
    if (!fuel.dataAtualizacao) return latest;
    if (!latest) return fuel.dataAtualizacao;
    return new Date(fuel.dataAtualizacao) > new Date(latest) 
      ? fuel.dataAtualizacao 
      : latest;
  }, "");
};
</script> 