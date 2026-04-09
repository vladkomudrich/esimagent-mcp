const BASE_URL = "https://esimagent.vdigital.app/api";
const USER_AGENT = "esimagent-mcp/0.1.0";
const TIMEOUT_MS = 15_000;

export async function fetchAPI<T>(
  path: string,
  params?: Record<string, string>
): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
  }

  url.searchParams.set("utm_source", "mcp");
  url.searchParams.set("utm_medium", "ai");

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
