# LuthienResearch/internal-utils Design

## Purpose

A public repo providing dev utilities for the Luthien team, structured as a Claude Code plugin marketplace with an interactive setup wizard.

## Wizard

**Invocation:** `npx luthien-internal-utils`

Interactive CLI that walks users through installing plugins, MCP servers, and scripts. Each item is presented with a description and y/n prompt. Nothing is installed without explicit user consent.

### Wizard Steps

1. **Claude Code Plugins** — for each of:
   - `context7` — library documentation queries (already published, `claude plugin add context7`)
   - `slack` — Slack workspace interaction (already published, `claude plugin add slack`)
   - `gotcha` — record footguns/edge cases (bundled in this repo)
   - `refactor-pass` — code cleanup workflows (bundled in this repo)
   - `trello` — Trello board management via Claude Code (bundled in this repo)

2. **MCP Servers** — offer to add to `~/.claude/settings.json`:
   - Seattle AI Safety Slack (`https://mcp.slack.com/mcp`, OAuth with clientId `1601185624273.8899143856786`, callbackPort 3118)

3. **Trello CLI** — standalone Python script for `~/bin` or `~/.local/bin`
   - Credentials stored as blank constants at top of file, user fills in
   - Subcommands: boards, lists, cards, create, move, assign, label, comment, search, etc.

4. **Summary** — show what was installed/skipped

## Repo Structure

```
internal-utils/
├── package.json                    # npm package, "bin" entry for npx
├── tsconfig.json
├── src/
│   ├── wizard.ts                   # Main CLI entry point
│   ├── steps/
│   │   ├── plugins.ts              # Plugin installation step
│   │   ├── mcps.ts                 # MCP server configuration step
│   │   └── scripts.ts              # Script installation step
│   └── utils.ts                    # Shared helpers (exec, file ops, prompts)
├── plugins/
│   ├── gotcha/
│   │   ├── plugin.json
│   │   └── skills/gotcha/SKILL.md
│   ├── refactor-pass/
│   │   ├── plugin.json
│   │   └── skills/refactor-pass/SKILL.md
│   └── trello/
│       ├── plugin.json
│       ├── skills/trello/SKILL.md
│       └── commands/trello.md      # /trello slash command
├── scripts/
│   └── trello                      # Standalone Python CLI
├── mcps/
│   └── slack-seattle-ai-safety.json
└── skills/
    └── luthien/SKILL.md            # /luthien overview (bundled in a meta plugin or standalone)
```

## Plugins

### gotcha (bundled)
Extracted from `~/.claude/skills/gotcha/SKILL.md`. Records footguns, edge cases, and non-obvious behaviors to project documentation.

### refactor-pass (bundled)
Extracted from `~/.claude/skills/refactor-pass/SKILL.md`. Focused simplification pass on recent changes — dead code removal, logic straightening, parameter reduction — verified by build/tests.

### trello (bundled, new)
New plugin wrapping the trello CLI script. Provides a `/trello` command and a skill for Claude to understand how to interact with Trello boards, lists, and cards.

### context7 (reference only)
Already published. Wizard runs `claude plugin add context7`.

### slack (reference only)
Already published. Wizard runs `claude plugin add slack`.

## /luthien Skill

Bundled in a `luthien-meta` plugin (or in the trello plugin if we want to minimize plugin count). Provides:
- Overview of all available tools and what they do
- How to use the trello CLI
- How to access the Seattle AI Safety Slack via MCP
- Links to luthien-proxy, luthien-org repos
- Team conventions and workflows

## Tech Stack

- **TypeScript** for wizard CLI
- **@inquirer/prompts** for interactive prompts
- **chalk** for colored output
- **execa** for running shell commands
- Published to npm as `luthien-internal-utils`

## Non-Goals

- No dev_checks.sh or project templates (already in luthien-proxy)
- No superpowers plugin (users install separately)
- No machine-specific scripts (agog, etc.)
