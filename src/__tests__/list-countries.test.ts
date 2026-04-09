import { describe, it, expect } from "vitest";
import { listCountries } from "../tools/list-countries.js";

describe("listCountries", () => {
  it("returns all countries when no search filter is provided", () => {
    const result = listCountries({});

    expect(result).toContain("Supported Countries for eSIM Plans");
    expect(result).toContain("Popular Destinations:");
    expect(result).toContain("Total:");
  });

  it("shows popular destinations when no search provided", () => {
    const result = listCountries({});

    expect(result).toContain("US — United States");
    expect(result).toContain("JP — Japan");
    expect(result).toContain("GB — United Kingdom");
  });

  it("includes browse link in unfiltered results", () => {
    const result = listCountries({});

    expect(result).toContain("https://esimagent.vdigital.app/compare");
  });

  it("finds country by name search", () => {
    const result = listCountries({ search: "japan" });

    expect(result).toContain("JP — Japan");
    expect(result).toContain('Countries matching "japan"');
  });

  it("finds country by code search", () => {
    const result = listCountries({ search: "JP" });

    expect(result).toContain("JP — Japan");
  });

  it("finds multiple countries with partial search", () => {
    const result = listCountries({ search: "united" });

    expect(result).toContain("United States");
    expect(result).toContain("United Kingdom");
    expect(result).toContain("United Arab Emirates");
  });

  it("returns no matches message for invalid search", () => {
    const result = listCountries({ search: "zzz" });

    expect(result).toContain('No countries found matching "zzz"');
    expect(result).toContain("Try a different search term");
  });

  it("marks popular countries in search results", () => {
    const result = listCountries({ search: "japan" });

    expect(result).toContain("(popular)");
  });

  it("does not mark non-popular countries", () => {
    const result = listCountries({ search: "afghanistan" });

    expect(result).not.toContain("(popular)");
    expect(result).toContain("AF — Afghanistan");
  });

  it("shows correct result count", () => {
    const result = listCountries({ search: "japan" });

    expect(result).toContain("1 result found.");
  });

  it("pluralizes results correctly for multiple matches", () => {
    const result = listCountries({ search: "united" });

    expect(result).toMatch(/\d+ results found\./);
  });

  it("includes usage hint in search results", () => {
    const result = listCountries({ search: "japan" });

    expect(result).toContain("Use the country code with search_esim_plans");
  });
});
