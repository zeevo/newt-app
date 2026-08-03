import ejs from "ejs";
import { existsSync, promises } from "fs";
import path from "path";
import type { Module, Package, Script, Selection, TemplateData } from "./types.js";
import { getStaticFilePath } from "./templates";

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export async function updatePackageJson(
  destDir: string,
  packages: Package[],
  templateData: TemplateData
) {
  for (const pkg of packages) {
    const renderedPackage = ejs.render(pkg.package, templateData);
    const packageJsonPath = path.join(destDir, pkg.module, "package.json");
    let packageJsonContent: string;

    try {
      packageJsonContent = await promises.readFile(packageJsonPath, "utf8");
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err &&
        (err as NodeJS.ErrnoException).code === "ENOENT"
      ) {
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

    await promises.writeFile(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2)
    );
  }
}

export async function updateScripts(
  destDir: string,
  scripts: Script[],
  templateData: TemplateData
) {
  for (const script of scripts) {
    const renderedScript = ejs.render(script.script, templateData);

    const packageJsonPath = path.join(destDir, script.module, "package.json");

    let packageJsonContent: string;

    try {
      packageJsonContent = await promises.readFile(packageJsonPath, "utf8");
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err &&
        (err as NodeJS.ErrnoException).code === "ENOENT"
      ) {
        continue;
      }
      throw err;
    }

    const packageJson = JSON.parse(packageJsonContent);

    if (!packageJson.scripts) {
      packageJson.scripts = {};
    }

    packageJson.scripts[script.name] = renderedScript;

    await promises.writeFile(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2)
    );
  }
}

export async function renderTemplatesToDisk(
  basePackages: Module[],
  destDir: string,
  templateData: TemplateData,
  selection: Selection
) {
  await promises.mkdir(destDir, { recursive: true });

  await basePackages.reduce(async (prev, pkg) => {
    await prev;

    // `when` decides which template owns a file for these options; templates
    // that don't apply are skipped rather than overwritten by a later one.
    const applicable = pkg.templates.filter(
      (template) => template.when?.(selection) ?? true
    );

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

const DEP_FIELDS = [
  "dependencies",
  "devDependencies",
  "peerDependencies",
  "optionalDependencies",
];

function sortByKey(
  obj: Record<string, unknown>,
): Record<string, unknown> {
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

export function validateDeploymentCombo(
  deployment: string,
  nestDiOnly: boolean,
): ValidationResult {
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

  return { valid: true };
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
