import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Two copies of dmmulroy/anti-slop live in this repo at the same upstream pin:
// this one, which the scaffolder ships, and tools/oxlint/anti-slop, which the
// repo's own lint loads. Nothing else makes them stay equal.
const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../../..");
const shipped = path.join(repo, "packages/create-newt-app/src/templates/anti-slop/static");
const ours = path.join(repo, "tools/oxlint/anti-slop");

// The repo copy carries two files the scaffolder writes from templates instead.
const OURS_ONLY = new Set(["package.json", "README.md"]);

const filesIn = (dir: string) =>
  fs
    .readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => path.relative(dir, path.join(entry.parentPath, entry.name)))
    .sort();

describe("the vendored anti-slop copies", () => {
  it("hold the same files", () => {
    expect(filesIn(ours).filter((file) => !OURS_ONLY.has(file))).toEqual(filesIn(shipped));
  });

  it("hold the same bytes", () => {
    const differing = filesIn(shipped).filter(
      (file) =>
        fs.readFileSync(path.join(shipped, file), "utf8") !==
        fs.readFileSync(path.join(ours, file), "utf8"),
    );

    expect(differing).toEqual([]);
  });
});
