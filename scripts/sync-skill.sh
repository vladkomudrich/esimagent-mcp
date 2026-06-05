#!/usr/bin/env bash
#
# Syncs the canonical eSIM Agent skill to the ClawHub publish staging dir.
#
# Source of truth: skills/esimagent/SKILL.md  (this repo)
#
# Destination:
#   - packaging/clawhub-skill/SKILL.md    (gitignored; used by `clawhub publish`)
#
# Usage:
#   scripts/sync-skill.sh                    # sync only
#   scripts/sync-skill.sh --publish 1.5.0    # sync and publish to ClawHub
#
# When --publish is used, also:
#   - Prompts for a changelog
#   - Runs `clawhub publish`

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SOURCE="$ROOT/skills/esimagent/SKILL.md"
CLAWHUB_DEST="$ROOT/packaging/clawhub-skill/SKILL.md"

if [[ ! -f "$SOURCE" ]]; then
  echo "✗ Source not found: $SOURCE" >&2
  exit 1
fi

echo "→ Syncing SKILL.md from canonical source"
echo "  source: $SOURCE"
echo "  dest:   $CLAWHUB_DEST"

mkdir -p "$(dirname "$CLAWHUB_DEST")"
cp "$SOURCE" "$CLAWHUB_DEST"
echo "✓ Synced"

if [[ "${1:-}" == "--publish" ]]; then
  VERSION="${2:-}"
  if [[ -z "$VERSION" ]]; then
    echo "✗ --publish requires a version argument (e.g., --publish 1.5.0)" >&2
    exit 1
  fi

  if ! command -v clawhub >/dev/null 2>&1; then
    echo "✗ clawhub CLI not found. Install: npm install -g clawhub" >&2
    exit 1
  fi

  read -rp "Changelog for v$VERSION: " CHANGELOG
  if [[ -z "$CHANGELOG" ]]; then
    echo "✗ Changelog required" >&2
    exit 1
  fi

  echo "→ Publishing esimagent@$VERSION to ClawHub"
  clawhub publish "$ROOT/packaging/clawhub-skill" \
    --slug esimagent \
    --name "eSIM Agent" \
    --version "$VERSION" \
    --tags travel,esim,mcp,http \
    --changelog "$CHANGELOG"
fi
