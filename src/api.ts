const BASE_URL = "https://esimagent.vdigital.app/api";
const USER_AGENT = "esimagent-mcp/0.4.0";
const TIMEOUT_MS = 15_000;

type ParamValue = string | number | undefined;

export async function fetchAPI<T>(
  path: string,
  params?: Record<string, ParamValue>
): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined) continue;
      url.searchParams.set(key, String(value));
    }
  }

  url.searchParams.set("utm_source", "mcp");
  url.searchParams.set("utm_medium", "ai");
  // Tag requests so /api/* endpoints generate buyUrl values attributed to
  // the stdio MCP in click_events analytics.
  if (!url.searchParams.has("source")) {
    url.searchParams.set("source", "stdio");
  }

  const response = await fetch(url.toString(), {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json() as Promise<T>;
}
