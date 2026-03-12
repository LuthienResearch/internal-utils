import { confirm } from "@inquirer/prompts";
import { execSync } from "node:child_process";
import { heading, success, skip, warn, info, runCommand, isCommandAvailable } from "../utils.js";

export async function installLuthienCli(): Promise<void> {
  heading("Luthien CLI");

  if (isCommandAvailable("luthien")) {
    const version = runCommand("luthien --version");
    info(`luthien CLI already installed${version.ok ? ` (${version.output})` : ""}`);

    const status = runCommand("luthien status");
    if (status.ok && status.output.includes("healthy")) {
      info("Gateway is running and healthy");
      return;
    }

    info("Gateway is not running locally");
    const onboard = await confirm({
      message: "Run luthien onboard to set up the local gateway?",
      default: true,
    });

    if (onboard) {
      info("Running luthien onboard (interactive)...");
      runInteractive("luthien onboard");
    } else {
      skip("Skipped onboarding");
    }
    return;
  }

  if (!isCommandAvailable("pipx")) {
    warn("pipx not found — needed to install luthien CLI");
    info("Install pipx: https://pipx.pypa.io/stable/installation/");
    return;
  }

  const install = await confirm({
    message: "Install luthien CLI? (AI Control gateway management)",
    default: true,
  });

  if (!install) {
    skip("Skipped luthien CLI");
    return;
  }

  info("Installing luthien-cli via pipx...");
  const result = runCommand("pipx install luthien-cli");

  if (!result.ok) {
    warn(`Failed to install: ${result.output}`);
    return;
  }
  success("Installed luthien CLI");

  const onboard = await confirm({
    message: "Run luthien onboard to set up the local gateway?",
    default: true,
  });

  if (onboard) {
    info("Running luthien onboard (interactive)...");
    runInteractive("luthien onboard");
  }
}

function runInteractive(cmd: string): void {
  try {
    execSync(cmd, { stdio: "inherit" });
    success("Onboarding complete");
  } catch {
    warn("Onboarding exited with an error — you can re-run with: luthien onboard");
  }
}
