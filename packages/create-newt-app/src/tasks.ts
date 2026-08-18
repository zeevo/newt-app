import { randomBytes } from "node:crypto";
import { execa } from "execa";
import type { Module, Selection, TemplateData } from "./templates";
import { versions } from "./templates/versions.js";
import {
  renderTemplatesToDisk,
  sortPackageJsons,
  updatePackageJson,
  updateScripts,
  validateProjectName,
} from "./utils.js";

export async function scaffold(
  modules: Module[],
  options: {
    name: string;
    testing: "jest" | "vitest";
    database: "sqlite" | "postgres";
    deployment: TemplateData["deployment"];
    selection: Selection;
  },
) {
  const validation = validateProjectName(options.name);
  if (!validation.valid) {
    console.error(`Error: ${validation.error}`);
    process.exit(1);
  }

  const templateData: TemplateData = {
    projectName: options.name,
    testing: options.testing,
    database: options.database,
    deployment: options.deployment,
    mode: options.selection.mode,
    authSecret: randomBytes(32).toString("base64url"),
    versions,
  };

  await renderTemplatesToDisk(modules, options.name, templateData, options.selection);

  const packages = modules
    .map((mod) => mod.packages)
    .filter((ele) => ele !== undefined)
    .flat()
    .filter((pkg) => pkg.when?.(options.selection) ?? true);

  if (packages.length > 0) {
    await updatePackageJson(options.name, packages, templateData);
  }

  const scripts = modules
    .map((mod) => mod.scripts)
    .filter((ele) => ele !== undefined)
    .flat()
    .filter((script) => script.when?.(options.selection) ?? true);

  if (scripts.length > 0) {
    await updateScripts(options.name, scripts, templateData);
  }

  await sortPackageJsons(options.name);
}

// execa throws ENOENT when the binary is not on PATH. Every tool we shell out
// to answers --version, so this doubles as a liveness check.
export async function hasCommand(command: string) {
  try {
    await execa(command, ["--version"]);
    return true;
  } catch {
    return false;
  }
}

export async function pnpmInstall(cwd: string) {
  return await execa("pnpm", ["install"], {
    cwd,
  });
}

export async function pnpmFormat(cwd: string) {
  return await execa("pnpm", ["format"], {
    cwd,
  });
}

export async function initGit(cwd: string) {
  await execa("git", ["init"], {
    cwd,
  });

  await execa("git", ["add", "."], {
    cwd,
  });

  await execa("git", ["commit", "-m", "Initial commit"], {
    cwd,
  });
}
