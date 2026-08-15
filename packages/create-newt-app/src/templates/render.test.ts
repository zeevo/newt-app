import ejs from "ejs";
import { describe, expect, it } from "vitest";
import { selectModules } from "./index";
import type { ModuleSelection, TemplateData } from "./types";
import { versions } from "./versions";
import { validateDeploymentCombo } from "../utils";

const DEPLOYMENTS = ["none", "standalone", "custom-server", "spa"] as const;
const TESTING = ["jest", "vitest"] as const;
const DATABASES = ["sqlite", "postgres"] as const;
const LINTERS = ["eslint", "oxc"] as const;
const BOOLS = [true, false];
const DEP_FIELDS = ["dependencies", "devDependencies", "peerDependencies"];

// Every selection the CLI will accept. The rejected pairs are filtered with the
// same validator the CLI uses, so a change there changes the matrix here too.
const combos: ModuleSelection[] = DEPLOYMENTS.flatMap((deployment) =>
  BOOLS.flatMap((nestDiOnly) =>
    BOOLS.flatMap((shadcn) =>
      TESTING.flatMap((testing) =>
        DATABASES.flatMap((database) =>
          LINTERS.flatMap((linter) =>
            BOOLS.map((todoExample) => ({
              deployment,
              nestDiOnly,
              shadcn,
              testing,
              database,
              linter,
              todoExample,
            })),
          ),
        ),
      ),
    ),
  ),
).filter(
  ({ deployment, nestDiOnly }) =>
    validateDeploymentCombo(deployment, nestDiOnly).valid,
);

const label = (selection: ModuleSelection) =>
  Object.entries(selection)
    .map(([key, value]) => `${key}=${value}`)
    .join(" ");

// Mirrors tasks.ts: render every applicable template, then apply the deps each
// module injects into an already-rendered package.json.
function renderCombo(selection: ModuleSelection) {
  const data: TemplateData = {
    projectName: "my-app",
    testing: selection.testing,
    database: selection.database,
    deployment: selection.deployment,
    authSecret: "test-secret",
    versions,
  };

  const modules = selectModules(selection);
  const files = new Map<string, string>();
  const collisions: string[] = [];

  modules.forEach((mod) => {
    mod.templates
      .filter((template) => template.when?.(selection) ?? true)
      .forEach((template) => {
        if (files.has(template.filename)) collisions.push(template.filename);
        try {
          files.set(template.filename, ejs.render(template.template, data));
        } catch (error) {
          throw new Error(
            `${template.filename}: ${error instanceof Error ? error.message : String(error)}`,
          );
        }
      });
  });

  modules
    .flatMap((mod) => mod.packages ?? [])
    .forEach((pkg) => {
      const target = `${pkg.module}/package.json`;
      const contents = files.get(target);
      if (!contents) return;
      const json = JSON.parse(contents);
      const field = pkg.dev ? "devDependencies" : "dependencies";
      json[field] = {
        ...json[field],
        [ejs.render(pkg.package, data)]: pkg.version,
      };
      files.set(target, JSON.stringify(json, null, 2));
    });

  return { files, collisions };
}

const packageJsons = (files: Map<string, string>) =>
  [...files].filter(([filename]) => filename.endsWith("package.json"));

describe(`template rendering across ${combos.length} selections`, () => {
  it.each(combos.map((selection) => [label(selection), selection] as const))(
    "%s",
    (_name, selection) => {
      const { files, collisions } = renderCombo(selection);

      // The `when` predicates exist to make this true: no two selected
      // templates may claim the same output file.
      expect(collisions).toEqual([]);

      const invalidJson = [...files]
        .filter(([filename]) => filename.endsWith(".json"))
        .filter(([, contents]) => {
          try {
            JSON.parse(contents);
            return false;
          } catch {
            return true;
          }
        })
        .map(([filename]) => filename);
      expect(invalidJson).toEqual([]);

      const scaffolded = new Set(
        packageJsons(files).map(([, contents]) => JSON.parse(contents).name),
      );
      const unresolved = packageJsons(files).flatMap(([filename, contents]) => {
        const json = JSON.parse(contents);
        return DEP_FIELDS.flatMap((field) =>
          Object.entries(json[field] ?? {})
            .filter(
              ([dep, version]) =>
                typeof version === "string" &&
                version.startsWith("workspace:") &&
                !scaffolded.has(dep),
            )
            .map(([dep]) => `${filename} ${field}.${dep}`),
        );
      });
      expect(unresolved).toEqual([]);

      // The root package.json is unconditional, so every scaffold gets the
      // Node types its config files and scripts are written against.
      const rootPkg = JSON.parse(files.get("package.json") ?? "{}");
      expect(rootPkg.devDependencies?.["@types/node"]).toBe(
        versions["@types/node"],
      );
    },
  );
});

// The linter modules are alternatives, so a scaffold gets one toolchain's
// config files and none of the other's.
describe("linter config files follow the selected linter", () => {
  it.each(combos.map((selection) => [label(selection), selection] as const))(
    "%s",
    (_name, selection) => {
      const emitted = [...renderCombo(selection).files.keys()];
      const prettier = emitted.filter((f) => f === ".prettierrc");
      const oxfmt = emitted.filter((f) => f === ".oxfmtrc.json");

      expect({ prettier, oxfmt }).toEqual(
        selection.linter === "oxc"
          ? { prettier: [], oxfmt: [".oxfmtrc.json"] }
          : { prettier: [".prettierrc"], oxfmt: [] },
      );
    },
  );
});
