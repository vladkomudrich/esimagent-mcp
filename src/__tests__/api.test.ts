import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fetchAPI } from "../api.js";

describe("fetchAPI", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  const mockFetch = () => vi.mocked(globalThis.fetch);

  it("appends UTM params to all requests", async () => {
    mockFetch().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 })
    );

    await fetchAPI("/plans");

    const calledUrl = mockFetch().mock.calls[0][0] as string;
    expect(calledUrl).toContain("utm_source=mcp");
    expect(calledUrl).toContain("utm_medium=ai");
  });

  it("passes custom params through", async () => {
    mockFetch().mockResolvedValue(
      new Response(JSON.stringify([]), { status: 200 })
    );

    await fetchAPI("/plans", { country: "JP" });

    const calledUrl = mockFetch().mock.calls[0][0] as string;
    expect(calledUrl).toContain("country=JP");
  });

  it("sets User-Agent header", async () => {
    mockFetch().mockResolvedValue(
      new Response(JSON.stringify([]), { status: 200 })
    );

    await fetchAPI("/plans");

    const calledOptions = mockFetch().mock.calls[0][1] as RequestInit;
    const headers = calledOptions.headers as Record<string, string>;
    expect(headers["User-Agent"]).toMatch(/^esimagent-mcp\/\d+\.\d+\.\d+/);
  });

  it("sets Accept header to application/json", async () => {
    mockFetch().mockResolvedValue(
      new Response(JSON.stringify([]), { status: 200 })
    );

    await fetchAPI("/plans");

    const calledOptions = mockFetch().mock.calls[0][1] as RequestInit;
    const headers = calledOptions.headers as Record<string, string>;
    expect(headers["Accept"]).toBe("application/json");
  });

  it("throws on non-OK response with status info", async () => {
    mockFetch().mockResolvedValue(
      new Response("Not Found", { status: 404, statusText: "Not Found" })
    );

    await expect(fetchAPI("/missing")).rejects.toThrow(
      "API request failed: 404 Not Found"
    );
  });

  it("throws on server error", async () => {
    mockFetch().mockResolvedValue(
      new Response("Internal Server Error", {
        status: 500,
        statusText: "Internal Server Error",
      })
    );

    await expect(fetchAPI("/broken")).rejects.toThrow("500");
  });

  it("uses AbortSignal for timeout", async () => {
    mockFetch().mockResolvedValue(
      new Response(JSON.stringify([]), { status: 200 })
    );

    await fetchAPI("/plans");

    const calledOptions = mockFetch().mock.calls[0][1] as RequestInit;
    expect(calledOptions.signal).toBeDefined();
  });

  it("constructs URL with base path", async () => {
    mockFetch().mockResolvedValue(
      new Response(JSON.stringify([]), { status: 200 })
    );

    await fetchAPI("/providers");

    const calledUrl = mockFetch().mock.calls[0][0] as string;
    expect(calledUrl).toContain("esimagent.vdigital.app/api/providers");
  });

  it("returns parsed JSON response", async () => {
    const data = [{ id: "1", name: "Test" }];
    mockFetch().mockResolvedValue(
      new Response(JSON.stringify(data), { status: 200 })
    );

    const result = await fetchAPI("/test");

    expect(result).toEqual(data);
  });
});
