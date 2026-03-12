# Luthien Internal Utils

Dev utilities and Claude Code plugin marketplace for the Luthien team.

## Quick Start

```bash
npx luthien-internal-utils
```

This runs an interactive wizard that lets you install:

- **Claude Code plugins** — context7, slack, gotcha, refactor-pass, trello, luthien-meta
- **MCP servers** — Seattle AI Safety Slack
- **CLI tools** — Trello CLI

Each item is optional — you choose what to install.

## What's Included

### Plugins

| Plugin | Description |
|--------|-------------|
| `context7` | Query library documentation and code examples |
| `slack` | Search, read, and send Slack messages |
| `gotcha` | Record footguns, edge cases, and non-obvious behaviors |
| `refactor-pass` | Focused code cleanup with test verification |
| `trello` | Manage Trello boards, lists, and cards |
| `luthien-meta` | Overview of Luthien tools (`/luthien` command) |

### MCP Servers

- **Seattle AI Safety Slack** — access the workspace via Claude Code's MCP tools

### CLI Tools

- **trello** — standalone Python CLI for Trello (no dependencies beyond stdlib)

## After Setup

Run `/luthien` in Claude Code for an overview of all available tools and conventions.
