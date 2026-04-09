import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Provider } from "../types.js";

vi.mock("../api.js", () => ({
  fetchAPI: vi.fn(),
}));

import { listProviders } from "../tools/list-providers.js";
import { fetchAPI } from "../api.js";

const mockFetchAPI = vi.mocked(fetchAPI);

const makeProvider = (overrides: Partial<Provider> = {}): Provider => ({
  id: "airalo",
  name: "Airalo",
  logo: "/logos/airalo.png",
  website: "https://airalo.com",
  affiliateUrl: "https://affiliate.airalo.com",
  rating: 4.5,
  features: ["Global Coverage", "24/7 Support"],
  ...overrides,
});

describe("listProviders", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns formatted providers on successful response", async () => {
    mockFetchAPI.mockResolvedValue([makeProvider()]);

    const result = await listProviders();

    expect(result).toContain("eSIM Providers");
    expect(result).toContain("Airalo");
    expect(result).toContain("4.5/5");
    expect(result).toContain("https://affiliate.airalo.com");
  });

  it("shows star ratings", async () => {
    mockFetchAPI.mockResolvedValue([makeProvider({ rating: 4.5 })]);

    const result = await listProviders();

    // 4.5 rounds to 5 stars
    expect(result).toContain("★★★★★");
  });

  it("shows features in output", async () => {
    mockFetchAPI.mockResolvedValue([makeProvider()]);

    const result = await listProviders();

    expect(result).toContain("Global Coverage, 24/7 Support");
  });

  it("returns empty message when no providers available", async () => {
    mockFetchAPI.mockResolvedValue([]);

    const result = await listProviders();

    expect(result).toContain("No providers available");
    expect(result).toContain("https://esimagent.vdigital.app/compare");
  });

  it("handles null response as empty", async () => {
    mockFetchAPI.mockResolvedValue(null);

    const result = await listProviders();

    expect(result).toContain("No providers available");
  });

  it("returns graceful error message on API failure", async () => {
    mockFetchAPI.mockRejectedValue(new Error("Connection refused"));

    const result = await listProviders();

    expect(result).toContain("Failed to fetch providers");
    expect(result).toContain("Connection refused");
    expect(result).toContain("https://esimagent.vdigital.app/compare");
  });

  it("shows provider count in header", async () => {
    const providers = [
      makeProvider(),
      makeProvider({ id: "saily", name: "Saily" }),
    ];
    mockFetchAPI.mockResolvedValue(providers);

    const result = await listProviders();

    expect(result).toContain("2 providers available");
  });

  it("uses singular for single provider", async () => {
    mockFetchAPI.mockResolvedValue([makeProvider()]);

    const result = await listProviders();

    expect(result).toContain("1 provider available");
  });

  it("includes compare link in output", async () => {
    mockFetchAPI.mockResolvedValue([makeProvider()]);

    const result = await listProviders();

    expect(result).toContain("https://esimagent.vdigital.app/compare");
  });

  it("shows multiple providers formatted correctly", async () => {
    const providers = [
      makeProvider({ name: "Airalo", rating: 4.5 }),
      makeProvider({ id: "saily", name: "Saily", rating: 4.0 }),
    ];
    mockFetchAPI.mockResolvedValue(providers);

    const result = await listProviders();

    expect(result).toContain("--- Airalo ---");
    expect(result).toContain("--- Saily ---");
  });
});
