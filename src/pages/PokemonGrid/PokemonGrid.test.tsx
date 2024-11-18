import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { PokemonGrid } from "./PokemonGrid";
import { pokemonService } from "../../services/pokemon.service";

jest.mock("@mui/material", () => ({
  ...jest.requireActual("@mui/material"),
  Pagination: ({ onChange }: any) => (
    <div data-testid="pagination">
      <button onClick={() => onChange({}, 2)}>Next</button>
    </div>
  ),
  CircularProgress: () => <div data-testid="circular-progress" />,
  Skeleton: () => <div data-testid="skeleton" />,
}));

jest.mock("../../components/pokemon/PokemonCard/PokemonCard", () => ({
  PokemonCard: ({ pokemon, onClick, onImageLoad }: any) => (
    <div
      data-testid={`pokemon-card-${pokemon.id}`}
      onClick={() => onClick(pokemon.id)}
    >
      <img
        data-testid={`pokemon-image-${pokemon.id}`}
        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
        alt={pokemon.name}
        onLoad={() => onImageLoad(pokemon.id)}
      />
      {pokemon.name}
    </div>
  ),
}));

jest.mock("../../components/common/Loader/Loader", () => ({
  Loader: () => <div data-testid="loader">Cargando...</div>,
}));

jest.mock("../../services/pokemon.service", () => ({
  pokemonService: {
    getPokemons: jest.fn(),
    searchPokemon: jest.fn(),
    getPokemonById: jest.fn(),
  },
}));

const mockInitialPokemons = {
  count: 2,
  results: [
    { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
    { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon/2/" },
  ],
};

describe("PokemonGrid", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (pokemonService.getPokemons as jest.Mock).mockResolvedValue(
      mockInitialPokemons
    );
  });

  describe("Initial Render", () => {
    it("should render search input", () => {
      render(<PokemonGrid />);
      expect(
        screen.getByPlaceholderText("Buscar pokémon...")
      ).toBeInTheDocument();
    });

    it("should load and display initial pokemon list", async () => {
      render(<PokemonGrid />);
      await waitFor(() => {
        expect(screen.getByText("bulbasaur")).toBeInTheDocument();
        expect(screen.getByText("ivysaur")).toBeInTheDocument();
      });
    });
  });

  describe("Search Functionality", () => {
    it("should handle empty search query", async () => {
      (pokemonService.getPokemons as jest.Mock).mockResolvedValue({
        count: 2,
        results: [
          { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
          { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon/2/" },
        ],
      });

      (pokemonService.searchPokemon as jest.Mock).mockRejectedValue(
        new Error("No se encontró el pokémon")
      );

      render(<PokemonGrid />);

      const searchInput = screen.getByPlaceholderText("Buscar pokémon...");
      fireEvent.change(searchInput, { target: { value: "nonexistent" } });

      await waitFor(() => {
        expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
        expect(
          screen.getByText("No se encontró el pokémon")
        ).toBeInTheDocument();
      });

      fireEvent.change(searchInput, { target: { value: "   " } });

      await waitFor(() => {
        expect(screen.queryByTestId("error-message")).not.toBeInTheDocument();
        expect(searchInput).toHaveValue("   ");
      });
    });
    it("should filter local pokemon list", async () => {
      render(<PokemonGrid />);
      await waitFor(() => {
        expect(screen.getByText("bulbasaur")).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText("Buscar pokémon...");
      fireEvent.change(searchInput, { target: { value: "bulba" } });

      await waitFor(() => {
        expect(screen.getByText("bulbasaur")).toBeInTheDocument();
        expect(screen.queryByText("ivysaur")).not.toBeInTheDocument();
      });
    });

    it("should search pokemon via API when not found locally", async () => {
      const mockPikachu = {
        id: 25,
        name: "pikachu",
        types: [],
        stats: [],
        abilities: [],
        height: 0,
        weight: 0,
      };

      (pokemonService.searchPokemon as jest.Mock).mockResolvedValueOnce(
        mockPikachu
      );

      render(<PokemonGrid />);

      await waitFor(() => {
        expect(screen.getByText("bulbasaur")).toBeInTheDocument();
      });

      await act(async () => {
        const searchInput = screen.getByPlaceholderText("Buscar pokémon...");
        fireEvent.change(searchInput, { target: { value: "pikachu" } });
      });

      screen.debug();

      await waitFor(
        () => {
          expect(pokemonService.searchPokemon).toHaveBeenCalledWith("pikachu");
          const pokemonCard = screen.getByTestId(
            `pokemon-card-${mockPikachu.id}`
          );
          expect(pokemonCard).toBeInTheDocument();
          expect(pokemonCard).toHaveTextContent("pikachu");
        },
        { timeout: 3000 }
      );
    });

    it("should handle API search errors", async () => {
      const errorMessage = "No se encontró el pokémon";
      (pokemonService.searchPokemon as jest.Mock).mockRejectedValueOnce(
        new Error(errorMessage)
      );

      render(<PokemonGrid />);

      const searchInput = screen.getByPlaceholderText("Buscar pokémon...");
      fireEvent.change(searchInput, { target: { value: "nonexistent" } });

      await waitFor(() => {
        const errorDiv = screen.getByText(errorMessage);
        expect(errorDiv).toBeInTheDocument();
        expect(errorDiv.closest(".pokemon-grid__error")).toHaveClass(
          "pokemon-grid__error",
          "bg-secondary",
          "rounded-lg",
          "p-2",
          "mb-8"
        );
      });
    });

    it("should clear search results when input is empty", async () => {
      render(<PokemonGrid />);
      await waitFor(() => {
        expect(screen.getByText("bulbasaur")).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText("Buscar pokémon...");
      fireEvent.change(searchInput, { target: { value: "bulba" } });
      fireEvent.change(searchInput, { target: { value: "" } });

      await waitFor(() => {
        expect(screen.getByText("bulbasaur")).toBeInTheDocument();
        expect(screen.getByText("ivysaur")).toBeInTheDocument();
      });
    });

    it("should clear error when search input is empty", async () => {
      render(<PokemonGrid />);
      const searchInput = screen.getByPlaceholderText("Buscar pokémon...");

      fireEvent.change(searchInput, { target: { value: "nonexistent" } });
      await waitFor(() => {
        expect(
          screen.getByText("No se encontró el pokémon")
        ).toBeInTheDocument();
      });

      fireEvent.change(searchInput, { target: { value: "" } });

      await waitFor(() => {
        expect(
          screen.queryByText("No se encontró el pokémon")
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("handlePokemonClick", () => {
    const mockPokemon = {
      id: 1,
      name: "bulbasaur",
      types: [],
      stats: [],
      abilities: [],
      height: 0,
      weight: 0,
    };

    beforeEach(() => {
      jest.clearAllMocks();
      (pokemonService.getPokemons as jest.Mock).mockResolvedValue({
        count: 2,
        results: [
          { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
          { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon/2/" },
        ],
      });
    });

    it("should fetch and set pokemon details successfully", async () => {
      (pokemonService.getPokemonById as jest.Mock).mockResolvedValue(
        mockPokemon
      );
      render(<PokemonGrid />);

      await waitFor(() => {
        expect(screen.getByTestId("pokemon-card-1")).toBeInTheDocument();
      });

      const pokemonCard = screen.getByTestId("pokemon-card-1");
      fireEvent.click(pokemonCard);

      await waitFor(() => {
        expect(pokemonService.getPokemonById).toHaveBeenCalledWith(1);
        expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
      });
    });

    it("should handle error when fetching pokemon details", async () => {
      const errorMessage = "Error al cargar el pokémon";
      (pokemonService.getPokemonById as jest.Mock).mockRejectedValueOnce(
        new Error(errorMessage)
      );
      render(<PokemonGrid />);

      await waitFor(() => {
        expect(screen.getByTestId("pokemon-card-1")).toBeInTheDocument();
      });

      const pokemonCard = screen.getByTestId("pokemon-card-1");
      fireEvent.click(pokemonCard);

      await waitFor(() => {
        expect(pokemonService.getPokemonById).toHaveBeenCalledWith(1);
      });

      await waitFor(() => {
        expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });
  });

  describe("Image Loading", () => {
    it("should update image load state when handleImageLoad is called", async () => {
      render(<PokemonGrid />);

      await waitFor(() => {
        expect(screen.getByTestId("pokemon-card-1")).toBeInTheDocument();
      });

      const image = screen.getByTestId("pokemon-image-1");

      fireEvent.load(image);

      await waitFor(() => {
        const pokemonCard = screen.getByTestId("pokemon-card-1");
        expect(pokemonCard).toBeInTheDocument();
        expect(image).toBeInTheDocument();
      });
    });
  });

  describe("fetchPokemons", () => {
    it("should handle non-Error objects in catch block", async () => {
      const nonErrorObject = "string error";
      (pokemonService.getPokemons as jest.Mock).mockRejectedValueOnce(
        nonErrorObject
      );

      render(<PokemonGrid />);

      await waitFor(() => {
        expect(screen.getByText("Error desconocido")).toBeInTheDocument();
      });
    });

    it("should handle Error objects in catch block", async () => {
      const errorMessage = "Error específico";
      (pokemonService.getPokemons as jest.Mock).mockRejectedValueOnce(
        new Error(errorMessage)
      );

      render(<PokemonGrid />);

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });

    it("should call resetState when error occurs", async () => {
      (pokemonService.getPokemons as jest.Mock).mockRejectedValueOnce(
        new Error("Test error")
      );

      render(<PokemonGrid />);

      await waitFor(() => {
        expect(screen.getByText("Test error")).toBeInTheDocument();
      });
    });
  });

  describe("Pagination", () => {
    it("should handle page change correctly", async () => {
      render(<PokemonGrid />);

      await waitFor(() => {
        expect(screen.getByTestId("pagination")).toBeInTheDocument();
      });

      const nextPageButton = screen.getByText("Next");
      fireEvent.click(nextPageButton);

      await waitFor(() => {
        expect(pokemonService.getPokemons).toHaveBeenCalledWith(1);
      });
    });
  });

  describe("Pokemon Details Modal", () => {
    it("should show and hide pokemon details modal", async () => {
      const mockPokemon = {
        id: 1,
        name: "bulbasaur",
        types: [{ type: { name: "grass" } }],
        stats: [],
        abilities: [],
        height: 7,
        weight: 69,
      };

      (pokemonService.getPokemonById as jest.Mock).mockResolvedValue(
        mockPokemon
      );
      render(<PokemonGrid />);

      await waitFor(() => {
        expect(screen.getByTestId("pokemon-card-1")).toBeInTheDocument();
      });

      const pokemonCard = screen.getByTestId("pokemon-card-1");
      fireEvent.click(pokemonCard);

      await waitFor(() => {
        expect(screen.getByText("#001")).toBeInTheDocument();
      });

      const closeButton = screen.getByText("✕");
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByText("#001")).not.toBeInTheDocument();
      });
    });

    it("should handle non-Error objects when clicking pokemon card", async () => {
      const nonErrorObject = { foo: "bar" };
      (pokemonService.getPokemonById as jest.Mock).mockRejectedValueOnce(
        nonErrorObject
      );
      render(<PokemonGrid />);

      await waitFor(() => {
        expect(screen.getByTestId("pokemon-card-1")).toBeInTheDocument();
      });

      const pokemonCard = screen.getByTestId("pokemon-card-1");
      fireEvent.click(pokemonCard);

      await waitFor(() => {
        expect(screen.getByText("Error desconocido")).toBeInTheDocument();
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle non-Error objects in search", async () => {
      const nonErrorObject = { foo: "bar" };
      (pokemonService.searchPokemon as jest.Mock).mockRejectedValueOnce(
        nonErrorObject
      );

      render(<PokemonGrid />);
      const searchInput = screen.getByPlaceholderText("Buscar pokémon...");

      fireEvent.change(searchInput, { target: { value: "test" } });

      await waitFor(() => {
        expect(screen.getByText("Error desconocido")).toBeInTheDocument();
      });
    });
  });
});
