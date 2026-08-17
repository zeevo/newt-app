import ejs from "ejs";
import { existsSync, promises } from "fs";
import path from "path";
import type { Mode, Module, Package, Script, Selection, TemplateData } from "./types.js";
import { getStaticFilePath } from "./templates";

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export async function updatePackageJson(
  destDir: string,
  packages: Package[],
  templateData: TemplateData,
) {
  for (const pkg of packages) {
    const renderedPackage = ejs.render(pkg.package, templateData);
    const packageJsonPath = path.join(destDir, pkg.module, "package.json");
    let packageJsonContent: string;

    try {
      packageJsonContent = await promises.readFile(packageJsonPath, "utf8");
    } catch (err: unknown) {
      if (typeof err === "object" && err && (err as NodeJS.ErrnoException).code === "ENOENT") {
        continue;
      }
      throw err;
    }

    const packageJson = JSON.parse(packageJsonContent);

    const dependencyKey = pkg.dev ? "devDependencies" : "dependencies";

    if (!packageJson[dependencyKey]) {
      packageJson[dependencyKey] = {};
    }

    packageJson[dependencyKey][renderedPackage] = pkg.version;

    await promises.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
  }
}

export async function updateScripts(
  destDir: string,
  scripts: Script[],
  templateData: TemplateData,
) {
  for (const script of scripts) {
    const renderedScript = ejs.render(script.script, templateData);

    const packageJsonPath = path.join(destDir, script.module, "package.json");

    let packageJsonContent: string;

    try {
      packageJsonContent = await promises.readFile(packageJsonPath, "utf8");
    } catch (err: unknown) {
      if (typeof err === "object" && err && (err as NodeJS.ErrnoException).code === "ENOENT") {
        continue;
      }
      throw err;
    }

    const packageJson = JSON.parse(packageJsonContent);

    if (!packageJson.scripts) {
      packageJson.scripts = {};
    }

    packageJson.scripts[script.name] = renderedScript;

    await promises.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
  }
}

export async function renderTemplatesToDisk(
  basePackages: Module[],
  destDir: string,
  templateData: TemplateData,
  selection: Selection,
) {
  await promises.mkdir(destDir, { recursive: true });

  await basePackages.reduce(async (prev, pkg) => {
    await prev;

    // `when` decides which template owns a file for these options; templates
    // that don't apply are skipped rather than overwritten by a later one.
    const applicable = pkg.templates.filter((template) => template.when?.(selection) ?? true);

    await applicable.reduce(async (prev, template) => {
      await prev;

      const destPath = path.join(destDir, template.filename);
      await promises.mkdir(path.dirname(destPath), { recursive: true });

      const output = await ejs.render(template.template, templateData);

      await promises.writeFile(destPath, output, "utf8");
    }, Promise.resolve());

    if (pkg.staticFiles) {
      await pkg.staticFiles.reduce(async (prev, staticFile) => {
        await prev;

        const destPath = path.join(destDir, staticFile.filename);
        const destDirPath = path.dirname(destPath);

        await promises.mkdir(destDirPath, { recursive: true });

        await promises.copyFile(getStaticFilePath(staticFile.src), destPath);
      }, Promise.resolve());
    }
  }, Promise.resolve());
}

const DEP_FIELDS = ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"];

function sortByKey(obj: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.keys(obj)
      .sort()
      .map((key) => [key, obj[key]]),
  );
}

// Alphabetize scripts and dependency fields in every scaffolded package.json.
// Module injection appends deps/scripts to the end, so without this they land
// out of order.
export async function sortPackageJsons(destDir: string) {
  const nested = await Promise.all(
    ["apps", "packages"].map(async (base) => {
      const dir = path.join(destDir, base);
      try {
        const entries = await promises.readdir(dir, { withFileTypes: true });
        return entries
          .filter((entry) => entry.isDirectory())
          .map((entry) => path.join(dir, entry.name, "package.json"));
      } catch {
        return [];
      }
    }),
  );
  const files = [path.join(destDir, "package.json")].concat(...nested);

  await Promise.all(
    files.map(async (file) => {
      if (!existsSync(file)) return;
      const pkg = JSON.parse(await promises.readFile(file, "utf8"));
      if (pkg.scripts) pkg.scripts = sortByKey(pkg.scripts);
      DEP_FIELDS.forEach((field) => {
        if (pkg[field]) pkg[field] = sortByKey(pkg[field]);
      });
      await promises.writeFile(file, JSON.stringify(pkg, null, 2) + "\n");
    }),
  );
}

export function validateFlagValue(
  flag: string,
  value: string,
  allowed: readonly string[],
): ValidationResult {
  if (allowed.includes(value)) {
    return { valid: true };
  }

  return {
    valid: false,
    error: `Invalid value "${value}" for ${flag}. Valid choices: ${allowed.join(", ")}.`,
  };
}

// The mode flags name one axis, so passing two of them is a contradiction
// rather than a last-one-wins.
export function validateModeFlags(full: boolean, nestDiOnly: boolean): ValidationResult {
  if (full && nestDiOnly) {
    return {
      valid: false,
      error:
        "--full and --nest-di-only both choose how NestJS runs. Pass one.\n" +
        "--full runs it as an HTTP server on port 3001, --nest-di-only runs it as an\n" +
        "application context that Next.js route handlers inject services from.",
    };
  }

  return { valid: true };
}

export function validateDeploymentCombo(deployment: string, mode: Mode): ValidationResult {
  const nestDiOnly = mode === "nest-di-only";

  if (deployment === "spa" && nestDiOnly) {
    return {
      valid: false,
      error:
        "--deployment spa cannot be combined with --nest-di-only.\n" +
        "SPA mode statically exports Next.js (output: 'export'), which cannot include the\n" +
        "API route handlers that DI-only mode depends on. Pick one: drop --nest-di-only to\n" +
        "get SPA mode with NestJS controllers, or drop --deployment spa.",
    };
  }

  if (deployment === "custom-server" && nestDiOnly) {
    return {
      valid: false,
      error:
        "--deployment custom-server cannot be combined with --nest-di-only.\n" +
        "DI-only keeps Next.js as the server and calls Nest in-process, so it overwrites the\n" +
        "scripts that would run the custom server — apps/web/server.ts would be generated but\n" +
        "never invoked. Both already run Nest inside the Next.js process; pick one.",
    };
  }

  return { valid: true };
}

const TOOL_HINTS: Record<string, string> = {
  pnpm: "Install it with `npm install -g pnpm`, or run `corepack enable`.",
  git: "Install it from https://git-scm.com/downloads, or pass --no-git.",
};

// Only the tools this run will actually shell out to: --no-install never
// invokes pnpm and --no-git never invokes git, so requiring them there would
// reject a scaffold that was going to succeed.
export async function checkRequiredTools(
  needs: { install: boolean; git: boolean },
  hasCommand: (command: string) => Promise<boolean>,
): Promise<ValidationResult> {
  const required = [...(needs.install ? ["pnpm"] : []), ...(needs.git ? ["git"] : [])];

  const missing = (
    await Promise.all(required.map(async (tool) => ((await hasCommand(tool)) ? null : tool)))
  ).filter((tool) => tool !== null);

  if (missing.length === 0) return { valid: true };

  return {
    valid: false,
    error: missing.map((tool) => `${tool} was not found on PATH. ${TOOL_HINTS[tool]}`).join("\n"),
  };
}

export function validateNodeVersion(current: string, requirement: string): ValidationResult {
  const parse = (value: string) => (value.match(/\d+/g) ?? []).slice(0, 3).map(Number);
  const [major = 0, minor = 0, patch = 0] = parse(current);
  const [minMajor = 0, minMinor = 0, minPatch = 0] = parse(requirement);

  const satisfied =
    major !== minMajor
      ? major > minMajor
      : minor !== minMinor
        ? minor > minMinor
        : patch >= minPatch;

  if (satisfied) return { valid: true };

  return {
    valid: false,
    error: `Node ${requirement} is required, but this is ${current}.\nUpgrade Node, or switch versions with a manager such as nvm or fnm.`,
  };
}

export function validateProjectName(projectName: string): ValidationResult {
  if (!projectName) {
    return { valid: false, error: "Project name is required" };
  }

  if (projectName.length < 1) {
    return {
      valid: false,
      error: "Project name must be at least 1 character long",
    };
  }

  if (projectName.length > 214) {
    return {
      valid: false,
      error: "Project name must be less than 214 characters",
    };
  }

  const invalidChars = /[<>:"/\\|?*]/;
  if (invalidChars.test(projectName)) {
    return { valid: false, error: "Project name contains invalid characters" };
  }

  const targetPath = path.resolve(process.cwd(), projectName);

  if (existsSync(targetPath)) {
    return { valid: false, error: `Directory "${projectName}" already exists` };
  }

  return { valid: true };
}
