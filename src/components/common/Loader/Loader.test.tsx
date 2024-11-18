import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Loader } from "./Loader";

jest.mock("@mui/material", () => ({
  CircularProgress: () => <div data-testid="mui-circular-progress" />,
}));

describe("Loader", () => {
  it("should render loading text", () => {
    render(<Loader />);

    expect(screen.getByText("Cargando...")).toBeInTheDocument();
  });
});
