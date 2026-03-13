#!/usr/bin/env bash
set -euo pipefail

# Luthien Internal Utils — one-liner installer
# bash <(curl -fsSL https://raw.githubusercontent.com/LuthienResearch/internal-utils/main/install.sh)

if command -v npx &>/dev/null; then
  exec npx luthien-internal-utils "$@"
fi

echo "npx not found. Installing Node.js..."

if command -v apt-get &>/dev/null; then
  echo "Installing via apt..."
  sudo apt-get update -qq && sudo apt-get install -y -qq nodejs npm
elif command -v brew &>/dev/null; then
  echo "Installing via Homebrew..."
  brew install node
elif command -v dnf &>/dev/null; then
  echo "Installing via dnf..."
  sudo dnf install -y nodejs npm
elif command -v pacman &>/dev/null; then
  echo "Installing via pacman..."
  sudo pacman -S --noconfirm nodejs npm
else
  echo "Could not auto-install Node.js. Please install it manually:"
  echo "  https://nodejs.org/en/download"
  exit 1
fi

if ! command -v npx &>/dev/null; then
  echo "npx still not found after installing Node.js. Please check your installation."
  exit 1
fi

exec npx luthien-internal-utils "$@"
