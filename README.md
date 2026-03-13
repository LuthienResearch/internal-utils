# Luthien Internal Utils

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/LuthienResearch/internal-utils/main/install.sh)
```

Or if you already have Node.js: `npx luthien-internal-utils`

Interactive setup wizard for Luthien dev tools. Walks you through installing Claude Code plugins, MCP servers, and CLI utilities — each item is optional.

## What Gets Installed

### Luthien CLI

Installs the `luthien` CLI via pipx (`pipx install luthien-cli`) and optionally runs `luthien onboard` to set up the local AI Control gateway. If already installed, checks gateway health and offers to re-run onboarding if it's not running.

### Claude Code Plugins

| Plugin | Source | Description |
|--------|--------|-------------|
| `context7` | official | Query library documentation and code examples |
| `slack` | official | Search, read, and send Slack messages |
| `gotcha` | this repo | Record footguns, edge cases, and non-obvious behaviors |
| `refactor-pass` | this repo | Focused code cleanup with test verification |
| `trello` | this repo | Manage Trello boards, lists, and cards |
| `luthien-meta` | this repo | Overview of all Luthien tools (`/luthien` command) |

### MCP Servers

- **Seattle AI Safety Slack** — access the workspace via Claude Code's MCP tools

### CLI Tools

- **trello** — standalone Python CLI for Trello (no dependencies beyond stdlib)

## After Setup

Run `/luthien` in Claude Code for an overview of available tools and conventions.

## Development

### Publishing

```bash
./scripts/publish.sh
```

Auto-bumps the patch version if it matches the current published version, builds, and publishes.

### Adding a plugin

Create a directory under `plugins/` with a `plugin.json` and skills/commands. See existing plugins for the structure. Publish a new version after adding.

## License

[MIT](LICENSE)
