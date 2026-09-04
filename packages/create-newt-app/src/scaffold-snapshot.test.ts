import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, readdir, readFile, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { templates } from "./templates";

// Pins what a scaffolded app actually contains. render.test.ts checks
// invariants over every combo but never content, so a change to a template
// body, to versions.ts, or to the package.json assembly in utils.ts lands with
// no test signal. This drives the built CLI so the snapshots come from the real
// write path rather than a second rendering of the templates.
const run = promisify(execFile);

const CLI = fileURLToPath(new URL("../dist/index.js", import.meta.url));
const SRC = fileURLToPath(new URL("./", import.meta.url));
// Snapshots keep the extension the scaffolder emitted, so they read as the
// files they are. That makes them ordinary source files to anything walking the
// repo, so vitest, oxfmt, oxlint and git are all told to skip this directory.
const SNAPSHOTS = fileURLToPath(new URL("../snapshots/", import.meta.url));

// Not a name the scaffolder emits, so it cannot collide with a snapshot.
const MANIFEST = "files.txt";

const COMBOS = [
  // --testing jest is the default already. It is here because passing a config
  // flag is what puts the CLI in non-interactive mode, and --no-install and
  // --no-git do not count, so without it the run blocks on prompts.
  { name: "default", flags: ["--testing", "jest"] },
  {
    name: "full",
    flags: [
      "--shadcn",
      "--testing",
      "vitest",
      "--database",
      "postgres",
      "--linter",
      "oxc",
      "--extras",
      "anti-slop",
      "--deployment",
      "standalone",
      "--include-example",
    ],
  },
  {
    name: "standalone-di",
    flags: ["--nest-di-only", "--deployment", "standalone", "--include-example"],
  },
  { name: "spa", flags: ["--deployment", "spa", "--shadcn", "--include-example"] },
  // The only combo reaching the templates gated on no todo example: the di-only
  // app module and api index, the non-standalone di next config, and the
  // shadcn home page.
  { name: "di-shadcn-bare", flags: ["--shadcn", "--nest-di-only"] },
];

// Derived rather than matched on extension, so a binary added under a new
// extension cannot slip through and get snapshotted as utf8 mojibake.
const STATIC_FILES = new Set(
  Object.values(templates)
    .flatMap((mod) => mod.staticFiles ?? [])
    .map((file) => file.filename),
);

// Static files are byte copies of sources reviewed in this repo, and
// packages/ui/src/components is vendored shadcn covered by
// scripts/check-ui-drift.mjs. Both still appear in the manifest, so one being
// added or removed is still visible.
const contentless = (file: string) =>
  STATIC_FILES.has(file) || file.startsWith("packages/ui/src/components/");

// The only nondeterministic byte in a --no-install --no-git scaffold.
const normalize = (file: string, contents: string) =>
  file === ".env"
    ? contents.replace(/^BETTER_AUTH_SECRET=.*$/m, "BETTER_AUTH_SECRET=<snapshot>")
    : contents;

const posix = (from: string, to: string) => path.relative(from, to).split(path.sep).join("/");

async function filesIn(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { recursive: true, withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => posix(dir, path.join(entry.parentPath, entry.name)))
    .sort();
}

// Snapshots taken from a stale dist would be wrong and then committed. Turbo
// builds first for `pnpm test`, but a bare `vitest` run bypasses it.
async function distIsStale() {
  const built = (await stat(CLI)).mtimeMs;
  const entries = await readdir(SRC, { recursive: true, withFileTypes: true });
  const sources = entries.filter((entry) => entry.isFile() && !entry.name.endsWith(".test.ts"));
  const times = await Promise.all(
    sources.map(async (entry) => (await stat(path.join(entry.parentPath, entry.name))).mtimeMs),
  );
  return times.some((time) => time > built);
}

const scaffolded = new Map<string, { dir: string; files: string[] }>();
let root: string;

beforeAll(async () => {
  if (!existsSync(CLI)) {
    throw new Error(`${CLI} is missing. Run \`pnpm build --filter=create-newt-app\` first.`);
  }
  if (await distIsStale()) {
    throw new Error(`${CLI} is older than src. Run \`pnpm build --filter=create-newt-app\` first.`);
  }

  root = await mkdtemp(path.join(tmpdir(), "scaffold-snapshot-"));

  await Promise.all(
    COMBOS.map(async ({ name, flags }) => {
      // Every combo scaffolds the same project name, in its own directory, so
      // the snapshots differ by selection and not by npm scope.
      const cwd = path.join(root, name);
      await mkdir(cwd);
      await run(process.execPath, [CLI, "my-app", ...flags, "--no-install", "--no-git"], { cwd });

      const dir = path.join(cwd, "my-app");
      scaffolded.set(name, { dir, files: await filesIn(dir) });
    }),
  );
}, 300_000);

afterAll(async () => {
  if (root) await rm(root, { recursive: true, force: true });
});

describe.each(COMBOS)("$name", ({ name }) => {
  it("emits the same files", async () => {
    const { files } = scaffolded.get(name)!;

    await expect(files.join("\n") + "\n").toMatchFileSnapshot(path.join(SNAPSHOTS, name, MANIFEST));
  });

  it("emits the same contents", async () => {
    const { dir, files } = scaffolded.get(name)!;

    // Soft, so one run reports every drifted file rather than only the first.
    await Promise.all(
      files
        .filter((file) => !contentless(file))
        .map(async (file) => {
          const contents = normalize(file, await readFile(path.join(dir, file), "utf8"));
          await expect.soft(contents).toMatchFileSnapshot(path.join(SNAPSHOTS, name, file));
        }),
    );
  });
});

// Vitest reports obsolete snapshots only for classic __snapshots__ files, never
// for file snapshots, and -u will not delete them either. Without this a
// template that stops being emitted leaves its snapshot behind forever.
it("keeps no snapshot the scaffolder no longer emits", async () => {
  const expected = new Set(
    COMBOS.flatMap(({ name }) => {
      const { files } = scaffolded.get(name)!;
      return [
        `${name}/${MANIFEST}`,
        ...files.filter((file) => !contentless(file)).map((file) => `${name}/${file}`),
      ];
    }),
  );

  const entries = await readdir(SNAPSHOTS, { recursive: true, withFileTypes: true }).catch(
    () => [],
  );
  const orphans = entries
    .filter((entry) => entry.isFile())
    .map((entry) => posix(SNAPSHOTS, path.join(entry.parentPath, entry.name)))
    .filter((file) => !expected.has(file));

  expect(orphans).toEqual([]);
});
