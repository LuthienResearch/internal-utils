import { confirm } from "@inquirer/prompts";
import { heading, success, skip, warn, info, runCommand } from "../utils.js";

const MARKETPLACE_NAME = "luthien-internal-utils";
const MARKETPLACE_SOURCE = "LuthienResearch/internal-utils";

interface PluginDef {
  name: string;
  description: string;
  source: "official" | "luthien";
}

const PLUGINS: PluginDef[] = [
  {
    name: "context7",
    description: "Query up-to-date library documentation and code examples",
    source: "official",
  },
  {
    name: "slack",
    description: "Search, read, and send Slack messages",
    source: "official",
  },
  {
    name: "gotcha",
    description: "Record footguns, edge cases, and non-obvious behaviors",
    source: "luthien",
  },
  {
    name: "refactor-pass",
    description: "Focused code cleanup — dead code, logic straightening, parameter reduction",
    source: "luthien",
  },
  {
    name: "trello",
    description: "Manage Trello boards, lists, and cards via CLI",
    source: "luthien",
  },
  {
    name: "luthien-meta",
    description: "Overview of Luthien dev tools, /luthien command",
    source: "luthien",
  },
];

function ensureMarketplace(): boolean {
  const check = runCommand("claude plugin marketplace list");
  if (check.ok && check.output.includes(MARKETPLACE_NAME)) {
    return true;
  }

  info("Adding Luthien marketplace...");
  const result = runCommand(
    `claude plugin marketplace add ${MARKETPLACE_SOURCE}`
  );
  if (!result.ok) {
    warn(`Failed to add marketplace: ${result.output}`);
    return false;
  }
  success("Added Luthien plugin marketplace");
  return true;
}

export async function installPlugins(): Promise<void> {
  heading("Claude Code Plugins");

  if (!runCommand("which claude").ok) {
    warn("Claude Code CLI not found. Skipping plugin installation.");
    info("Install it from https://docs.anthropic.com/en/docs/claude-code");
    return;
  }

  const hasLuthien = PLUGINS.some((p) => p.source === "luthien");
  let marketplaceReady = false;

  if (hasLuthien) {
    marketplaceReady = ensureMarketplace();
  }

  for (const plugin of PLUGINS) {
    if (plugin.source === "luthien" && !marketplaceReady) {
      skip(`Skipped ${plugin.name} (marketplace not available)`);
      continue;
    }

    const install = await confirm({
      message: `Install ${plugin.name}? ${dim(plugin.description)}`,
      default: true,
    });

    if (!install) {
      skip(`Skipped ${plugin.name}`);
      continue;
    }

    const qualifier = plugin.source === "luthien"
      ? `${plugin.name}@${MARKETPLACE_NAME}`
      : plugin.name;

    const result = runCommand(`claude plugin install ${qualifier}`);

    if (result.ok) {
      success(`Installed ${plugin.name}`);
    } else {
      warn(`Failed to install ${plugin.name}: ${result.output}`);
    }
  }
}

function dim(text: string): string {
  return `\x1b[2m(${text})\x1b[0m`;
}
