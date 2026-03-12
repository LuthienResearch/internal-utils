import { confirm, select } from "@inquirer/prompts";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { heading, success, skip, warn, info, installScript, isCommandAvailable } from "../utils.js";

interface ScriptDef {
  name: string;
  description: string;
  file: string;
}

const SCRIPTS: ScriptDef[] = [
  {
    name: "trello",
    description: "Lightweight Trello REST API CLI (Python, no dependencies)",
    file: "trello",
  },
];

export async function installScripts(): Promise<void> {
  heading("CLI Scripts");

  for (const script of SCRIPTS) {
    if (isCommandAvailable(script.file)) {
      info(`${script.name} already on PATH`);
      continue;
    }

    const install = await confirm({
      message: `Install ${script.name} CLI? (${script.description})`,
      default: true,
    });

    if (!install) {
      skip(`Skipped ${script.name}`);
      continue;
    }

    const targetDir = await select({
      message: "Install to:",
      choices: [
        { name: "~/bin", value: join(homedir(), "bin") },
        { name: "~/.local/bin", value: join(homedir(), ".local", "bin") },
      ],
    });

    if (installScript(script.file, targetDir)) {
      const target = join(targetDir, script.file);
      success(`Installed ${script.name} to ${target}`);

      // Check if target dir is on PATH
      const pathDirs = (process.env.PATH || "").split(":");
      if (!pathDirs.includes(targetDir)) {
        warn(`${targetDir} is not on your PATH`);
        info(`Add to your shell profile: export PATH="${targetDir}:$PATH"`);
      }

      info("Edit the script to add your TRELLO_API_KEY and TRELLO_TOKEN");
      info("Get your API key at: https://trello.com/power-ups/admin");
    } else {
      warn(`Failed to install ${script.name}`);
    }
  }
}
