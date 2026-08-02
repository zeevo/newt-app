import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "fs/promises";
import { tmpdir } from "os";
import path from "path";
import {
  sortPackageJsons,
  updatePackageJson,
  updateScripts,
  validateDeploymentCombo,
  validateFlagValue,
  validateProjectName,
} from "./utils";
import type { TemplateData } from "./types";

const templateData: TemplateData = {
  projectName: "my-app",
  testing: "jest",
  database: "sqlite",
  deployment: "none",
  authSecret: "secret",
};

let destDir: string;

beforeEach(async () => {
  destDir = await mkdtemp(path.join(tmpdir(), "newt-utils-"));
});

afterEach(async () => {
  await rm(destDir, { recursive: true, force: true });
});

async function writePkg(rel: string, contents: object) {
  const file = path.join(destDir, rel, "package.json");
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, JSON.stringify(contents, null, 2));
}

async function readPkg(rel: string) {
  return JSON.parse(
    await readFile(path.join(destDir, rel, "package.json"), "utf8"),
  );
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
      ["foo/bar", "a:b", "we*rd", "no?"].map(
        (name) => validateProjectName(name).valid,
      ),
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
    expect(result.error).toContain(
      "--deployment spa cannot be combined with --nest-di-only.",
    );
  });

  it("accepts spa without nest-di-only", () => {
    expect(validateDeploymentCombo("spa", false).valid).toBe(true);
  });

  it("accepts nest-di-only with every other deployment", () => {
    expect(
      ["none", "standalone", "custom-server"].map(
        (deployment) => validateDeploymentCombo(deployment, true).valid,
      ),
    ).toEqual([true, true, true]);
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
    const result = validateFlagValue("--deployment", "spaa", [
      "none",
      "standalone",
      "custom-server",
      "spa",
    ]);
    expect(result.valid).toBe(false);
    expect(result.error).toBe(
      'Invalid value "spaa" for --deployment. Valid choices: none, standalone, custom-server, spa.',
    );
  });

  it("rejects a value that only differs by case", () => {
    expect(validateFlagValue("--linter", "ESLint", ["eslint", "oxc"]).valid).toBe(
      false,
    );
  });

  it("rejects an empty value", () => {
    expect(validateFlagValue("--database", "", ["sqlite", "postgres"]).valid).toBe(
      false,
    );
  });
});

describe("updatePackageJson", () => {
  it("adds a runtime dependency with its rendered name", async () => {
    await writePkg("apps/web", { name: "web" });

    await updatePackageJson(
      destDir,
      [{ module: "apps/web", package: "<%= projectName %>-ui", version: "1.0.0" }],
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
