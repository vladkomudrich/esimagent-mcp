import type { Device, InstallationStep } from "../types.js";

export const devices: Device[] = [
  // Apple
  { id: "iphone-16-pro-max", brand: "Apple", model: "iPhone 16 Pro Max", esimSupported: true, installMethod: "qr", releaseYear: 2024 },
  { id: "iphone-16-pro", brand: "Apple", model: "iPhone 16 Pro", esimSupported: true, installMethod: "qr", releaseYear: 2024 },
  { id: "iphone-16", brand: "Apple", model: "iPhone 16", esimSupported: true, installMethod: "qr", releaseYear: 2024 },
  { id: "iphone-15-pro-max", brand: "Apple", model: "iPhone 15 Pro Max", esimSupported: true, installMethod: "qr", releaseYear: 2023 },
  { id: "iphone-15-pro", brand: "Apple", model: "iPhone 15 Pro", esimSupported: true, installMethod: "qr", releaseYear: 2023 },
  { id: "iphone-15", brand: "Apple", model: "iPhone 15", esimSupported: true, installMethod: "qr", releaseYear: 2023 },
  { id: "iphone-14-pro", brand: "Apple", model: "iPhone 14 Pro", esimSupported: true, installMethod: "qr", releaseYear: 2022 },
  { id: "iphone-14", brand: "Apple", model: "iPhone 14", esimSupported: true, installMethod: "qr", releaseYear: 2022 },
  { id: "iphone-13", brand: "Apple", model: "iPhone 13", esimSupported: true, installMethod: "qr", releaseYear: 2021 },
  { id: "iphone-se-3", brand: "Apple", model: "iPhone SE 3rd gen", esimSupported: true, installMethod: "qr", releaseYear: 2022 },
  { id: "iphone-xr", brand: "Apple", model: "iPhone XR", esimSupported: true, installMethod: "qr", releaseYear: 2018 },
  { id: "iphone-x", brand: "Apple", model: "iPhone X", esimSupported: false, installMethod: "qr", releaseYear: 2017 },

  // Samsung
  { id: "galaxy-s25-ultra", brand: "Samsung", model: "Galaxy S25 Ultra", esimSupported: true, installMethod: "qr", releaseYear: 2025 },
  { id: "galaxy-s25", brand: "Samsung", model: "Galaxy S25", esimSupported: true, installMethod: "qr", releaseYear: 2025 },
  { id: "galaxy-s24-ultra", brand: "Samsung", model: "Galaxy S24 Ultra", esimSupported: true, installMethod: "qr", releaseYear: 2024 },
  { id: "galaxy-s24", brand: "Samsung", model: "Galaxy S24", esimSupported: true, installMethod: "qr", releaseYear: 2024 },
  { id: "galaxy-s23", brand: "Samsung", model: "Galaxy S23", esimSupported: true, installMethod: "qr", releaseYear: 2023 },
  { id: "galaxy-z-fold-5", brand: "Samsung", model: "Galaxy Z Fold 5", esimSupported: true, installMethod: "qr", releaseYear: 2023 },
  { id: "galaxy-a54", brand: "Samsung", model: "Galaxy A54", esimSupported: false, installMethod: "qr", releaseYear: 2023 },

  // Google
  { id: "pixel-9-pro", brand: "Google", model: "Pixel 9 Pro", esimSupported: true, installMethod: "qr", releaseYear: 2024 },
  { id: "pixel-9", brand: "Google", model: "Pixel 9", esimSupported: true, installMethod: "qr", releaseYear: 2024 },
  { id: "pixel-8", brand: "Google", model: "Pixel 8", esimSupported: true, installMethod: "qr", releaseYear: 2023 },
  { id: "pixel-7", brand: "Google", model: "Pixel 7", esimSupported: true, installMethod: "qr", releaseYear: 2022 },
];

export function getInstallationSteps(brand: string): InstallationStep[] {
  switch (brand) {
    case "Apple":
      return [
        { step: 1, title: "Open Settings", description: "Go to Settings > Cellular (or Mobile Data)." },
        { step: 2, title: "Add eSIM", description: "Tap 'Add eSIM' or 'Add Cellular Plan'." },
        { step: 3, title: "Scan QR Code", description: "Select 'Use QR Code' and scan the QR code provided by your eSIM provider." },
        { step: 4, title: "Confirm Plan", description: "Review the cellular plan details and tap 'Continue' to confirm." },
        { step: 5, title: "Label & Set Default", description: "Label your new plan (e.g., 'Travel') and choose whether to set it as default for data." },
      ];
    case "Samsung":
      return [
        { step: 1, title: "Open Settings", description: "Go to Settings > Connections > SIM Manager." },
        { step: 2, title: "Add eSIM", description: "Tap 'Add eSIM'." },
        { step: 3, title: "Scan QR Code", description: "Select 'Scan QR code from service provider' and scan your eSIM QR code." },
        { step: 4, title: "Confirm", description: "Review the plan details and tap 'Confirm' to add the eSIM." },
        { step: 5, title: "Enable eSIM", description: "Toggle the new eSIM on and select it for mobile data if needed." },
      ];
    default:
      return [
        { step: 1, title: "Open Settings", description: "Go to Settings > Network & Internet > SIMs." },
        { step: 2, title: "Add eSIM", description: "Tap 'Add eSIM' or the '+' button." },
        { step: 3, title: "Download SIM", description: "Select 'Download a SIM instead' if prompted." },
        { step: 4, title: "Scan QR Code", description: "Scan the QR code from your eSIM provider and confirm to install." },
      ];
  }
}

export const supportedBrands = ["Apple", "Samsung", "Google", "Xiaomi", "Huawei", "OnePlus", "OPPO", "Motorola"];
