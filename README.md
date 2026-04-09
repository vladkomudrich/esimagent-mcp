# esimagent-mcp

MCP server for [eSIM Agent](https://esimagent.vdigital.app) — search eSIM plans, compare providers, check device compatibility, and find deals through any MCP-compatible AI assistant.

## Quick Start

Add to your MCP client configuration:

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

### Requirements

- Node.js 18 or later
- No API key needed

## Available Tools

### `search_esim_plans`

Search eSIM data plans for a specific country with real-time pricing from multiple providers.

```
"Find me an eSIM plan for 2 weeks in Japan"
```

**Input:** `country` (string) — ISO country code (e.g., "JP") or country name (e.g., "Japan")

### `list_providers`

List all available eSIM providers with ratings, features, and links.

```
"Which eSIM providers have the best ratings?"
```

### `get_deals`

Get current active eSIM deals, discounts, and promo codes.

```
"Are there any eSIM deals right now?"
```

### `check_device_compatibility`

Check if a specific phone or tablet supports eSIM and get step-by-step installation instructions.

```
"Does my iPhone 14 support eSIM?"
```

**Input:** `device` (string) — Device name (e.g., "iPhone 15 Pro", "Galaxy S24")

### `list_supported_countries`

List countries where eSIM plans are available.

```
"Which countries can I get an eSIM for?"
```

**Input:** `search` (string, optional) — Filter by country name or code

## Example Conversations

- "I'm traveling to Thailand for 10 days, find me the best eSIM deal"
- "Compare eSIM providers for Europe"
- "Does the Samsung Galaxy S24 support eSIM? How do I set it up?"
- "Show me any active promo codes for eSIM plans"
- "What's the cheapest 5GB plan for Japan?"

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run locally
node dist/index.js
```

## License

MIT
