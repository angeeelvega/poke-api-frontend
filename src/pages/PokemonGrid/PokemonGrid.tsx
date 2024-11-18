import { useCallback, useEffect, useState, useMemo } from "react";
import { Pagination } from "@mui/material";
import { pokemonService } from "../../services/pokemon.service";
import {
  PokemonDetails as PokemonDetailsType,
  PokemonBasic,
} from "../../types/pokemon";
import { PokemonDetails } from "../../components/pokemon/PokemonDetails/PokemonDetails";
import { Loader } from "../../components/common/Loader/Loader";
import { PokemonCard } from "../../components/pokemon/PokemonCard/PokemonCard";

export const PokemonGrid = () => {
  // -------------- Estados --------------

  /**
   * @description Estados principales para el manejo de datos de Pokémon
   */
  const [pokemons, setPokemons] = useState<PokemonBasic[]>([]);
  const [selectedPokemon, setSelectedPokemon] =
    useState<PokemonDetailsType | null>(null);
  const [searchedPokemon, setSearchedPokemon] = useState<PokemonBasic | null>(
    null
  );

  /**
   * @description Estados para el manejo de la paginación
   */
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  /**
   * @description Estados para el manejo de la interfaz de usuario
   */
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageLoadedMap, setImageLoadedMap] = useState<Record<number, boolean>>(
    {}
  );

  // -------------- Métodos --------------

  /**
   * @description Carga la lista inicial de pokémons según la página actual
   */
  const fetchPokemons = () => {
    setIsLoading(true);
    setError(null);

    pokemonService
      .getPokemons(page)
      .then((data) => {
        const basicPokemons: PokemonBasic[] = data.results.map((pokemon) => ({
          id: Number(pokemon.url.split("/")[6]),
          name: pokemon.name,
          url: pokemon.url,
        }));

        setPokemons(basicPokemons);
        setTotalPages(Math.ceil(data.count / 20));
        setTotalCount(data.count);
      })
      .catch((error) => {
        setError(error instanceof Error ? error.message : "Error desconocido");
        resetState();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  /**
   * @description Reinicia los estados relacionados con la lista de pokémons
   */
  const resetState = () => {
    setPokemons([]);
    setTotalPages(0);
    setTotalCount(0);
  };

  /**
   * @description Maneja la búsqueda de pokémons, tanto en la lista actual como en la API
   */
  const handleSearch = useCallback(
    (query: string) => {
      setSearch(query);
      setSearchedPokemon(null);

      if (query.trim() === "") {
        setError(null);
        return;
      }

      const filteredPokemons = pokemons.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(query.toLowerCase())
      );

      if (filteredPokemons.length > 0) {
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      pokemonService
        .searchPokemon(query.trim())
        .then((pokemon) => {
          setSearchedPokemon({
            id: pokemon.id,
            name: pokemon.name,
            url: `https://pokeapi.co/api/v2/pokemon/${pokemon.id}`,
          });
        })
        .catch((error) => {
          setError(
            error instanceof Error ? error.message : "Error desconocido"
          );
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [pokemons]
  );

  /**
   * @description Maneja el clic en un pokémon para mostrar sus detalles
   */
  const handlePokemonClick = (pokemonId: number) => {
    setIsLoading(true);
    setError(null);

    pokemonService
      .getPokemonById(pokemonId)
      .then(setSelectedPokemon)
      .catch((error) => {
        setError(error instanceof Error ? error.message : "Error desconocido");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  /**
   * @description Maneja el estado de carga de las imágenes
   */
  const handleImageLoad = (pokemonId: number) => {
    setImageLoadedMap((prev) => ({ ...prev, [pokemonId]: true }));
  };

  /**
   * @description Maneja el cambio de página en la paginación
   */
  const handlePageChange = (_: unknown, value: number) => {
    setPage(value - 1);
  };

  // -------------- Effects --------------

  /**
   * @description Efecto para cargar pokémons cuando cambia la página
   */
  useEffect(() => {
    fetchPokemons();
  }, [page]);

  /**
   * @description Efecto para manejar el debounce de la búsqueda
   */
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, handleSearch]);

  /**
   * @description Lista filtrada de pokémons a mostrar
   */
  const displayedPokemons = search
    ? searchedPokemon
      ? [searchedPokemon]
      : pokemons.filter((pokemon) =>
          pokemon.name.toLowerCase().includes(search.toLowerCase())
        )
    : pokemons;

  const paginationInfo = useMemo(() => {
    const start = searchTerm
      ? displayedPokemons.length > 0
        ? 1
        : 0
      : page * 20 + 1;

    const end = searchTerm
      ? displayedPokemons.length
      : Math.min((page + 1) * 20, totalCount);

    const total = searchTerm ? displayedPokemons.length : totalCount;

    const pageCount = searchTerm
      ? Math.ceil(displayedPokemons.length / 20)
      : totalPages;

    return {
      start,
      end,
      total,
      pageCount,
    };
  }, [searchTerm, displayedPokemons.length, page, totalCount, totalPages]);

  return (
    <div className="pokemon-grid min-h-screen w-full flex flex-col items-center bg-background relative">
      {isLoading && <Loader />}

      <div className="pokemon-grid__container w-full max-w-4xl">
        <div className="pokemon-grid__search mb-8">
          <input
            type="text"
            placeholder="Buscar pokémon..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pokemon-grid__search-input w-full max-w-md px-4 py-2 rounded-lg border-2 border-primary focus:outline-none focus:ring-2 bg-background text-primary placeholder-gray-500"
          />
        </div>

        {error && (
          <div className="pokemon-grid__error bg-secondary rounded-lg p-2 mb-8">
            <p className="text-primary text-center">{error}</p>
          </div>
        )}

        <div className="pokemon-grid__cards grid grid-cols-[repeat(auto-fit,minmax(200px,4fr))] gap-4">
          {displayedPokemons.map((pokemon) => (
            <PokemonCard
              key={pokemon.id}
              pokemon={pokemon}
              isImageLoaded={imageLoadedMap[pokemon.id]}
              onImageLoad={() => handleImageLoad(pokemon.id)}
              onClick={() => handlePokemonClick(pokemon.id)}
            />
          ))}
        </div>

        {!isLoading && displayedPokemons.length > 0 && (
          <div className="pokemon-grid__pagination mt-8 flex flex-col sm:flex-row sm:justify-between items-center gap-4">
            <p
              className="pokemon-grid__pagination-info text-primary"
              data-testid="pagination-info"
            >
              Showing {paginationInfo.start} to {paginationInfo.end} of{" "}
              {paginationInfo.total} results
            </p>
            <Pagination
              count={paginationInfo.pageCount}
              page={page + 1}
              onChange={handlePageChange}
              color="primary"
              className="pokemon-grid__pagination-controls"
              data-testid="pagination-controls"
              sx={{
                "& .MuiPaginationItem-root": {
                  color: "#CCFF00",
                },
                "& .MuiPaginationItem-page.Mui-selected": {
                  backgroundColor: "#CCFF00",
                  color: "#000000",
                },
              }}
            />
          </div>
        )}

        {selectedPokemon && (
          <PokemonDetails
            pokemon={selectedPokemon}
            onClose={() => setSelectedPokemon(null)}
          />
        )}
      </div>
    </div>
  );
};
