// @vitest-environment node
import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { buildCommand, deploymentOptions, type Config } from "@/lib/build-command";
import { scaffoldTree, type TreeNode } from "@/lib/scaffold-tree";

// The tree claims to show what `create-newt-app` writes to disk. Nothing about
// the component can prove that, so this scaffolds a real project for every
// config the builder can reach and compares the two. The scaffolder is the
// source of truth: when this fails, the tree is what's wrong.
const run = promisify(execFile);

const CLI = fileURLToPath(
  new URL("../../../packages/create-newt-app/dist/index.js", import.meta.url),
);

// Only these options change which files exist. `testing` changes none of
// them, and `database` only swaps an annotation, so both stay pinned.
const configs: Config[] = (["full", "nest-di-only", "bare"] as const).flatMap((mode) =>
  deploymentOptions(mode).flatMap((deployment) =>
    [true, false].flatMap((shadcn) =>
      [true, false].flatMap((includeExample) =>
        (["eslint", "oxc"] as const).map((linter) => ({
          shadcn,
          testing: "jest" as const,
          database: "sqlite" as const,
          linter,
          deployment,
          mode,
          includeExample,
        })),
      ),
    ),
  ),
);

const key = (c: Config) =>
  [
    c.mode,
    c.deployment,
    c.shadcn ? "shadcn" : "plain",
    c.linter,
    c.includeExample ? "todo" : "empty",
  ].join(" ");

// The builder hands users this exact command, so drive the CLI with the flags
// it produces rather than a second hand-rolled translation of Config.
const flagsFor = (c: Config) => {
  const [, flags] = buildCommand(c).split(" -- ");
  return flags ? flags.split(" ") : [];
};

function flatten(nodes: TreeNode[]): TreeNode[] {
  return nodes.flatMap((node) => [node, ...flatten(node.children ?? [])]);
}

async function emittedFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { recursive: true, withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => path.relative(dir, path.join(entry.parentPath, entry.name)));
}

const scaffolded = new Map<string, string[]>();
let root: string;

beforeAll(async () => {
  if (!existsSync(CLI)) {
    throw new Error(`${CLI} is missing. Run \`pnpm build --filter=create-newt-app\` first.`);
  }

  root = await mkdtemp(path.join(tmpdir(), "scaffold-tree-"));

  await Promise.all(
    configs.map(async (c, i) => {
      const name = `probe-${i}`;
      await run(process.execPath, [CLI, name, ...flagsFor(c), "--no-install", "--no-git"], {
        cwd: root,
      });
      scaffolded.set(key(c), await emittedFiles(path.join(root, name)));
    }),
  );
}, 300_000);

afterAll(async () => {
  if (root) await rm(root, { recursive: true, force: true });
});

describe("scaffoldTree", () => {
  // Union across configs, so each config is also checked for what it hides.
  const everyPath = [
    ...new Map(
      configs.flatMap((c) =>
        flatten(scaffoldTree(c)).map((node) => [node.path, node] as [string, TreeNode]),
      ),
    ).values(),
  ];

  it.each(configs.map((c) => [key(c), c] as const))(
    "matches what the scaffolder writes for %s",
    (label, c) => {
      const files = scaffolded.get(key(c))!;
      const shown = new Set(flatten(scaffoldTree(c)).map((node) => node.path));

      const expected = everyPath.map((node) => {
        const exists =
          node.kind === "file"
            ? files.includes(node.path)
            : files.some((file) => file.startsWith(`${node.path}/`));
        return `${exists ? "shown" : "hidden"} ${node.path}`;
      });
      const actual = everyPath.map(
        (node) => `${shown.has(node.path) ? "shown" : "hidden"} ${node.path}`,
      );

      expect(actual, label).toEqual(expected);
    },
  );

  it("counts the shadcn components it advertises", () => {
    const c = configs.find((config) => config.shadcn)!;
    const node = flatten(scaffoldTree(c)).find((n) => n.path === "packages/ui")!;
    const count = scaffolded
      .get(key(c))!
      .filter((file) => file.startsWith("packages/ui/src/components/")).length;

    expect(node.annotation).toBe(`shadcn/ui + ${count} components`);
  });
});
