import { countries, popularCountryCodes } from "../data/countries.js";

export function listCountries(args: { search?: string }): string {
  const search = args.search?.toLowerCase().trim();

  let filtered = countries;
  if (search) {
    filtered = countries.filter(
      (c) =>
        c.name.toLowerCase().includes(search) ||
        c.code.toLowerCase().includes(search)
    );
  }

  if (filtered.length === 0) {
    return [
      `No countries found matching "${args.search}".`,
      "",
      "Try a different search term or omit the search to see all countries.",
    ].join("\n");
  }

  const popularSet = new Set(popularCountryCodes);

  // If no search, show popular first then all
  if (!search) {
    const popular = filtered.filter((c) => popularSet.has(c.code));
    const lines: string[] = [
      "Supported Countries for eSIM Plans",
      "",
      "Popular Destinations:",
      ...popular.map((c) => `  ${c.code} — ${c.name}`),
      "",
      `Total: ${filtered.length} countries available.`,
      "",
      "Use search to filter (e.g., list_supported_countries with search: \"asia\" or \"JP\").",
      "Use the country code with search_esim_plans to find plans.",
      "",
      `Browse all: https://esimagent.vdigital.app/compare`,
    ];
    return lines.join("\n");
  }

  const lines: string[] = [
    `Countries matching "${args.search}"`,
    "",
    ...filtered.map((c) => {
      const popular = popularSet.has(c.code) ? " (popular)" : "";
      return `  ${c.code} — ${c.name}${popular}`;
    }),
    "",
    `${filtered.length} result${filtered.length !== 1 ? "s" : ""} found.`,
    "",
    "Use the country code with search_esim_plans to find plans.",
  ];

  return lines.join("\n");
}
