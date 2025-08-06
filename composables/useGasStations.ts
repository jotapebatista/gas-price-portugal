interface District {
  id: number
  nome: string
}

interface Municipality {
  id: number
  nome: string
  idDistrito: number
}

interface FuelType {
  id: number
  nome: string
  ativo: boolean
}

interface GasStation {
  id: number
  nome: string
  morada: string
  codigoPostal: string
  localidade: string
  latitude: number
  longitude: number
  precoCombustivel: number
  dataAtualizacao: string
  marca: string
  combustivel: string
  municipio: string
  distrito: string
}

interface GroupedStation {
  id: number
  nome: string
  morada: string
  codigoPostal: string
  localidade: string
  latitude: number
  longitude: number
  marca: string
  municipio: string
  distrito: string
  combustiveis: {
    tipo: string
    preco: number
    dataAtualizacao: string
  }[]
}

interface SearchParams {
  idsTiposComb?: number | number[] // Support single or multiple fuel types
  idDistrito?: number
  idsMunicipios?: number[]
  pagina?: number
}

export function useGasStationsAPI() {
  const districts = ref<District[]>([])
  const municipalities = ref<Municipality[]>([])
  const fuelTypes = ref<FuelType[]>([])
  const stations = ref<GasStation[]>([])
  const groupedStations = ref<GroupedStation[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchDistricts = async () => {
    try {
      loading.value = true
      error.value = null
      const data = await $fetch<any>('https://precoscombustiveis.dgeg.gov.pt/api/PrecoComb/GetDistritos')
      
      const districtsData = data?.resultado || []
      districts.value = districtsData
        .filter((district: any) => district && district.Id && district.Descritivo)
        .map((district: any) => ({
          id: district.Id,
          nome: district.Descritivo
        }))
        .sort((a: District, b: District) => a.nome.localeCompare(b.nome, 'pt')) // Sort alphabetically in Portuguese
      return districts.value
    } catch (err) {
      error.value = 'Erro ao carregar distritos'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchMunicipalities = async (districtId: number) => {
    try {
      loading.value = true
      error.value = null
      const data = await $fetch<any>(`https://precoscombustiveis.dgeg.gov.pt/api/PrecoComb/GetMunicipios?idDistrito=${districtId}`)
      
      // Handle the actual API response structure
      const municipalitiesData = data?.resultado || []
      
      // Transform the data to match our interface
      municipalities.value = municipalitiesData
        .filter((municipality: any) => municipality && municipality.Id && municipality.Descritivo)
        .map((municipality: any) => ({
          id: municipality.Id,
          nome: municipality.Descritivo,
          idDistrito: districtId
        }))
        .sort((a: Municipality, b: Municipality) => a.nome.localeCompare(b.nome, 'pt')) // Sort alphabetically in Portuguese
      
      return municipalities.value
    } catch (err) {
      error.value = 'Erro ao carregar municípios'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchFuelTypes = async () => {
    try {
      loading.value = true
      error.value = null
      const data = await $fetch<any>('https://precoscombustiveis.dgeg.gov.pt/api/PrecoComb/GetTiposCombustiveis?idTipoCombustivel=&fl_viewWebSite=true&fl_ativo=true')
      
      const fuelTypesData = data?.resultado || []
      const activeFuelTypes = fuelTypesData
        .filter((fuel: any) => fuel && fuel.Id && fuel.Descritivo && fuel.fl_ativo === true)
        .map((fuel: any) => ({
          id: fuel.Id,
          nome: fuel.Descritivo,
          ativo: fuel.fl_ativo
        }))
      fuelTypes.value = activeFuelTypes
      return activeFuelTypes
    } catch (err) {
      error.value = 'Erro ao carregar tipos de combustível'
      throw err
    } finally {
      loading.value = false
    }
  }

  const groupStationsByLocation = (stationsData: GasStation[]): GroupedStation[] => {
    const grouped = new Map<number, GroupedStation>()
    
    stationsData.forEach(station => {
      if (grouped.has(station.id)) {
        // Station already exists, add fuel type
        const existing = grouped.get(station.id)!
        existing.combustiveis.push({
          tipo: station.combustivel,
          preco: station.precoCombustivel,
          dataAtualizacao: station.dataAtualizacao
        })
      } else {
        // New station
        grouped.set(station.id, {
          id: station.id,
          nome: station.nome,
          morada: station.morada,
          codigoPostal: station.codigoPostal,
          localidade: station.localidade,
          latitude: station.latitude,
          longitude: station.longitude,
          marca: station.marca,
          municipio: station.municipio,
          distrito: station.distrito,
          combustiveis: [{
            tipo: station.combustivel,
            preco: station.precoCombustivel,
            dataAtualizacao: station.dataAtualizacao
          }]
        })
      }
    })
    
    return Array.from(grouped.values())
  }

  const fetchStations = async (params: SearchParams = {}) => {
    try {
      loading.value = true
      error.value = null
      const {
        idsTiposComb = [3209], // Default to Gasolina simples 95, now as array
        idDistrito = 1,
        idsMunicipios = [],
        pagina = 1
      } = params

      // Convert single fuel type to array if needed
      const fuelTypeIds = Array.isArray(idsTiposComb) ? idsTiposComb : [idsTiposComb]

      const searchParams = new URLSearchParams({
        idsTiposComb: fuelTypeIds.join(','),
        idDistrito: idDistrito.toString(),
        idsMunicipios: idsMunicipios.join(','),
        qtdPorPagina: '50',
        pagina: pagina.toString()
      })

      const data = await $fetch<any>(`https://precoscombustiveis.dgeg.gov.pt/api/PrecoComb/PesquisarPostos?${searchParams}`)
      
      const stationsData = data?.resultado || []
      
      // Transform the data to match our interface with correct field names
      const transformedStations = stationsData
        .filter((station: any) => station && station.Id && station.Nome)
        .map((station: any) => ({
          id: station.Id,
          nome: station.Nome,
          morada: station.Morada || '',
          codigoPostal: station.CodPostal || '',
          localidade: station.Localidade || '',
          latitude: station.Latitude || 0,
          longitude: station.Longitude || 0,
          precoCombustivel: parseFloat(station.Preco?.replace('€', '').replace(',', '.').trim()) || 0,
          dataAtualizacao: station.DataAtualizacao || '',
          marca: station.Marca || '',
          combustivel: station.Combustivel || '',
          municipio: station.Municipio || '',
          distrito: station.Distrito || ''
        }))
      
      stations.value = transformedStations
      groupedStations.value = groupStationsByLocation(transformedStations)
      
      return transformedStations
    } catch (err) {
      error.value = 'Erro ao carregar postos de combustível'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    // Data
    districts,
    municipalities,
    fuelTypes,
    stations,
    groupedStations,
    loading,
    error,
    
    // Methods
    fetchDistricts,
    fetchMunicipalities,
    fetchFuelTypes,
    fetchStations,
    groupStationsByLocation
  }
} 