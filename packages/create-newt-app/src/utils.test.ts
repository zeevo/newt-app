import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "fs/promises";
import { tmpdir } from "os";
import path from "path";
import {
  checkRequiredTools,
  sortPackageJsons,
  updatePackageJson,
  updateScripts,
  validateDeploymentCombo,
  validateExtrasCombo,
  validateFlagValue,
  validateNodeVersion,
  validateProjectName,
} from "./utils";
import type { TemplateData } from "./types";
import { versions } from "./templates/versions";

const templateData: TemplateData = {
  projectName: "my-app",
  nestDiOnly: false,
  testing: "jest",
  database: "sqlite",
  deployment: "none",
  linter: "eslint",
  antiSlop: false,
  shadcn: false,
  authSecret: "secret",
  versions,
};

let destDir: string;

beforeEach(async () => {
  destDir = await mkdtemp(path.join(tmpdir(), "newt-utils-"));
});

afterEach(async () => {
  await rm(destDir, { recursive: true, force: true });
});

type PackageJson = {
  name?: string;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

async function writePkg(rel: string, contents: PackageJson) {
  const file = path.join(destDir, rel, "package.json");
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, JSON.stringify(contents, null, 2));
}

async function readPkg(rel: string) {
  return JSON.parse(await readFile(path.join(destDir, rel, "package.json"), "utf8"));
}

describe("validateProjectName", () => {
  it("rejects an empty name", () => {
    expect(validateProjectName("").valid).toBe(false);
  });

  it("rejects names longer than 214 characters", () => {
    expect(validateProjectName("a".repeat(215)).valid).toBe(false);
  });

  it("rejects names with invalid path characters", () => {
    expect(
      ["foo/bar", "a:b", "we*rd", "no?"].map((name) => validateProjectName(name).valid),
    ).toEqual([false, false, false, false]);
  });

  it("accepts a normal name that does not already exist", () => {
    expect(validateProjectName("some-fresh-app-xyz").valid).toBe(true);
  });
});

describe("validateDeploymentCombo", () => {
  it("rejects spa combined with nest-di-only", () => {
    const result = validateDeploymentCombo("spa", true);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("--deployment spa cannot be combined with --nest-di-only.");
  });

  it("accepts spa without nest-di-only", () => {
    expect(validateDeploymentCombo("spa", false).valid).toBe(true);
  });

  it("accepts nest-di-only with the deployments that support it", () => {
    expect(
      ["none", "standalone"].map((deployment) => validateDeploymentCombo(deployment, true).valid),
    ).toEqual([true, true]);
  });
});

describe("checkRequiredTools", () => {
  const absent = async () => false;
  const present = async () => true;

  it("passes when every tool the run needs is present", async () => {
    const result = await checkRequiredTools({ install: true, git: true }, present);
    expect(result.valid).toBe(true);
  });

  it("rejects a missing pnpm when installing, and says how to get it", async () => {
    const result = await checkRequiredTools({ install: true, git: false }, absent);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("pnpm was not found on PATH");
    expect(result.error).toContain("corepack enable");
  });

  it("does not require pnpm when install is skipped", async () => {
    const result = await checkRequiredTools({ install: false, git: false }, absent);
    expect(result.valid).toBe(true);
  });

  it("does not require git when git is skipped", async () => {
    const asked: string[] = [];
    const result = await checkRequiredTools({ install: true, git: false }, async (command) => {
      asked.push(command);
      return true;
    });
    expect(asked).toEqual(["pnpm"]);
    expect(result.valid).toBe(true);
  });

  it("reports every missing tool at once", async () => {
    const result = await checkRequiredTools({ install: true, git: true }, absent);
    expect(result.error).toContain("pnpm was not found on PATH");
    expect(result.error).toContain("git was not found on PATH");
  });
});

describe("validateNodeVersion", () => {
  it("accepts a version above the requirement", () => {
    expect(validateNodeVersion("v24.14.1", ">=20.9.0").valid).toBe(true);
  });

  it("accepts the exact minimum", () => {
    expect(validateNodeVersion("v20.9.0", ">=20.9.0").valid).toBe(true);
  });

  it("compares each version part, not just the major", () => {
    expect(
      ["v18.20.0", "v20.8.9", "v20.9.1", "v21.0.0"].map(
        (version) => validateNodeVersion(version, ">=20.9.0").valid,
      ),
    ).toEqual([false, false, true, true]);
  });

  it("names both the requirement and what is running", () => {
    const result = validateNodeVersion("v18.20.0", ">=20.9.0");
    expect(result.error).toContain(">=20.9.0");
    expect(result.error).toContain("v18.20.0");
  });
});

describe("validateFlagValue", () => {
  it("accepts every allowed value", () => {
    expect(
      ["jest", "vitest"].every(
        (value) => validateFlagValue("--testing", value, ["jest", "vitest"]).valid,
      ),
    ).toBe(true);
  });

  it("rejects an unrecognised value and names the valid choices", () => {
    const result = validateFlagValue("--deployment", "spaa", ["none", "standalone", "spa"]);
    expect(result.valid).toBe(false);
    expect(result.error).toBe(
      'Invalid value "spaa" for --deployment. Valid choices: none, standalone, spa.',
    );
  });

  it("rejects a value that only differs by case", () => {
    expect(validateFlagValue("--linter", "ESLint", ["eslint", "oxc"]).valid).toBe(false);
  });

  it("rejects an empty value", () => {
    expect(validateFlagValue("--database", "", ["sqlite", "postgres"]).valid).toBe(false);
  });
});

describe("updatePackageJson", () => {
  it("adds a runtime dependency with its rendered name", async () => {
    await writePkg("apps/web", { name: "web" });

    await updatePackageJson(
      destDir,
      [
        {
          module: "apps/web",
          package: "<%= projectName %>-ui",
          version: "1.0.0",
        },
      ],
      templateData,
    );

    const pkg = await readPkg("apps/web");
    expect(pkg.dependencies["my-app-ui"]).toBe("1.0.0");
  });

  it("adds dev dependencies under devDependencies", async () => {
    await writePkg("apps/web", { name: "web" });

    await updatePackageJson(
      destDir,
      [{ module: "apps/web", package: "vitest", version: "^4.0.0", dev: true }],
      templateData,
    );

    const pkg = await readPkg("apps/web");
    expect(pkg.devDependencies.vitest).toBe("^4.0.0");
    expect(pkg.dependencies).toBeUndefined();
  });

  it("skips modules with no package.json instead of throwing", async () => {
    await expect(
      updatePackageJson(
        destDir,
        [{ module: "apps/missing", package: "x", version: "1.0.0" }],
        templateData,
      ),
    ).resolves.not.toThrow();
  });
});

describe("updateScripts", () => {
  it("adds a script and preserves existing ones", async () => {
    await writePkg("apps/api", { name: "api", scripts: { build: "tsc" } });

    await updateScripts(
      destDir,
      [{ module: "apps/api", name: "test", script: "vitest run" }],
      templateData,
    );

    const pkg = await readPkg("apps/api");
    expect(pkg.scripts).toMatchObject({ build: "tsc", test: "vitest run" });
  });

  it("skips modules with no package.json instead of throwing", async () => {
    await expect(
      updateScripts(
        destDir,
        [{ module: "apps/missing", name: "test", script: "vitest run" }],
        templateData,
      ),
    ).resolves.not.toThrow();
  });
});

describe("sortPackageJsons", () => {
  it("alphabetizes scripts and dependency fields across root and workspaces", async () => {
    await writePkg(".", {
      name: "root",
      scripts: { dev: "x", build: "y" },
      dependencies: { zebra: "1", apple: "2" },
    });
    await writePkg("apps/web", {
      name: "web",
      devDependencies: { vitest: "1", eslint: "2" },
    });

    await sortPackageJsons(destDir);

    const root = await readPkg(".");
    expect(Object.keys(root.scripts)).toEqual(["build", "dev"]);
    expect(Object.keys(root.dependencies)).toEqual(["apple", "zebra"]);

    const web = await readPkg("apps/web");
    expect(Object.keys(web.devDependencies)).toEqual(["eslint", "vitest"]);
  });
});

describe("validateExtrasCombo", () => {
  it("rejects anti-slop under eslint", () => {
    const result = validateExtrasCombo(["anti-slop"], "eslint");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("--extras anti-slop needs --linter oxc.");
  });

  it("accepts anti-slop under oxc", () => {
    expect(validateExtrasCombo(["anti-slop"], "oxc").valid).toBe(true);
  });

  it("accepts no extras under either linter", () => {
    expect(validateExtrasCombo([], "eslint").valid).toBe(true);
    expect(validateExtrasCombo([], "oxc").valid).toBe(true);
  });
});
