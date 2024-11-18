import { config } from "../env";

describe("config", () => {
  it("should have the correct API base URL", () => {
    expect(config.API_BASE_URL).toBe("https://pokeapi.co/api/v2");
    expect(typeof config.API_BASE_URL).toBe("string");
  });

  it("should have only API_BASE_URL property", () => {
    const configKeys = Object.keys(config);
    expect(configKeys).toHaveLength(1);
    expect(configKeys).toContain("API_BASE_URL");
  });
});
