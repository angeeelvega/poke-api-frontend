import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { PokemonCard } from "./PokemonCard";
import { PokemonBasic } from "../../../types/pokemon";

describe("PokemonCard", () => {
  const mockPokemon: PokemonBasic = {
    id: 1,
    name: "bulbasaur",
    url: "https://pokeapi.co/api/v2/pokemon/1/",
  };

  const defaultProps = {
    pokemon: mockPokemon,
    isImageLoaded: false,
    onImageLoad: jest.fn(),
    onClick: jest.fn(),
  };

  const renderPokemonCard = (props = defaultProps) => {
    return render(<PokemonCard {...props} />);
  };

  it("shows image with opacity 1 when loaded", () => {
    renderPokemonCard({
      ...defaultProps,
      isImageLoaded: true,
    });

    const image = screen.getByAltText(mockPokemon.name);
    expect(image).toHaveStyle({ opacity: 1 });
  });

  it("shows fallback image when image fails to load", () => {
    renderPokemonCard();

    const pokemonImage = screen.getByAltText(mockPokemon.name);
    fireEvent.error(pokemonImage);

    expect(pokemonImage.getAttribute("src")).toBe(
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png"
    );
    expect(defaultProps.onImageLoad).toHaveBeenCalled();
  });
});
