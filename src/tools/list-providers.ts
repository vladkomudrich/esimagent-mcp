import { fetchAPI } from "../api.js";
import type { Provider } from "../types.js";

export async function listProviders(): Promise<string> {
  try {
    const providers = await fetchAPI<Provider[]>("/providers");

    if (!providers || providers.length === 0) {
      return [
        "No providers available at the moment.",
        "",
        `Browse providers: https://esimagent.vdigital.app/compare`,
      ].join("\n");
    }

    const lines: string[] = [
      "eSIM Providers",
      `${providers.length} provider${providers.length !== 1 ? "s" : ""} available`,
      "",
    ];

    for (const provider of providers) {
      const stars = "★".repeat(Math.round(provider.rating)) +
        "☆".repeat(5 - Math.round(provider.rating));
      lines.push(`--- ${provider.name} ---`);
      lines.push(`  Rating: ${stars} (${provider.rating}/5)`);
      if (provider.features.length > 0) {
        lines.push(`  Features: ${provider.features.join(", ")}`);
      }
      lines.push(`  Website: ${provider.affiliateUrl}`);
      lines.push("");
    }

    lines.push(
      `Compare all providers: https://esimagent.vdigital.app/compare`
    );

    return lines.join("\n");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return [
      `Failed to fetch providers: ${message}`,
      "",
      `Browse providers directly: https://esimagent.vdigital.app/compare`,
    ].join("\n");
  }
}
