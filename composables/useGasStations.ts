// composables/useGasStations.ts
export function useGasStationsAPI() {
	const fetchDistricts = async () => {
		return await $fetch('https://precoscombustiveis.dgeg.gov.pt/api/PrecoComb/GetDistritos')
	}

	const fetchMunicipalities = async (districtId: number) => {
		return await $fetch(`https://precoscombustiveis.dgeg.gov.pt/api/PrecoComb/GetMunicipios?idDistrito=${districtId}`)
	}

	// const fetchFuelTypes = async () => {
	// 	return await $fetch('https://precoscombustiveis.dgeg.gov.pt/api/PrecoComb/GetTiposCombustiveis?idTipoCombustivel=&fl_viewWebSite=true&fl_ativo=true')
	// }
	const fetchFuelTypes = async () => {
		const response = await $fetch('https://precoscombustiveis.dgeg.gov.pt/api/PrecoComb/GetTiposCombustiveis?idTipoCombustivel=&fl_viewWebSite=true&fl_ativo=true');
		return response.resultado || [];  // Make sure to return only the 'resultado' array
	  }
	  

	const fetchStations = async ({
		idsTiposComb = 3201,
		idDistrito = 1,
		idsMunicipios = [],
		pagina = 1
	}) => {
		const params = new URLSearchParams({
			idsTiposComb: idsTiposComb.toString(),
			idDistrito: idDistrito.toString(),
			idsMunicipios: idsMunicipios.join(','),
			qtdPorPagina: '50',
			pagina: pagina.toString()
		})
		return await $fetch(`https://precoscombustiveis.dgeg.gov.pt/api/PrecoComb/PesquisarPostos?${params}`)
	}

	return {
		fetchDistricts,
		fetchMunicipalities,
		fetchFuelTypes,
		fetchStations
	}
}
