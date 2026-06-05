# esimagent-mcp — Development Guide

Standalone **MCP server** + **Agent Skill** for eSIM Agent. This repo is the
canonical source for the npm package `esimagent-mcp` and the ClawHub skill
`esimagent`. It is a sibling of the main app repo.

```
~/Code/Apps/
├── esim/             # the Next.js app (esimagent) — owns the HTTP MCP route
└── esimagent-mcp/    # THIS repo — stdio MCP server + canonical Agent Skill
```

## What ships from here

| Artifact | Path | Channel | Publish |
|---|---|---|---|
| stdio MCP server | `src/` | npm `esimagent-mcp` | `npm publish` |
| Agent Skill (canonical) | `skills/esimagent/SKILL.md` | ClawHub + GitHub | `npm run skill:publish -- X.Y.Z` |
| README | `README.md` | npmjs.com | bundled with `npm publish` |

The five tools: `search_esim_plans`, `list_providers`, `get_deals`,
`check_device_compatibility`, `list_supported_countries`.

## Cross-repo dependency (READ THIS)

There are **two** implementations of the same five tools, and they must stay in
behavioral sync:

1. **This repo** — stdio server. Tools call `esimagent.vdigital.app/api/*` over
   HTTP with UTM params (`utm_source=mcp&utm_medium=ai`), except device/country
   tools which read **embedded data** in `src/data/`.
2. **The app repo** (`../esim`) — HTTP MCP route at
   `src/app/api/mcp/[transport]/route.ts`, using internal adapters directly.

When you change tool behavior, schemas, descriptions, or the response/URL format
**here**, you must also:

- Mirror it in the app's HTTP route (`../esim/src/app/api/mcp/[transport]/route.ts`).
- Run the app's doc-sync pass from the app repo: `/sync-mcp-docs` (it updates
  the app-side surfaces: llms.txt, discovery endpoints, about page, README).
- Update `skills/esimagent/SKILL.md` here so the skill documents the new behavior.

**Embedded data sync:** `src/data/countries.ts` and `src/data/devices.ts` are
copies derived from the app's `../esim/src/data/`. When the app's country or
device data changes, re-sync these and ship a new npm version.

The reverse direction (app changes that must reflect here) is driven from the app
repo's `esim-mcp-dev` and `sync-mcp-docs` skills.

## Publish workflows

### npm package
```bash
# 1. Edit src/**
# 2. Bump version
npm version patch --no-git-tag-version
# 3. Publish (needs NPM_TOKEN in env; .npmrc reads ${NPM_TOKEN})
set -a; source .env.local; set +a   # or: source ../esim/.env.local
npm publish --access public
# 4. Commit + push this repo
git add -A && git commit -m "chore: release X.Y.Z" && git push
```

### Agent Skill (ClawHub)
```bash
# 1. Edit skills/esimagent/SKILL.md (canonical)
# 2. Sync + publish (prompts for changelog)
npm run skill:publish -- 1.5.0
# 3. Commit + push
git add skills/esimagent/SKILL.md && git commit -m "..." && git push
```

`npm run skill:sync` copies the canonical SKILL.md into the gitignored
`packaging/clawhub-skill/` staging dir before `clawhub publish`. Never edit the
packaging copy directly.

## Secrets

- `NPM_TOKEN` — granular npm token (bypass 2FA). Keep in `.env.local` (gitignored)
  or source the app repo's `.env.local`. `.npmrc` references it as `${NPM_TOKEN}`.
- `CLAWHUB_TOKEN` — stored by `clawhub auth login`.

Never commit either. `.npmrc`, `.env.local`, and `packaging/clawhub-skill/SKILL.md`
are gitignored.

## Tool response conventions

- Text output, not JSON — LLMs consume formatted text better.
- Cap results at 20 to avoid flooding LLM context.
- Always include the click-tracked buy URL from the API; raw `affiliateUrl`
  disclosed on request for transparency.
- Footer link to the website in every response.
- Graceful errors with fallback URLs — never throw.
