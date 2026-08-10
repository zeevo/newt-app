import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));

const dirs = fs
  .readdirSync(root, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

// Modules import their own templates as ./templates/x and a sibling's as
// ../other/templates/x, so match against every index at once rather than only
// the owning module's.
const allIndexes = dirs
  .filter((dir) => fs.existsSync(path.join(root, dir, "index.ts")))
  .map((dir) => fs.readFileSync(path.join(root, dir, "index.ts"), "utf8"))
  .join("\n");

const modules = dirs.filter((dir) =>
  fs.existsSync(path.join(root, dir, "templates")),
);

// A template no module imports is never emitted, and nothing else notices: the
// render tests walk the registered set, and the ui drift check compares against
// that same set. A stale form.tsx and a duplicate jest-e2e.json both sat here
// unshipped until this test existed.
describe("every template file is imported by a module", () => {
  it.each(modules)("%s", (name) => {
    const orphans = fs
      .readdirSync(path.join(root, name, "templates"))
      .filter((file) => file.endsWith(".ts"))
      .map((file) => file.replace(/\.ts$/, ""))
      .filter(
        (stem) =>
          !new RegExp(
            `(?:\\./|${name}/)templates/${stem.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`,
          ).test(allIndexes),
      );

    expect(orphans).toEqual([]);
  });
});
