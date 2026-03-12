import { confirm } from "@inquirer/prompts";
import { heading, success, skip, warn, info, readClaudeSettings, writeClaudeSettings } from "../utils.js";

interface McpDef {
  name: string;
  description: string;
  config: Record<string, unknown>;
}

const MCPS: McpDef[] = [
  {
    name: "Seattle AI Safety Slack",
    description: "Access the Seattle AI Safety Slack workspace via MCP",
    config: {
      "slack-seattle-ai-safety": {
        type: "http",
        url: "https://mcp.slack.com/mcp",
        oauth: {
          clientId: "1601185624273.8899143856786",
          callbackPort: 3118,
        },
      },
    },
  },
];

export async function installMcps(): Promise<void> {
  heading("MCP Servers");

  for (const mcp of MCPS) {
    const settings = readClaudeSettings();
    const existing = (settings.mcpServers as Record<string, unknown>) || {};
    const key = Object.keys(mcp.config)[0];

    if (existing[key]) {
      info(`${mcp.name} already configured`);
      continue;
    }

    const install = await confirm({
      message: `Add ${mcp.name}? (${mcp.description})`,
      default: true,
    });

    if (!install) {
      skip(`Skipped ${mcp.name}`);
      continue;
    }

    const freshSettings = readClaudeSettings();
    const mcpServers = (freshSettings.mcpServers as Record<string, unknown>) || {};
    Object.assign(mcpServers, mcp.config);
    freshSettings.mcpServers = mcpServers;
    writeClaudeSettings(freshSettings);
    success(`Added ${mcp.name} to ~/.claude/settings.json`);
    info("You'll be prompted to authenticate on first use");
  }
}
