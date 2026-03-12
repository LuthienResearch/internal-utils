#!/usr/bin/env node

import chalk from "chalk";
import { installPlugins } from "./steps/plugins.js";
import { installMcps } from "./steps/mcps.js";
import { installScripts } from "./steps/scripts.js";
import { installLuthienCli } from "./steps/luthien-cli.js";

async function main(): Promise<void> {
  console.log(chalk.bold.cyan("\n  Luthien Internal Utils Setup\n"));
  console.log(chalk.dim("  Interactive wizard for setting up Luthien dev tools."));
  console.log(chalk.dim("  Each item is optional — you choose what to install.\n"));

  await installLuthienCli();
  await installPlugins();
  await installMcps();
  await installScripts();

  console.log(chalk.bold.green("\n  Setup complete!\n"));
  console.log(chalk.dim("  Run /luthien in Claude Code for an overview of available tools."));
  console.log();
}

main().catch((err) => {
  if (err.name === "ExitPromptError") {
    console.log(chalk.dim("\n  Setup cancelled.\n"));
    process.exit(0);
  }
  console.error(err);
  process.exit(1);
});
