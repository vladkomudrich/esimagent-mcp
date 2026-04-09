import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Plan } from "../types.js";

vi.mock("../api.js", () => ({
  fetchAPI: vi.fn(),
}));

import { searchPlans } from "../tools/search-plans.js";
import { fetchAPI } from "../api.js";

const mockFetchAPI = vi.mocked(fetchAPI);

const makePlan = (overrides: Partial<Plan> = {}): Plan => ({
  id: "plan-1",
  providerId: "airalo",
  providerName: "Airalo",
  providerLogo: "/logos/airalo.png",
  countryCode: "JP",
  country: "Japan",
  capacityMB: 5000,
  capacityLabel: "5 GB",
  periodDays: 30,
  priceUSD: 9.99,
  priceCurrency: "USD",
  priceOriginal: 9.99,
  affiliateUrl: "https://example.com/buy",
  features: ["4G/LTE", "Hotspot"],
  ...overrides,
});

describe("searchPlans", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns formatted plans on successful search", async () => {
    const plans = [makePlan()];
    mockFetchAPI.mockResolvedValue(plans);

    const result = await searchPlans({ country: "JP" });

    expect(result).toContain("eSIM Plans for Japan (JP)");
    expect(result).toContain("Airalo");
    expect(result).toContain("5 GB");
    expect(result).toContain("30 days");
    expect(result).toContain("$9.99 USD");
    expect(result).toContain("https://example.com/buy");
  });

  it("shows features in plan output", async () => {
    mockFetchAPI.mockResolvedValue([makePlan()]);

    const result = await searchPlans({ country: "JP" });

    expect(result).toContain("4G/LTE, Hotspot");
  });

  it("returns no plans found message for empty results", async () => {
    mockFetchAPI.mockResolvedValue([]);

    const result = await searchPlans({ country: "JP" });

    expect(result).toContain("No eSIM plans found for Japan (JP)");
    expect(result).toContain("https://esimagent.vdigital.app/compare");
  });

  it("returns error message for invalid country", async () => {
    const result = await searchPlans({ country: "Atlantis" });

    expect(result).toContain('Could not find a country matching "Atlantis"');
    expect(result).toContain("list_supported_countries");
    // fetchAPI should not be called for invalid country
    expect(mockFetchAPI).not.toHaveBeenCalled();
  });

  it("resolves country name to code before API call", async () => {
    mockFetchAPI.mockResolvedValue([makePlan()]);

    await searchPlans({ country: "Japan" });

    expect(mockFetchAPI).toHaveBeenCalledWith("/plans", { country: "JP" });
  });

  it("caps plans at 20 and shows truncation message", async () => {
    const plans = Array.from({ length: 25 }, (_, i) =>
      makePlan({ id: `plan-${i}`, providerName: `Provider ${i}` })
    );
    mockFetchAPI.mockResolvedValue(plans);

    const result = await searchPlans({ country: "JP" });

    expect(result).toContain("showing top 20");
    expect(result).toContain("Provider 0");
    expect(result).toContain("Provider 19");
    expect(result).not.toContain("Provider 20");
  });

  it("marks best value plan", async () => {
    const plans = [
      makePlan({ isBestValue: true, providerName: "BestProvider" }),
      makePlan({ id: "plan-2", providerName: "OtherProvider" }),
    ];
    mockFetchAPI.mockResolvedValue(plans);

    const result = await searchPlans({ country: "JP" });

    expect(result).toContain("[BEST VALUE]");
    expect(result).toContain("BestProvider");
  });

  it("shows original price when discounted", async () => {
    const plans = [makePlan({ priceUSD: 7.99, priceOriginal: 9.99 })];
    mockFetchAPI.mockResolvedValue(plans);

    const result = await searchPlans({ country: "JP" });

    expect(result).toContain("$7.99 USD");
    expect(result).toContain("Original: $9.99 USD");
  });

  it("does not show original price when same as current", async () => {
    const plans = [makePlan({ priceUSD: 9.99, priceOriginal: 9.99 })];
    mockFetchAPI.mockResolvedValue(plans);

    const result = await searchPlans({ country: "JP" });

    expect(result).not.toContain("Original:");
  });

  it("includes affiliate URL in plan output", async () => {
    mockFetchAPI.mockResolvedValue([
      makePlan({ affiliateUrl: "https://affiliate.example.com" }),
    ]);

    const result = await searchPlans({ country: "JP" });

    expect(result).toContain("Buy: https://affiliate.example.com");
  });

  it("returns graceful error message on API failure", async () => {
    mockFetchAPI.mockRejectedValue(new Error("Network timeout"));

    const result = await searchPlans({ country: "JP" });

    expect(result).toContain("Failed to fetch eSIM plans for Japan");
    expect(result).toContain("Network timeout");
    expect(result).toContain(
      "https://esimagent.vdigital.app/compare?country=JP"
    );
  });

  it("includes browse link with country code in results", async () => {
    mockFetchAPI.mockResolvedValue([makePlan()]);

    const result = await searchPlans({ country: "JP" });

    expect(result).toContain(
      "https://esimagent.vdigital.app/compare?country=JP"
    );
  });

  it("shows singular day for 1-day plan", async () => {
    mockFetchAPI.mockResolvedValue([makePlan({ periodDays: 1 })]);

    const result = await searchPlans({ country: "JP" });

    expect(result).toContain("1 day");
    expect(result).not.toContain("1 days");
  });

  it("shows plan count in header", async () => {
    const plans = [makePlan(), makePlan({ id: "plan-2" })];
    mockFetchAPI.mockResolvedValue(plans);

    const result = await searchPlans({ country: "JP" });

    expect(result).toContain("Found 2 plans");
  });
});
