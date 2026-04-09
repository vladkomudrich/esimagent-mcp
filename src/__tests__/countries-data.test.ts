import { describe, it, expect } from "vitest";
import { resolveCountryCode, countries } from "../data/countries.js";

describe("resolveCountryCode", () => {
  it("resolves exact country code", () => {
    expect(resolveCountryCode("JP")).toBe("JP");
  });

  it("resolves lowercase country code", () => {
    expect(resolveCountryCode("jp")).toBe("JP");
  });

  it("resolves country name to code", () => {
    expect(resolveCountryCode("Japan")).toBe("JP");
  });

  it("resolves country name case-insensitively", () => {
    expect(resolveCountryCode("japan")).toBe("JP");
  });

  it("resolves full country name for United States", () => {
    expect(resolveCountryCode("United States")).toBe("US");
  });

  it("resolves partial name match", () => {
    // "United" partially matches "United Arab Emirates" (first alphabetically)
    const result = resolveCountryCode("United");
    expect(result).not.toBeNull();
    expect(["AE", "GB", "US"]).toContain(result);
  });

  it("returns null for unknown country", () => {
    expect(resolveCountryCode("Atlantis")).toBeNull();
  });

  it("returns null for empty-like input", () => {
    expect(resolveCountryCode("xyz123")).toBeNull();
  });

  it("handles whitespace in input", () => {
    expect(resolveCountryCode("  JP  ")).toBe("JP");
  });
});

describe("countries data integrity", () => {
  it("all countries have valid 2-letter codes", () => {
    for (const country of countries) {
      expect(country.code).toMatch(/^[A-Z]{2}$/);
    }
  });

  it("all countries have non-empty names", () => {
    for (const country of countries) {
      expect(country.name.length).toBeGreaterThan(0);
    }
  });

  it("has no duplicate country codes", () => {
    const codes = countries.map((c) => c.code);
    const uniqueCodes = new Set(codes);
    expect(uniqueCodes.size).toBe(codes.length);
  });

  it("contains expected major countries", () => {
    const codes = countries.map((c) => c.code);
    expect(codes).toContain("US");
    expect(codes).toContain("GB");
    expect(codes).toContain("JP");
    expect(codes).toContain("DE");
    expect(codes).toContain("FR");
  });
});
