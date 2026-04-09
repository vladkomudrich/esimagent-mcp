import { devices, getInstallationSteps, supportedBrands } from "../data/devices.js";

export function checkDeviceCompatibility(args: { device: string }): string {
  const query = args.device.toLowerCase().trim();

  // Find matching devices (case-insensitive substring match)
  const matches = devices.filter(
    (d) =>
      d.model.toLowerCase().includes(query) ||
      `${d.brand} ${d.model}`.toLowerCase().includes(query)
  );

  if (matches.length === 0) {
    return [
      `Could not find "${args.device}" in our device database.`,
      "",
      "We have data for the following brands:",
      ...supportedBrands.map((b) => `  - ${b}`),
      "",
      "Your device might still support eSIM. Check our compatibility tool for the full database:",
      "https://esimagent.vdigital.app/checker",
    ].join("\n");
  }

  const lines: string[] = [];

  for (const device of matches) {
    lines.push(`--- ${device.brand} ${device.model} (${device.releaseYear}) ---`);

    if (device.esimSupported) {
      lines.push(`  eSIM Support: YES`);
      lines.push(`  Installation Method: ${device.installMethod.toUpperCase()}`);
      lines.push("");
      lines.push("  Installation Steps:");

      const steps = getInstallationSteps(device.brand);
      for (const step of steps) {
        lines.push(`    ${step.step}. ${step.title}: ${step.description}`);
      }
    } else {
      lines.push(`  eSIM Support: NO`);
      lines.push(
        `  This device does not support eSIM. Consider upgrading to a newer model from ${device.brand}.`
      );
    }

    lines.push("");
  }

  lines.push(
    `Full compatibility checker: https://esimagent.vdigital.app/checker`
  );

  return lines.join("\n");
}
