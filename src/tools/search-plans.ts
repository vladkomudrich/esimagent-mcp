import { fetchAPI } from "../api.js";
import { resolveCountryCode, countries } from "../data/countries.js";
import type { Plan } from "../types.js";

const MAX_PLANS = 20;

export interface SearchPlansArgs {
  country: string;
  minDays?: number;
  maxDays?: number;
  minGb?: number;
  maxGb?: number;
}

export async function searchPlans(args: SearchPlansArgs): Promise<string> {
  const countryCode = resolveCountryCode(args.country);

  if (!countryCode) {
    return [
      `Could not find a country matching "${args.country}".`,
      "",
      "Please provide a valid ISO 3166-1 alpha-2 country code (e.g., \"JP\" for Japan, \"US\" for United States).",
      "",
      "Use the list_supported_countries tool to find the correct code.",
    ].join("\n");
  }

  const countryName =
    countries.find((c) => c.code === countryCode)?.name ?? countryCode;

  try {
    const plans = await fetchAPI<Plan[]>("/plans", {
      country: countryCode,
      minDays: args.minDays,
      maxDays: args.maxDays,
      minGb: args.minGb,
      maxGb: args.maxGb,
    });

    if (!plans || plans.length === 0) {
      return [
        `No eSIM plans found for ${countryName} (${countryCode}).`,
        "",
        "This country may not have eSIM coverage yet. Try a neighboring country or check back later.",
        "",
        `Browse all available countries: https://esimagent.vdigital.app/compare`,
      ].join("\n");
    }

    const limited = plans.slice(0, MAX_PLANS);
    const lines: string[] = [
      `eSIM Plans for ${countryName} (${countryCode})`,
      `Found ${plans.length} plan${plans.length !== 1 ? "s" : ""}${plans.length > MAX_PLANS ? ` (showing top ${MAX_PLANS})` : ""}`,
      "",
    ];

    for (const plan of limited) {
      let badge = "";
      if (plan.isExactDurationMatch === true && plan.isExactDataMatch === true) {
        badge = " [EXACT MATCH]";
      } else if (plan.isBestValue) {
        badge = " [BEST VALUE]";
      }
      lines.push(`--- ${plan.providerName}${badge} ---`);
      lines.push(`  Data: ${plan.capacityLabel}`);
      lines.push(`  Duration: ${plan.periodDays} day${plan.periodDays !== 1 ? "s" : ""}`);
      lines.push(`  Price: $${plan.priceUSD.toFixed(2)} USD`);
      if (plan.priceOriginal > plan.priceUSD) {
        lines.push(`  Original: $${plan.priceOriginal.toFixed(2)} USD`);
      }
      if (
        plan.activePromoCode &&
        plan.finalPriceUSD !== undefined &&
        plan.finalPriceUSD < plan.priceUSD
      ) {
        lines.push(
          `  Promo Code: ${plan.activePromoCode} → $${plan.finalPriceUSD.toFixed(2)} final`
        );
      } else if (
        plan.finalPriceUSD !== undefined &&
        plan.finalPriceUSD < plan.priceUSD
      ) {
        lines.push(`  Discounted Price: $${plan.finalPriceUSD.toFixed(2)}`);
      }
      if (plan.features.length > 0) {
        lines.push(`  Features: ${plan.features.join(", ")}`);
      }
      lines.push(`  Buy: ${plan.affiliateUrl}`);
      lines.push("");
    }

    lines.push(
      `Browse all plans: https://esimagent.vdigital.app/compare?country=${countryCode}`
    );

    return lines.join("\n");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return [
      `Failed to fetch eSIM plans for ${countryName}: ${message}`,
      "",
      `Try browsing plans directly: https://esimagent.vdigital.app/compare?country=${countryCode}`,
    ].join("\n");
  }
}
