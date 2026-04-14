# esimagent-mcp

MCP server **and** Agent Skill for [eSIM Agent](https://esimagent.vdigital.app) — search eSIM plans, compare providers, check device compatibility, and find deals through any MCP-compatible AI assistant.

[![npm version](https://img.shields.io/npm/v/esimagent-mcp.svg)](https://www.npmjs.com/package/esimagent-mcp)

## What's in this repo

| Component | Purpose | Location |
|---|---|---|
| **MCP server (stdio)** | Local MCP server runnable via `npx` | `src/` |
| **Agent Skill** | Universal SKILL.md for any Agent Skills compatible client | `skills/esimagent/` |
| **Remote HTTP endpoint** | Hosted Streamable HTTP MCP server (no install) | `https://esimagent.vdigital.app/api/mcp/mcp` |

---

## Option 1: Remote HTTP MCP (recommended — no install)

The fastest way to use eSIM Agent with your AI client. Just add a URL to your MCP config:

```json
{
  "mcpServers": {
    "esim-agent": {
      "url": "https://esimagent.vdigital.app/api/mcp/mcp"
    }
  }
}
```

No Node.js, no `npm install`, always up-to-date. Works with any MCP client that supports HTTP transport (Claude Desktop, Claude Code, Cursor, Windsurf, and most modern clients).

Auto-discovery endpoint: `https://esimagent.vdigital.app/.well-known/mcp.json`

## Option 2: Local stdio MCP (this npm package)

Use this if your MCP client doesn't support HTTP transport:

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

**Requirements:** Node.js 18 or later. No API key needed.

## Option 3: Install as an Agent Skill

If your AI client supports [Agent Skills](https://docs.claude.com/en/docs/agent-skills) (Claude Code, OpenClaw, and others), you can install just the skill — it works with the remote HTTP MCP endpoint or falls back to the HTTP API.

### Claude Code (project-level)

```bash
mkdir -p .claude/skills
cp -r skills/esimagent .claude/skills/
```

### Claude Code (global)

```bash
mkdir -p ~/.claude/skills
cp -r skills/esimagent ~/.claude/skills/
```

### OpenClaw / ClawHub

```bash
clawhub install esimagent
```

Or visit: [clawhub.ai/vladkomudrich/esimagent](https://clawhub.ai/vladkomudrich/esimagent)

### Other Agent Skills clients

Copy `skills/esimagent/SKILL.md` into your client's skills directory. The format follows the standard Agent Skills YAML frontmatter spec.

---

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

## How Purchase Links Work

All tools return purchase links that include a partner/referral parameter. These partner links often apply exclusive discounts negotiated with the providers (typically 5-25% off versus the public website). Prices shown in tool output already reflect the discounted rate.

Tool invocations are logged server-side for service improvement (tool name, query parameters like country code, response counts). IP addresses are hashed before storage — no personal data is retained. Affiliate link clicks go through a tracked redirect that records the provider, plan, and country for attribution. Users can always visit providers directly by name if they prefer.

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Run locally
node dist/index.js
```

## Links

- [eSIM Agent website](https://esimagent.vdigital.app)
- [MCP documentation page](https://esimagent.vdigital.app/mcp)
- [npm package](https://www.npmjs.com/package/esimagent-mcp)
- [ClawHub skill](https://clawhub.ai/vladkomudrich/esimagent)
- [Model Context Protocol](https://modelcontextprotocol.io)

## License

MIT
