import { randomBytes } from "node:crypto";
import { execa } from "execa";
import type { Module, Selection, TemplateData } from "./templates";
import { moduleNames } from "./templates";
import { selectTemplates } from "./select-templates.js";
import {
  renderTemplatesToDisk,
  sortPackageJsons,
  updatePackageJson,
  updateScripts,
  validateProjectName,
} from "./utils.js";

export async function scaffold(modules: Module[], options: { name: string; testing: 'jest' | 'vitest'; database: 'sqlite' | 'postgres'; deployment: TemplateData['deployment']; selection: Selection }) {
  const validation = validateProjectName(options.name);
  if (!validation.valid) {
    console.error(`Error: ${validation.error}`);
    process.exit(1);
  }

  // Exactly one template may claim each filename, so nothing is overwritten.
  const { templates: selected, result: selectionResult } = selectTemplates(
    modules,
    options.selection,
    moduleNames,
  );
  if (!selectionResult.valid) {
    console.error(`Error: ${selectionResult.error}`);
    process.exit(1);
  }
  const chosen = new Set(selected);
  const resolved = modules.map((mod) => ({
    ...mod,
    templates: mod.templates.filter((template) => chosen.has(template)),
  }));

  const templateData: TemplateData = {
    projectName: options.name,
    testing: options.testing,
    database: options.database,
    deployment: options.deployment,
    authSecret: randomBytes(32).toString("base64url"),
  };

  await renderTemplatesToDisk(resolved, options.name, templateData);

  const packages = modules
    .map((mod) => mod.packages)
    .filter((ele) => ele !== undefined)
    .flat();

  if (packages.length > 0) {
    await updatePackageJson(options.name, packages, templateData);
  }

  const scripts = modules
    .map((mod) => mod.scripts)
    .filter((ele) => ele !== undefined)
    .flat();

  if (scripts.length > 0) {
    await updateScripts(options.name, scripts, templateData);
  }

  await sortPackageJsons(options.name);
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
