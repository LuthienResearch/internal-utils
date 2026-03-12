---
name: trello
description: Manage Trello boards, lists, and cards via the Trello REST API. Use when the user asks to check Trello, manage cards, update boards, or interact with Trello in any way.
user-invocable: true
---

# Trello Integration

Interact with Trello boards, lists, and cards using the `trello` CLI tool.

## Prerequisites

The `trello` CLI must be installed (available via `luthien-internal-utils` setup wizard). It requires `TRELLO_API_KEY` and `TRELLO_TOKEN` environment variables to be set.

## Available Commands

| Command | Usage | Description |
|---------|-------|-------------|
| `trello boards` | List your boards | Shows all open boards with IDs |
| `trello lists <board>` | List lists on a board | Board can be name (substring match) or ID |
| `trello labels <board>` | List labels on a board | Shows label IDs, colors, and names |
| `trello cards <list-or-board>` | List cards | Use `-l <label>` to filter by label |
| `trello card <card-id>` | Show card details | Full card info including description |
| `trello create <list-id> <name>` | Create a card | Options: `-d <desc>`, `-l <labels>`, `-m <member>` |
| `trello move <card-id> <list-id>` | Move card to list | |
| `trello assign <card-id> <member-id>` | Assign card | |
| `trello label <card-id> <label-id>` | Add label to card | |
| `trello comment <card-id> <text>` | Add comment | |
| `trello rename <card-id> <name>` | Rename card | |
| `trello archive <card-id>` | Archive card | |
| `trello search <board> <query>` | Search cards | |
| `trello me` | Show your member info | |

## Workflow

1. Run `trello boards` to find the board
2. Run `trello lists <board-name>` to find lists
3. Use card commands with the appropriate IDs

Board names support substring matching — you don't need the full name or ID.
