import ejs from "ejs";
import { describe, expect, it } from "vitest";
import { selectModules } from "./index";
import type { Extra, ModuleSelection, Nest, TemplateData } from "./types";
import { versions } from "./versions";
import {
  validateDeploymentCombo,
  validateExampleCombo,
  validateExtrasCombo,
  validateStylingCombo,
} from "../utils";

const DEPLOYMENTS = ["none", "standalone", "spa"] as const;
const NEST = ["on", "off", "di-only"] as const satisfies readonly Nest[];
const TESTING = ["jest", "vitest"] as const;
const DATABASES = ["sqlite", "postgres"] as const;
const LINTERS = ["eslint", "oxc"] as const;
const BOOLS = [true, false];
const EXTRAS = [[], ["anti-slop"]] as const satisfies readonly (readonly Extra[])[];
// The styling axis is three-way, but shadcn and stylex are mutually exclusive,
// so it rides along as two booleans the validator then prunes.
const STYLING = [
  { shadcn: false, stylex: false },
  { shadcn: true, stylex: false },
  { shadcn: false, stylex: true },
] as const;
const DEP_FIELDS = ["dependencies", "devDependencies", "peerDependencies"];

// Every selection the CLI will accept. The rejected pairs are filtered with the
// same validator the CLI uses, so a change there changes the matrix here too.
const combos: ModuleSelection[] = DEPLOYMENTS.flatMap((deployment) =>
  NEST.flatMap((nest) =>
    STYLING.flatMap(({ shadcn, stylex }) =>
      TESTING.flatMap((testing) =>
        DATABASES.flatMap((database) =>
          LINTERS.flatMap((linter) =>
            BOOLS.flatMap((todoExample) =>
              EXTRAS.flatMap((extras) =>
                BOOLS.map((agentsMd) => ({
                  deployment,
                  nest,
                  shadcn,
                  stylex,
                  testing,
                  database,
                  linter,
                  todoExample,
                  extras,
                  agentsMd,
                })),
              ),
            ),
          ),
        ),
      ),
    ),
  ),
)
  .filter(({ deployment, nest }) => validateDeploymentCombo(deployment, nest).valid)
  .filter(({ todoExample, nest }) => validateExampleCombo(todoExample, nest).valid)
  .filter(({ extras, linter }) => validateExtrasCombo(extras, linter).valid)
  .filter(({ shadcn, stylex }) => validateStylingCombo(shadcn, stylex).valid);

const label = (selection: ModuleSelection) =>
  Object.entries(selection)
    .map(([key, value]) => `${key}=${value}`)
    .join(" ");

// Mirrors tasks.ts: render every applicable template, then apply the deps each
// module injects into an already-rendered package.json.
function renderCombo(selection: ModuleSelection) {
  const data: TemplateData = {
    projectName: "my-app",
    nest: selection.nest,
    testing: selection.testing,
    database: selection.database,
    deployment: selection.deployment,
    linter: selection.linter,
    antiSlop: selection.extras.includes("anti-slop"),
    shadcn: selection.shadcn,
    agentsMd: selection.agentsMd,
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

  const scripts = new Map<string, Record<string, string>>();
  modules
    .flatMap((mod) => mod.scripts ?? [])
    .forEach((script) => {
      const target = `${script.module}/package.json`;
      if (!files.has(target)) return;
      scripts.set(target, {
        ...scripts.get(target),
        [script.name]: script.script,
      });
    });

  return { files, collisions, scripts };
}

type Manifest = { name?: string } & Partial<
  Record<(typeof DEP_FIELDS)[number], Record<string, string>>
>;

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
        const json: Manifest = JSON.parse(contents);
        return DEP_FIELDS.flatMap((field) =>
          Object.entries(json[field] ?? {})
            .filter(([dep, version]) => version.startsWith("workspace:") && !scaffolded.has(dep))
            .map(([dep]) => `${filename} ${field}.${dep}`),
        );
      });
      expect(unresolved).toEqual([]);

      // The root package.json is unconditional, so every scaffold gets the
      // Node types its config files and scripts are written against.
      const rootPkg = JSON.parse(files.get("package.json") ?? "{}");
      expect(rootPkg.devDependencies?.["@types/node"]).toBe(versions["@types/node"]);
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

describe("anti-slop ships only with the extra", () => {
  it.each(combos.map((selection) => [label(selection), selection] as const))(
    "%s",
    (_name, selection) => {
      const { files } = renderCombo(selection);
      const selected = selection.extras.includes("anti-slop");
      const oxlintrc = files.get(".oxlintrc.json") ?? "";

      expect(files.has("tools/oxlint/anti-slop/package.json")).toBe(selected);
      expect(oxlintrc.includes('"jsPlugins"')).toBe(selected);
      expect(oxlintrc.includes('"anti-slop/no-runtime-typeof": "error"')).toBe(selected);
      expect(oxlintrc.includes('"packages/ui/src/components/**"')).toBe(
        selected && selection.shadcn,
      );
    },
  );
});

// CLAUDE.md only imports AGENTS.md, so the two ship together or not at all.
// Opting out also turns off agentRules, or next dev would write its own pair
// into apps/web.
describe("CLAUDE.md and AGENTS.md ship only when asked for", () => {
  it.each(combos.map((selection) => [label(selection), selection] as const))(
    "%s",
    (_name, selection) => {
      const { files } = renderCombo(selection);

      expect(files.has("AGENTS.md")).toBe(selection.agentsMd);
      expect(files.get("CLAUDE.md")).toBe(selection.agentsMd ? "@AGENTS.md" : undefined);
      expect(files.get("apps/web/next.config.js")?.includes("agentRules: false")).toBe(
        !selection.agentsMd,
      );
    },
  );
});

// StyleX compiles at build time, so a scaffold either gets the whole toolchain
// (babel config, app-owned postcss config, tokens) or none of it. The decorator
// plugins ride along only in DI-only mode, where Next's babel pass has to
// compile Nest's decorated source.
describe("the stylex toolchain ships as a unit", () => {
  it.each(combos.map((selection) => [label(selection), selection] as const))(
    "%s",
    (_name, selection) => {
      const { files } = renderCombo(selection);
      const babelConfig = files.get("apps/web/babel.config.js") ?? "";
      const postcssConfig = files.get("apps/web/postcss.config.mjs") ?? "";

      expect(files.has("apps/web/babel.config.js")).toBe(selection.stylex);
      expect(files.has("packages/ui/src/tokens.stylex.ts")).toBe(selection.stylex);
      expect(babelConfig.includes("@stylexjs/babel-plugin")).toBe(selection.stylex);
      expect(postcssConfig.includes("@stylexjs/postcss-plugin")).toBe(selection.stylex);

      expect(babelConfig.includes("@babel/plugin-proposal-decorators")).toBe(
        selection.stylex && selection.nest === "di-only",
      );

      const webPkg = JSON.parse(files.get("apps/web/package.json") ?? "{}");
      const webDeps = { ...webPkg.dependencies, ...webPkg.devDependencies };
      expect("tailwindcss" in webDeps).toBe(!selection.stylex);
      expect("@stylexjs/stylex" in webDeps).toBe(selection.stylex);
    },
  );
});

// A shipped e2e spec needs supertest to run and a controller to hit. DI-only
// Nest has neither, so it ships no e2e suite at all, and `off` has no apps/api
// to put one in.
describe("the e2e suite ships only where it can pass", () => {
  it.each(combos.map((selection) => [label(selection), selection] as const))(
    "%s",
    (_name, selection) => {
      const { files, scripts } = renderCombo(selection);
      const spec = "apps/api/test/app.e2e-spec.ts";
      const apiPkg = "apps/api/package.json";
      const e2e = selection.nest === "on";

      expect(files.has(spec)).toBe(e2e);
      expect("test:e2e" in (scripts.get(apiPkg) ?? {})).toBe(e2e);
      expect(files.has("apps/api/test/jest-e2e.json")).toBe(e2e && selection.testing === "jest");
      expect(files.has("apps/api/vitest.config.e2e.mts")).toBe(
        e2e && selection.testing === "vitest",
      );

      const deps: Manifest = JSON.parse(files.get(apiPkg) ?? "{}");
      const declared = { ...deps.dependencies, ...deps.devDependencies };
      const needed = ["supertest", "@types/supertest", "@nestjs/platform-express"];
      expect(needed.filter((dep) => dep in declared)).toEqual(e2e ? needed : []);

      const readme = files.get("apps/api/README.md") ?? "";
      expect(readme.includes("pnpm test:e2e")).toBe(e2e);
    },
  );
});

// Specs are written against globals, so the test runner's types have to be in
// scope or the api's own lint run fails on unresolved describe/it/expect.
describe("api tsconfig types match the test runner", () => {
  it.each(
    combos
      .filter((selection) => selection.nest !== "off")
      .map((selection) => [label(selection), selection] as const),
  )("%s", (_name, selection) => {
    const tsconfig = renderCombo(selection).files.get("apps/api/tsconfig.json") ?? "";
    const types = JSON.parse(tsconfig).compilerOptions.types;

    expect(types).toContain(selection.testing === "jest" ? "jest" : "vitest/globals");
  });
});

// `off` is the whole point of the mode: no apps/api, and nothing anywhere that
// would drag @nestjs back in through a dependency.
describe("nest off scaffolds no Nest at all", () => {
  it.each(
    combos
      .filter((selection) => selection.nest === "off")
      .map((selection) => [label(selection), selection] as const),
  )("%s", (_name, selection) => {
    const { files } = renderCombo(selection);

    expect([...files.keys()].filter((filename) => filename.startsWith("apps/api/"))).toEqual([]);

    const nestDeps = packageJsons(files).flatMap(([filename, contents]) => {
      const json: Manifest = JSON.parse(contents);
      return DEP_FIELDS.flatMap((field) =>
        Object.keys(json[field] ?? {})
          .filter((dep) => dep.startsWith("@nestjs/") || dep.includes("nestjs-better-auth"))
          .map((dep) => `${filename} ${field}.${dep}`),
      );
    });
    expect(nestDeps).toEqual([]);

    // The handler the /api rewrite used to reach on port 3001, now served in
    // process by the only app there is.
    expect(files.has("apps/web/app/api/hello/route.ts")).toBe(true);
    expect(files.get("apps/web/next.config.js")).not.toContain("localhost:3001");
  });
});

// A sqlite app handed a Postgres URL opens it as a file path and dies on boot,
// so the compose file has to match the database the scaffold shipped with.
describe("the standalone compose file matches the selected database", () => {
  it.each(combos.map((selection) => [label(selection), selection] as const))(
    "%s",
    (_name, selection) => {
      const compose = renderCombo(selection).files.get("docker-compose.yml");

      if (selection.deployment !== "standalone") {
        expect(compose).toBeUndefined();
        return;
      }

      const postgres = selection.database === "postgres";
      expect(compose).toContain(
        postgres ? "DATABASE_URL: postgresql://" : "DATABASE_URL: /data/app.db",
      );
      expect(compose?.includes("image: postgres:17-alpine")).toBe(postgres);
      expect(compose?.includes("condition: service_healthy")).toBe(postgres);
      expect(compose?.includes("- db_data:/data\n")).toBe(!postgres);
      expect(compose).toContain("condition: service_completed_successfully");
    },
  );
});
