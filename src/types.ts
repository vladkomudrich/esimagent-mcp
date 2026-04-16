export interface Plan {
  id: string;
  providerId: string;
  providerName: string;
  providerLogo: string;
  countryCode: string;
  country: string;
  capacityMB: number;
  capacityLabel: string;
  periodDays: number;
  priceUSD: number;
  priceCurrency: string;
  priceOriginal: number;
  affiliateUrl: string;
  /** Server-wrapped click-tracking URL. Prefer this for user-facing buy links. */
  buyUrl?: string;
  features: string[];
  isBestValue?: boolean;

  matchScore?: number | null;
  isExactDurationMatch?: boolean | null;
  isExactDataMatch?: boolean | null;
  valueScore?: number;
  isClosestMatch?: boolean;

  activePromoCode?: string | null;
  discountApplied?: { type: "percentage" | "flat"; value: number } | null;
  finalPriceUSD?: number;
}

export interface Provider {
  id: string;
  name: string;
  logo: string;
  website: string;
  affiliateUrl: string;
  /** Server-wrapped click-tracking URL. Prefer this for user-facing links. */
  buyUrl?: string;
  rating: number;
  features: string[];
}

export interface Deal {
  id: string;
  providerId: string;
  providerName: string;
  title: string;
  description: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  promoCode?: string;
  affiliateUrl: string;
  /** Server-wrapped click-tracking URL. Prefer this for user-facing claim links. */
  buyUrl?: string;
  expiresAt?: string;
}

export interface Device {
  id: string;
  brand: string;
  model: string;
  esimSupported: boolean;
  installMethod: "qr" | "manual" | "app";
  releaseYear: number;
}

export interface Country {
  name: string;
  code: string;
}

export interface InstallationStep {
  step: number;
  title: string;
  description: string;
}
