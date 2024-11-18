import axios, { AxiosError } from "axios";
import { pokemonService } from "./pokemon.service";
import { PokemonListResponse, PokemonDetails } from "../types/pokemon";
import { ERROR_MESSAGES } from "../constants/messages";

jest.mock("axios", () => {
  const axiosInstance = {
    get: jest.fn(),
  };
  return {
    create: jest.fn(() => axiosInstance),
    isAxiosError: (payload: unknown): payload is AxiosError =>
      payload instanceof Error,
  };
});

describe("pokemonService", () => {
  describe("getPokemons", () => {
    const mockApiResponse: PokemonListResponse = {
      count: 1281,
      next: "https://pokeapi.co/api/v2/pokemon?offset=20&limit=20",
      previous: null,
      results: [
        {
          name: "bulbasaur",
          url: "https://pokeapi.co/api/v2/pokemon/1/",
        },
      ],
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return pokemon list when API call is successful", async () => {
      const axiosInstance = axios.create();
      (axiosInstance.get as jest.Mock).mockResolvedValue({
        data: mockApiResponse,
      });

      const result = await pokemonService.getPokemons(0);

      expect(axiosInstance.get).toHaveBeenCalledWith(
        "/pokemon?offset=0&limit=20"
      );
      expect(result).toEqual(mockApiResponse);
    });

    it("should calculate correct offset for different pages", async () => {
      const axiosInstance = axios.create();
      (axiosInstance.get as jest.Mock).mockResolvedValue({
        data: mockApiResponse,
      });

      await pokemonService.getPokemons(2);

      expect(axiosInstance.get).toHaveBeenCalledWith(
        "/pokemon?offset=40&limit=20"
      );
    });

    it("should throw custom error when API call fails", async () => {
      const axiosInstance = axios.create();
      const axiosError = new Error("Network Error") as AxiosError;
      (axiosInstance.get as jest.Mock).mockRejectedValue(axiosError);

      await expect(pokemonService.getPokemons(0)).rejects.toThrow(
        ERROR_MESSAGES.NOT_FOUND
      );
    });
  });

  describe("getPokemonById", () => {
    const mockPokemonDetails: PokemonDetails = {
      id: 1,
      name: "bulbasaur",
      url: "https://pokeapi.co/api/v2/pokemon/1/",
      abilities: [
        {
          ability: {
            name: "overgrow",
            url: "https://pokeapi.co/api/v2/ability/65/",
          },
          is_hidden: false,
          slot: 1,
        },
      ],
      types: [
        {
          slot: 1,
          type: {
            name: "grass",
            url: "https://pokeapi.co/api/v2/type/12/",
          },
        },
      ],
      stats: [
        {
          base_stat: 45,
          stat: {
            name: "hp",
          },
        },
      ],
      height: 7,
      weight: 69,
    };

    it("should return pokemon details when API call is successful", async () => {
      const axiosInstance = axios.create();
      (axiosInstance.get as jest.Mock).mockResolvedValue({
        data: mockPokemonDetails,
      });

      const result = await pokemonService.getPokemonById(1);

      expect(axiosInstance.get).toHaveBeenCalledWith("/pokemon/1");
      expect(result).toEqual(mockPokemonDetails);
    });

    it("should throw custom error when API call fails", async () => {
      const axiosInstance = axios.create();
      const axiosError = new Error("Network Error") as AxiosError;
      (axiosInstance.get as jest.Mock).mockRejectedValue(axiosError);

      await expect(pokemonService.getPokemonById(1)).rejects.toThrow(
        ERROR_MESSAGES.LOAD_ONE
      );
    });
  });

  describe("searchPokemon", () => {
    const mockPokemonDetails: PokemonDetails = {
      id: 25,
      name: "pikachu",
      url: "https://pokeapi.co/api/v2/pokemon/25/",
      abilities: [
        {
          ability: {
            name: "static",
            url: "https://pokeapi.co/api/v2/ability/9/",
          },
          is_hidden: false,
          slot: 1,
        },
      ],
      types: [
        {
          slot: 1,
          type: {
            name: "electric",
            url: "https://pokeapi.co/api/v2/type/13/",
          },
        },
      ],
      stats: [
        {
          base_stat: 35,
          stat: {
            name: "hp",
          },
        },
      ],
      height: 4,
      weight: 60,
    };

    it("should return pokemon details when searching by name", async () => {
      const axiosInstance = axios.create();
      (axiosInstance.get as jest.Mock).mockResolvedValue({
        data: mockPokemonDetails,
      });

      const result = await pokemonService.searchPokemon("pikachu");

      expect(axiosInstance.get).toHaveBeenCalledWith("/pokemon/pikachu");
      expect(result).toEqual(mockPokemonDetails);
    });

    it("should throw custom error when API call fails", async () => {
      const axiosInstance = axios.create();
      const axiosError = new Error("Network Error") as AxiosError;
      (axiosInstance.get as jest.Mock).mockRejectedValue(axiosError);

      await expect(pokemonService.searchPokemon("muta")).rejects.toThrow(
        ERROR_MESSAGES.SEARCH
      );
    });
  });

  describe("handleApiError", () => {
    it("should pass through non-Axios errors unchanged", async () => {
      const customError = new TypeError("Custom type error");
      jest.spyOn(axios, "isAxiosError").mockImplementation(() => false);

      const axiosInstance = axios.create();
      (axiosInstance.get as jest.Mock).mockRejectedValue(customError);

      await expect(pokemonService.getPokemons(0)).rejects.toBe(customError);
    });
  });
});
