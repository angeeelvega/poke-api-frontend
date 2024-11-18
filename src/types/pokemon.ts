/**
 * @description Respuesta de la API para listados paginados de pokémons
 */
export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
}

/**
 * @description Información básica de un pokémon
 */
export interface PokemonBasic {
  id: number;
  name: string;
  url: string;
}

/**
 * @description Detalles de las habilidades de un pokémon
 */
export interface Ability {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

/**
 * @description Detalles de los tipos de un pokémon
 */
export interface Type {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

/**
 * @description Detalles completos de un pokémon
 */
export interface PokemonDetails extends PokemonBasic {
  abilities: Ability[];
  types: Type[];
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
  height: number;
  weight: number;
}
