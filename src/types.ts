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
  features: string[];
  isBestValue?: boolean;
}

export interface Provider {
  id: string;
  name: string;
  logo: string;
  website: string;
  affiliateUrl: string;
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
