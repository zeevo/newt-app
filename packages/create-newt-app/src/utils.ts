import ejs from "ejs";
import { existsSync, promises } from "fs";
import path from "path";
import type { Module, Package, Script, TemplateData } from "./types.js";
import { getStaticFilePath } from "@newt-app/templates";

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
  templateData: TemplateData
) {
  await promises.mkdir(destDir, { recursive: true });

  await basePackages.reduce(async (prev, pkg) => {
    await prev;
    for (const template of pkg.templates) {
      try {
        const destPath = path.join(destDir, template.filename);
        const destDirPath = path.dirname(destPath);

        await promises.mkdir(destDirPath, { recursive: true });

        const output = await ejs.render(template.template, templateData);

        await promises.writeFile(destPath, output, "utf8");
      } catch (error) {
        console.error(`Failed to create ${template.filename}: ${error}`);
      }
    }
    if (pkg.staticFiles) {
      pkg.staticFiles.reduce(async (prev, staticFile) => {
        try {
          await prev;

          const destPath = path.join(destDir, staticFile.filename);
          const destDirPath = path.dirname(destPath);

          await promises.mkdir(destDirPath, { recursive: true });

          await promises.copyFile(getStaticFilePath(staticFile.src), destPath);
        } catch (e) {
          console.log(e);
        }
      }, Promise.resolve());
    }
  }, Promise.resolve());
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
