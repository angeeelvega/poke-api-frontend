import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

jest.mock("@mui/material", () => ({
  CssBaseline: () => null,
}));

jest.mock("./pages/PokemonGrid/PokemonGrid", () => ({
  PokemonGrid: () => <div data-testid="pokemon-grid" />,
}));

describe("App", () => {
  it("should render Layout with PokemonGrid", () => {
    const { getByTestId, getByAltText } = render(<App />);
    expect(getByTestId("pokemon-grid")).toBeInTheDocument();
    expect(getByAltText("PokeAPI Logo")).toBeInTheDocument();
  });
});
