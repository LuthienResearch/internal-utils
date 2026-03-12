import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync, chmodSync } from "node:fs";
import { homedir } from "node:os";
import { join, dirname } from "node:path";
import chalk from "chalk";

export function heading(text: string): void {
  console.log(`\n${chalk.bold.cyan(text)}`);
  console.log(chalk.dim("─".repeat(text.length)));
}

export function success(text: string): void {
  console.log(chalk.green(`  ✓ ${text}`));
}

export function skip(text: string): void {
  console.log(chalk.dim(`  – ${text}`));
}

export function warn(text: string): void {
  console.log(chalk.yellow(`  ⚠ ${text}`));
}

export function info(text: string): void {
  console.log(chalk.dim(`  ${text}`));
}

export function runCommand(cmd: string): { ok: boolean; output: string } {
  try {
    const output = execSync(cmd, { encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] });
    return { ok: true, output: output.trim() };
  } catch (e: unknown) {
    const err = e as { stderr?: string; stdout?: string };
    return { ok: false, output: (err.stderr || err.stdout || "").trim() };
  }
}

export function claudeSettingsPath(): string {
  return join(homedir(), ".claude", "settings.json");
}

export function readClaudeSettings(): Record<string, unknown> {
  const path = claudeSettingsPath();
  if (!existsSync(path)) return {};
  try {
    return JSON.parse(readFileSync(path, "utf-8"));
  } catch {
    return {};
  }
}

export function writeClaudeSettings(settings: Record<string, unknown>): void {
  const path = claudeSettingsPath();
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(settings, null, 2) + "\n");
}

export function repoRoot(): string {
  // When run via npx, __dirname is inside the package's dist/ folder
  // The plugins/scripts/mcps dirs are siblings of dist/
  return join(dirname(new URL(import.meta.url).pathname), "..");
}

export function installScript(scriptName: string, targetDir: string): boolean {
  const source = join(repoRoot(), "scripts", scriptName);
  if (!existsSync(source)) {
    warn(`Script not found: ${source}`);
    return false;
  }

  mkdirSync(targetDir, { recursive: true });
  const target = join(targetDir, scriptName);
  copyFileSync(source, target);
  chmodSync(target, 0o755);
  return true;
}

export function isCommandAvailable(cmd: string): boolean {
  return runCommand(`which ${cmd}`).ok;
}
