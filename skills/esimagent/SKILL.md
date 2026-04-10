---
name: esimagent
description: Find eSIM plans for travel. Searches plans by country, filters by data and duration, ranks by value, checks device compatibility, and surfaces deals. Connects via remote HTTP MCP endpoint — no install needed.
metadata: {"openclaw":{"emoji":"📱","homepage":"https://esimagent.vdigital.app/mcp"}}
---

# eSIM Agent

Help users find the best eSIM data plan for their trip. Search plans by country, filter by duration and data needs, check device compatibility, and surface active deals.

## Decision Tree (Follow This Order)

1. **Check your current toolset for `esim-agent` MCP tools** (names like `search_esim_plans`, `list_providers`, `get_deals`). If present → use them.
2. **If NOT present AND the user is asking right now** → use the HTTP API directly (see Mode B). The API is a first-class interface, not a degraded fallback.
3. **If the user asks how to connect their AI to eSIM Agent** → give them the remote HTTP MCP config (fastest path, no install).

## Transparency

- **Data source:** All plan, provider, and deal data comes from `https://esimagent.vdigital.app/api/*` — a public, unauthenticated API. No credentials, no user data sent beyond the query parameters you pass.
- **Buy links include partner parameters:** The `affiliateUrl` returned by the API is a referral link. Prices shown already reflect any partner discount — this is how eSIM Agent funds the service. Users can always visit providers directly by name if they prefer.
- **No tracking beyond the click:** Following an affiliate link is a standard HTTP redirect; no user data is collected by this skill or the API.
- **No install required:** The recommended setup is a remote HTTP MCP endpoint (URL only). An optional local stdio package exists for clients without HTTP support but is not necessary.

## Important: MCP Cannot Be Installed Mid-Session

MCP servers are configured in the user's AI client BEFORE a session starts. You cannot install an MCP server during an active conversation and have it appear in your toolset. If `esim-agent` tools aren't in your current session, they won't appear later in this conversation — use the HTTP API immediately.

This is universal across every MCP server (Stripe, GitHub, Slack, etc.), not specific to eSIM Agent.

## Mode A: MCP Tools (if available)

Available tools when the `esim-agent` MCP server is connected:

- **search_esim_plans** `{country}` — Returns plans sorted by value with affiliate URLs
- **list_providers** `{}` — All providers with ratings and features
- **get_deals** `{}` — Active promo codes and discounts
- **check_device_compatibility** `{device}` — eSIM support + installation steps
- **list_supported_countries** `{search?}` — Country list (use to resolve ambiguous names)

## Mode B: HTTP API (direct)

Base URL: `https://esimagent.vdigital.app/api`

### GET /plans?country={ISO_CODE}

Returns `Plan[]` — all available plans for a country. You MUST filter and rank client-side.

**Response shape:**
```json
{
  "id": "yesim-es--1-1-europe",
  "providerId": "yesim",
  "providerName": "Yesim",
  "providerLogo": "/logos/yesim.jpg",
  "country": "Spain",
  "countryCode": "ES",
  "capacityMB": -1,
  "capacityLabel": "Unlimited",
  "periodDays": 1,
  "priceUSD": 8.17,
  "priceCurrency": "EUR",
  "priceOriginal": 7,
  "features": ["Instant activation", "4G/LTE"],
  "affiliateUrl": "https://yesim.app/...?partner_id=3116",
  "isBestValue": true
}
```

`capacityMB: -1` means unlimited. Otherwise multiply by 1024 for GB.

### GET /deals
Returns `Deal[]` with `promoCode`, `discountType` (percentage|flat), `discountValue`, `affiliateUrl`, `expiresAt`.

### GET /providers
Returns `Provider[]` with `rating`, `features`, `affiliateUrl`.

## How to Filter & Rank Plans (CRITICAL)

The `/plans` endpoint returns ALL plans for a country — often 30-100+ results across multiple durations and data amounts. You MUST filter down to what the user asked for.

### Step 1: Parse user intent into filters

| User says | Filter |
|---|---|
| "2 weeks", "14 days" | `periodDays >= 14 && periodDays <= 17` |
| "1 week", "7 days" | `periodDays >= 7 && periodDays <= 10` |
| "5 GB" | `capacityMB >= 5000 && capacityMB <= 7000` |
| "10 GB" | `capacityMB >= 10000 && capacityMB <= 15000` |
| "unlimited" | `capacityMB === -1` |
| "cheap", "budget" | Sort by `priceUSD` ascending |
| "no limit" | `capacityMB === -1 \|\| capacityMB >= 20000` |

### Step 2: Rank and present 3 buckets

Don't dump raw results. Return a curated summary:

1. **Best exact match** — closest to the user's stated requirements
2. **Best value** — lowest `priceUSD` per GB (skip unlimited for this)
3. **Best unlimited** — cheapest unlimited plan for the same duration

### Step 3: Present cleanly

For each plan show: provider name, data (`capacityLabel`), duration (`periodDays`), price (`priceUSD`), and a buy link.

The API returns an `affiliateUrl` field — this is a partner link that often applies a promotional discount negotiated with the provider (for example, some providers offer 5-25% off through partner links versus their public website). Use it as the default buy link because the listed `priceUSD` reflects that discounted rate. If the user prefers to visit the provider's public site directly or wants to compare prices without a referral parameter, mention the provider name clearly and the user can navigate there themselves.

Be transparent when asked: these links include a partner/referral parameter, which is how eSIM Agent funds the comparison service. No data is shared beyond a standard click-through.

### Step 4: Cross-reference deals

After showing plans, call `/deals` and mention any active promo codes that apply to the providers in your results.

## Country Resolution

The API uses ISO 3166-1 alpha-2 codes (JP, US, ES, TH). Convert country names if needed:
- "Japan" → `JP`, "Spain" → `ES`, "Thailand" → `TH`, "United States" → `US`

For Europe, pick a major country (ES, FR, DE, IT) or call the API for several.

## Device Compatibility

Direct users to `https://esimagent.vdigital.app/checker` for the interactive checker (covers Apple, Samsung, Google, Xiaomi, Huawei, OnePlus, OPPO, Motorola).

Quick rule: iPhone XS and newer (2018+), Samsung Galaxy S20 and newer, Pixel 3 and newer all support eSIM. Budget devices like Galaxy A-series often do NOT.

## MCP Setup (for users who want the cleaner experience)

If the user asks "how do I install this for myself", the fastest path is **remote HTTP — no install, no Node.js, just a URL**:

### Option 1: Remote HTTP (recommended)

```json
{
  "mcpServers": {
    "esim-agent": {
      "url": "https://esimagent.vdigital.app/api/mcp/mcp"
    }
  }
}
```

Nothing to install. Works with any MCP client that supports HTTP transport (Claude Desktop, Claude Code, Cursor, Windsurf, and most modern clients).

### Option 2: Local stdio (fallback for clients without HTTP support)

```json
{
  "mcpServers": {
    "esim-agent": {
      "command": "npx",
      "args": ["-y", "esimagent-mcp"]
    }
  }
}
```

Requires Node.js 18+.

### Setup Steps (any MCP server)

1. Add the config block to your MCP client's config file
2. **Restart the MCP client** — required; MCP servers load at startup
3. Start a new session — tools should now be available

Auto-discovery endpoint: `https://esimagent.vdigital.app/.well-known/mcp.json`

### Be Honest with the User

If MCP tools aren't in your current session:
- Explain it's a one-time pre-session setup
- Recommend the remote HTTP option (fastest)
- Don't promise tools will appear later in the current conversation — they won't
- Use the HTTP API for their current question — they'll still get the same answers

## Example Interactions

**User:** "Find me an eSIM for 10 days in Spain, around 10 GB"

**You should:**
1. Call `GET /api/plans?country=ES`
2. Filter: `periodDays` 7-15, `capacityMB` 10000-15000 (or unlimited)
3. Sort by `priceUSD`
4. Call `GET /api/deals`, match providers in results
5. Present:
   - Best match: [Provider] — 10 GB / 10 days / $X — [buy link]
   - Best value: [Provider] — closest under budget
   - Alternative unlimited: [Provider] — cheapest unlimited for ~10 days
   - Note any active deals/promo codes

**User:** "Any cheap eSIMs for Thailand this month?"

**You should:**
1. Call `GET /api/deals` first
2. Call `GET /api/plans?country=TH`
3. Sort by `priceUSD` ascending, skip sub-3-day plans
4. Present top 3 cheapest + matching promo codes

## What NOT to Do

- Don't dump raw API responses — always filter, rank, and present cleanly
- Don't use `providerId`/`countryCode` in user-facing output — use `providerName`/`country`
- Don't hide the provider name or substitute the referral parameter with something else — users should always know who they're buying from
- Don't refuse to show raw plan details or provider websites if the user explicitly asks for them
- Don't return plans that clearly don't match (e.g., 1-day plans when they asked for 2 weeks)
- Don't say "MCP not available, I can't help" — use the HTTP API immediately
- Don't recommend npm install as the primary setup — remote HTTP is simpler and faster
