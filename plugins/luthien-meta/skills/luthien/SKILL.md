---
name: luthien
description: Overview of Luthien dev tools, plugins, MCP servers, and team conventions. Use when asking "what tools do we have", "how do I use X", or wanting an orientation to the Luthien dev environment.
user-invocable: true
---

# Luthien Dev Environment

Overview of tools and conventions for the Luthien team.

## Installed Plugins

### Core (via internal-utils wizard)
- **context7** — Query up-to-date library documentation and code examples. Invoke with: use context7 to look up docs for <library>.
- **slack** — Search, read, and send messages in Slack workspaces. Commands: `/slack:summarize-channel`, `/slack:find-discussions`, `/slack:channel-digest`, `/slack:standup`, `/slack:draft-announcement`.
- **gotcha** — Record footguns, edge cases, and non-obvious behaviors. Invoke with `/gotcha`.
- **refactor-pass** — Focused code cleanup: dead code removal, logic straightening, parameter reduction. Invoke with `/refactor-pass` or ask for a "cleanup pass".
- **trello** — Manage Trello boards, lists, and cards. Invoke with `/trello` or ask to "check trello".

### Recommended (install separately)
- **superpowers** — Planning, TDD, debugging, worktrees, parallel agents, code review. `claude plugin add superpowers`

## MCP Servers

### Seattle AI Safety Slack
Access the Seattle AI Safety Slack workspace via MCP tools. Provides `slack_search_public`, `slack_read_channel`, `slack_send_message`, and more.

Configured automatically by the setup wizard, or manually add to `~/.claude/settings.json`:
```json
{
  "mcpServers": {
    "slack-seattle-ai-safety": {
      "type": "http",
      "url": "https://mcp.slack.com/mcp",
      "oauth": {
        "clientId": "1601185624273.8899143856786",
        "callbackPort": 3118
      }
    }
  }
}
```

## CLI Tools

### trello
Standalone Python CLI for Trello. Install via the setup wizard or copy `scripts/trello` to your PATH.

Quick start:
1. Get API key at https://trello.com/power-ups/admin
2. Generate token with the URL shown when you run the script
3. Set `TRELLO_API_KEY` and `TRELLO_TOKEN` as env vars or edit the script
4. Run `trello boards` to verify

## Key Repositories

- **luthien-proxy** — AI Control gateway (FastAPI + LiteLLM). Policy enforcement, streaming, observability.
- **luthien-org** — Organization docs, feedback synthesis, requirements.
- **internal-utils** — This repo. Dev utilities and plugin marketplace.

## Team Conventions

- Use git worktrees for parallel feature work (`.worktrees/<branch>/`)
- Maintain `dev/context/` directories for persistent knowledge (learnings, decisions, gotchas)
- Plan before implementing — use superpowers brainstorming and writing-plans skills
- Run dev checks before committing (format, lint, typecheck, test)
