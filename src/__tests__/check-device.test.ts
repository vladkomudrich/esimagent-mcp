import { describe, it, expect } from "vitest";
import { checkDeviceCompatibility } from "../tools/check-device.js";

describe("checkDeviceCompatibility", () => {
  it("returns supported with installation steps for exact match", () => {
    const result = checkDeviceCompatibility({ device: "iPhone 15 Pro" });

    expect(result).toContain("iPhone 15 Pro");
    expect(result).toContain("eSIM Support: YES");
    expect(result).toContain("Installation Steps:");
    expect(result).toContain("Open Settings");
    expect(result).toContain("Scan QR Code");
  });

  it("returns multiple matching models for partial match", () => {
    const result = checkDeviceCompatibility({ device: "iPhone 15" });

    expect(result).toContain("iPhone 15 Pro Max");
    expect(result).toContain("iPhone 15 Pro");
    expect(result).toContain("iPhone 15");
  });

  it("matches with brand prefix", () => {
    const result = checkDeviceCompatibility({ device: "Apple iPhone 16" });

    expect(result).toContain("iPhone 16");
    expect(result).toContain("eSIM Support: YES");
  });

  it("matches case-insensitively", () => {
    const result = checkDeviceCompatibility({ device: "iphone 15 pro" });

    expect(result).toContain("iPhone 15 Pro");
    expect(result).toContain("eSIM Support: YES");
  });

  it("reports unsupported device with upgrade suggestion", () => {
    const result = checkDeviceCompatibility({ device: "iPhone X" });

    expect(result).toContain("iPhone X");
    expect(result).toContain("eSIM Support: NO");
    expect(result).toContain("does not support eSIM");
    expect(result).toContain("Apple");
  });

  it("returns brand list and checker URL for unknown device", () => {
    const result = checkDeviceCompatibility({ device: "Nokia 3310" });

    expect(result).toContain('Could not find "Nokia 3310"');
    expect(result).toContain("Apple");
    expect(result).toContain("Samsung");
    expect(result).toContain("Google");
    expect(result).toContain("https://esimagent.vdigital.app/checker");
  });

  it("includes installation steps for supported Apple device", () => {
    const result = checkDeviceCompatibility({ device: "iPhone 16 Pro" });

    expect(result).toContain("Settings > Cellular");
    expect(result).toContain("Add eSIM");
  });

  it("includes Samsung-specific installation steps", () => {
    const result = checkDeviceCompatibility({ device: "Galaxy S24 Ultra" });

    expect(result).toContain("SIM Manager");
    expect(result).toContain("eSIM Support: YES");
  });

  it("includes Google/default installation steps for Pixel", () => {
    const result = checkDeviceCompatibility({ device: "Pixel 9 Pro" });

    expect(result).toContain("Network & Internet");
    expect(result).toContain("eSIM Support: YES");
  });

  it("includes checker URL in output for matched devices", () => {
    const result = checkDeviceCompatibility({ device: "iPhone 15 Pro" });

    expect(result).toContain("https://esimagent.vdigital.app/checker");
  });

  it("shows release year for matched devices", () => {
    const result = checkDeviceCompatibility({ device: "iPhone 15 Pro" });

    expect(result).toContain("2023");
  });

  it("shows installation method for supported devices", () => {
    const result = checkDeviceCompatibility({ device: "Galaxy S25 Ultra" });

    expect(result).toContain("Installation Method: QR");
  });

  it("reports unsupported Samsung device", () => {
    const result = checkDeviceCompatibility({ device: "Galaxy A54" });

    expect(result).toContain("eSIM Support: NO");
    expect(result).toContain("Samsung");
  });
});
