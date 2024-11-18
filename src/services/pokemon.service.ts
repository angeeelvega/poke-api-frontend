import axios from "axios";

import { PokemonListResponse } from "../types/pokemon";
import { PokemonDetails } from "../types/pokemon";
import { ERROR_MESSAGES } from "../constants/messages";
import { config } from '../config/env';

/**
 * @description Cliente de axios configurado para la PokeAPI
 */
const api = axios.create({
  baseURL: config.API_BASE_URL,
});

/**
 * @description HOF que maneja los errores de las llamadas a la API
 * @param errorMessage Mensaje de error personalizado a mostrar
 * @returns Una función que envuelve la llamada a la API y maneja sus errores
 */
const handleApiError =
  (errorMessage: string) =>
  async <T>(apiCall: () => Promise<T>): Promise<T> => {
    try {
      return await apiCall();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(errorMessage);
      }
      throw error;
    }
  };

/**
 * @description Servicios para interactuar con la PokeAPI
 */
export const pokemonService = {
  /**
   * @description Obtiene una lista paginada de pokémons
   * @param page Número de página (0-based)
   * @returns Promise con la respuesta paginada de pokémons
   */
  getPokemons: (page: number): Promise<PokemonListResponse> =>
    handleApiError(ERROR_MESSAGES.NOT_FOUND)(() => {
      const offset = page * 20;
      return api
        .get(`/pokemon?offset=${offset}&limit=20`)
        .then(({ data }) => data);
    }),

  /**
   * @description Obtiene los detalles de un pokémon específico por su ID
   * @param id ID del pokémon a buscar
   * @returns Promise con los detalles del pokémon
   */
  getPokemonById: (id: number): Promise<PokemonDetails> =>
    handleApiError(ERROR_MESSAGES.LOAD_ONE)(() =>
      api.get(`/pokemon/${id}`).then(({ data }) => data)
    ),

  /**
   * @description Busca un pokémon por nombre o ID
   * @param query Término de búsqueda (nombre o ID del pokémon)
   * @returns Promise con los detalles del pokémon encontrado
   */
  searchPokemon: (query: string): Promise<PokemonDetails> =>
    handleApiError(ERROR_MESSAGES.SEARCH)(() =>
      api.get(`/pokemon/${query.toLowerCase()}`).then(({ data }) => data)
    ),
};
