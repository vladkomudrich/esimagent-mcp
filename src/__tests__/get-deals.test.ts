import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Deal } from "../types.js";

vi.mock("../api.js", () => ({
  fetchAPI: vi.fn(),
}));

import { getDeals } from "../tools/get-deals.js";
import { fetchAPI } from "../api.js";

const mockFetchAPI = vi.mocked(fetchAPI);

const makeDeal = (overrides: Partial<Deal> = {}): Deal => ({
  id: "deal-1",
  providerId: "airalo",
  providerName: "Airalo",
  title: "Spring Sale",
  description: "Get a discount on all Japan plans",
  discountType: "percentage",
  discountValue: 20,
  promoCode: "SPRING20",
  affiliateUrl: "https://example.com/deal",
  expiresAt: "2026-05-01",
  ...overrides,
});

describe("getDeals", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns formatted deals on successful response", async () => {
    mockFetchAPI.mockResolvedValue([makeDeal()]);

    const result = await getDeals();

    expect(result).toContain("Current eSIM Deals & Discounts");
    expect(result).toContain("Airalo: Spring Sale");
    expect(result).toContain("Get a discount on all Japan plans");
    expect(result).toContain("20% off");
    expect(result).toContain("SPRING20");
    expect(result).toContain("2026-05-01");
    expect(result).toContain("https://example.com/deal");
  });

  it("formats percentage discount correctly", async () => {
    mockFetchAPI.mockResolvedValue([
      makeDeal({ discountType: "percentage", discountValue: 15 }),
    ]);

    const result = await getDeals();

    expect(result).toContain("15% off");
  });

  it("formats flat discount correctly", async () => {
    mockFetchAPI.mockResolvedValue([
      makeDeal({ discountType: "flat", discountValue: 5 }),
    ]);

    const result = await getDeals();

    expect(result).toContain("$5 off");
  });

  it("includes promo code when present", async () => {
    mockFetchAPI.mockResolvedValue([makeDeal({ promoCode: "SAVE10" })]);

    const result = await getDeals();

    expect(result).toContain("Promo Code: SAVE10");
  });

  it("omits promo code when not present", async () => {
    mockFetchAPI.mockResolvedValue([makeDeal({ promoCode: undefined })]);

    const result = await getDeals();

    expect(result).not.toContain("Promo Code:");
  });

  it("includes expiry date when present", async () => {
    mockFetchAPI.mockResolvedValue([makeDeal({ expiresAt: "2026-12-31" })]);

    const result = await getDeals();

    expect(result).toContain("Expires: 2026-12-31");
  });

  it("omits expiry date when not present", async () => {
    mockFetchAPI.mockResolvedValue([makeDeal({ expiresAt: undefined })]);

    const result = await getDeals();

    expect(result).not.toContain("Expires:");
  });

  it("returns no deals message when empty", async () => {
    mockFetchAPI.mockResolvedValue([]);

    const result = await getDeals();

    expect(result).toContain("No active deals at the moment");
    expect(result).toContain("https://esimagent.vdigital.app/deals");
  });

  it("handles null response as empty", async () => {
    mockFetchAPI.mockResolvedValue(null);

    const result = await getDeals();

    expect(result).toContain("No active deals");
  });

  it("returns graceful error message on API failure", async () => {
    mockFetchAPI.mockRejectedValue(new Error("Service unavailable"));

    const result = await getDeals();

    expect(result).toContain("Failed to fetch deals");
    expect(result).toContain("Service unavailable");
    expect(result).toContain("https://esimagent.vdigital.app/deals");
  });

  it("shows deal count in header", async () => {
    const deals = [makeDeal(), makeDeal({ id: "deal-2", title: "Summer Sale" })];
    mockFetchAPI.mockResolvedValue(deals);

    const result = await getDeals();

    expect(result).toContain("2 active deals");
  });

  it("uses singular for single deal", async () => {
    mockFetchAPI.mockResolvedValue([makeDeal()]);

    const result = await getDeals();

    expect(result).toContain("1 active deal");
    expect(result).not.toContain("1 active deals");
  });

  it("includes claim link for each deal", async () => {
    mockFetchAPI.mockResolvedValue([
      makeDeal({ affiliateUrl: "https://claim.example.com" }),
    ]);

    const result = await getDeals();

    expect(result).toContain("Claim: https://claim.example.com");
  });

  it("includes browse all deals link", async () => {
    mockFetchAPI.mockResolvedValue([makeDeal()]);

    const result = await getDeals();

    expect(result).toContain("Browse all deals: https://esimagent.vdigital.app/deals");
  });
});
