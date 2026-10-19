import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, describe, expect, it } from "vitest";

// Drives the built CLI with stdin closed, which is not a TTY. Without the
// guard, clack reads EOF and cancels with exit 0, leaving no scaffold and no
// explanation.
const CLI = fileURLToPath(new URL("../dist/index.js", import.meta.url));

function runCli(args: string[], cwd: string): Promise<{ code: number; stderr: string }> {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [CLI, ...args], { cwd });
    child.stdin.end();
    let stderr = "";
    child.stderr.on("data", (chunk) => (stderr += chunk));
    child.on("error", reject);
    child.on("close", (code) => resolve({ code: code ?? -1, stderr }));
  });
}

const root = await mkdtemp(path.join(tmpdir(), "create-newt-app-tty-"));

afterAll(async () => {
  await rm(root, { recursive: true, force: true });
});

describe("non-TTY stdin", () => {
  it("fails with a message instead of cancelling silently when prompts are needed", async () => {
    const cwd = path.join(root, "prompts");
    await mkdir(cwd);
    const { code, stderr } = await runCli(["my-app", "--no-install", "--no-git"], cwd);
    expect(code).toBe(1);
    expect(stderr).toContain("stdin is not a TTY");
  });

  it("still scaffolds when the prompts are skipped with a config flag", async () => {
    const cwd = path.join(root, "flags");
    await mkdir(cwd);
    const { code } = await runCli(["my-app", "--no-install", "--no-git", "--testing", "jest"], cwd);
    expect(code).toBe(0);
    expect(existsSync(path.join(cwd, "my-app", "pnpm-workspace.yaml"))).toBe(true);
  });
});
