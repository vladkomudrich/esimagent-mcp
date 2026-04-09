import { fetchAPI } from "../api.js";
import type { Deal } from "../types.js";

export async function getDeals(): Promise<string> {
  try {
    const deals = await fetchAPI<Deal[]>("/deals");

    if (!deals || deals.length === 0) {
      return [
        "No active deals at the moment.",
        "",
        `Check back later or browse: https://esimagent.vdigital.app/deals`,
      ].join("\n");
    }

    const lines: string[] = [
      "Current eSIM Deals & Discounts",
      `${deals.length} active deal${deals.length !== 1 ? "s" : ""}`,
      "",
    ];

    for (const deal of deals) {
      const discount =
        deal.discountType === "percentage"
          ? `${deal.discountValue}% off`
          : `$${deal.discountValue} off`;

      lines.push(`--- ${deal.providerName}: ${deal.title} ---`);
      lines.push(`  ${deal.description}`);
      lines.push(`  Discount: ${discount}`);
      if (deal.promoCode) {
        lines.push(`  Promo Code: ${deal.promoCode}`);
      }
      if (deal.expiresAt) {
        lines.push(`  Expires: ${deal.expiresAt}`);
      }
      lines.push(`  Claim: ${deal.affiliateUrl}`);
      lines.push("");
    }

    lines.push(
      `Browse all deals: https://esimagent.vdigital.app/deals`
    );

    return lines.join("\n");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return [
      `Failed to fetch deals: ${message}`,
      "",
      `Browse deals directly: https://esimagent.vdigital.app/deals`,
    ].join("\n");
  }
}
