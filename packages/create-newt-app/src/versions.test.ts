import ejs from "ejs";
import { describe, expect, it } from "vitest";
import { templates } from "./templates";
// Not wired into templates/index.ts, but still checked so its pins cannot drift.
import singleProcessPages from "./templates/single-process-pages/index";
import { versions } from "./templates/versions";
import type { Module, TemplateData } from "./types";

const templateData: TemplateData = {
  projectName: "my-app",
  testing: "jest",
  database: "sqlite",
  deployment: "none",
  antiSlop: false,
  shadcn: false,
  authSecret: "secret",
  versions,
};

const modules: Module[] = Object.values(templates).concat(singleProcessPages);

type Pin = { name: string; version: string; source: string };

// peerDependencies stay out: `ui` and `shadcn-ui` deliberately declare wide
// ranges for the same packages the apps pin exactly.
const PINNED_FIELDS = ["dependencies", "devDependencies"];

function pinsFromTemplates(): Pin[] {
  return modules.flatMap((mod) =>
    mod.templates
      .filter((template) => template.filename.endsWith("package.json"))
      .flatMap((template) => {
        const pkg = JSON.parse(ejs.render(template.template, templateData));
        return PINNED_FIELDS.flatMap((field) =>
          Object.entries<string>(pkg[field] ?? {}).map(([name, version]) => ({
            name,
            version,
            source: template.filename,
          })),
        );
      }),
  );
}

function pinsFromInjectedPackages(): Pin[] {
  return modules.flatMap((mod) =>
    (mod.packages ?? []).map((pkg) => ({
      name: ejs.render(pkg.package, templateData),
      version: pkg.version,
      source: `${pkg.module || "."}/package.json (injected)`,
    })),
  );
}

describe("dependency versions", () => {
  it("pins each package to exactly one version across every template", () => {
    const pins = pinsFromTemplates()
      .concat(pinsFromInjectedPackages())
      .filter((pin) => pin.version !== "workspace:*");

    const byName = pins.reduce<Record<string, Pin[]>>((acc, pin) => {
      acc[pin.name] = (acc[pin.name] ?? []).concat(pin);
      return acc;
    }, {});

    const conflicts = Object.entries(byName)
      .filter(([, entries]) => new Set(entries.map((e) => e.version)).size > 1)
      .map(([name, entries]) => ({
        name,
        pins: entries.map((e) => `${e.version} in ${e.source}`).sort(),
      }));

    expect(conflicts).toEqual([]);
  });

  it("takes every pin from the versions registry", () => {
    const registry: Record<string, string> = versions;

    const offRegistry = pinsFromTemplates()
      .concat(pinsFromInjectedPackages())
      .filter((pin) => pin.version !== "workspace:*" && registry[pin.name] !== pin.version);

    expect(offRegistry).toEqual([]);
  });
});
