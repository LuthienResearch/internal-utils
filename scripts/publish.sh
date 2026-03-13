#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

LOCAL_VERSION=$(node -p "require('./package.json').version")
PUBLISHED_VERSION=$(npm view luthien-internal-utils version 2>/dev/null || echo "0.0.0")

if [ "$LOCAL_VERSION" = "$PUBLISHED_VERSION" ]; then
  echo "Local version ($LOCAL_VERSION) matches published. Bumping patch..."
  npm version patch --no-git-tag-version
  LOCAL_VERSION=$(node -p "require('./package.json').version")
  echo "New version: $LOCAL_VERSION"
fi

echo "Building..."
npm run build

echo "Publishing v$LOCAL_VERSION..."
npm publish --access public

echo "Done. Published luthien-internal-utils@$LOCAL_VERSION"
