import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { PokemonDetails } from "./PokemonDetails";

describe("PokemonDetails", () => {
  const mockPokemon = {
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
      {
        ability: {
          name: "chlorophyll",
          url: "https://pokeapi.co/api/v2/ability/34/",
        },
        is_hidden: true,
        slot: 3,
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

  const defaultProps = {
    pokemon: mockPokemon,
    onClose: jest.fn(),
  };

  it("renders pokemon details correctly", () => {
    render(<PokemonDetails {...defaultProps} />);

    expect(screen.getByText(mockPokemon.name)).toBeInTheDocument();
    expect(screen.getByText("#001")).toBeInTheDocument();

    expect(screen.getByText("grass")).toBeInTheDocument();

    expect(screen.getByText("overgrow")).toBeInTheDocument();
    expect(screen.getByText("chlorophyll")).toBeInTheDocument();
    expect(screen.getByText("(Hidden)")).toBeInTheDocument();

    expect(screen.getByText("45")).toBeInTheDocument();
    expect(screen.getByText("hp")).toBeInTheDocument();

    expect(screen.getByText("0.7m")).toBeInTheDocument();
    expect(screen.getByText("6.9kg")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    render(<PokemonDetails {...defaultProps} />);

    const closeButton = screen.getByText("✕");
    closeButton.click();

    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});
