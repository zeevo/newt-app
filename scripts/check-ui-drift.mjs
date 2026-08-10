// Two questions about packages/ui and the shadcn-ui templates:
//
//   internal  does packages/ui still match the templates it was generated from?
//   upstream  do the templates still match what shadcn itself would emit?
//
// The upstream half compares against `shadcn add` output rather than the
// registry JSON. The registry serves shadcn's authoring source, which carries
// markers their CLI strips on the way out: an IconPlaceholder wrapper that
// resolves to your configured icon library, and cn-font-heading and friends.
// Diffing the raw registry reports drift in nearly every component when there
// is none.
//
//   node scripts/check-ui-drift.mjs             # internal only, offline
//   node scripts/check-ui-drift.mjs --upstream  # also diff against shadcn add
//   node scripts/check-ui-drift.mjs --write     # sync packages/ui from templates

import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cna = path.join(repo, "packages/create-newt-app");
const require = createRequire(path.join(cna, "package.json"));
// ejs and esbuild belong to create-newt-app, not the repo root
const ejs = require("ejs");

const write = process.argv.includes("--write");
const upstream = process.argv.includes("--upstream");

// The templates are TS with extensionless relative imports, so bundle them to a
// temp ESM file rather than fighting a TS loader.
const bundle = path.join(repo, "node_modules/.cache/ui-drift-templates.mjs");
fs.mkdirSync(path.dirname(bundle), { recursive: true });
execFileSync(
  require.resolve("esbuild/bin/esbuild"),
  [
    "src/templates/index.ts",
    "--bundle",
    "--format=esm",
    "--platform=node",
    `--outfile=${bundle}`,
  ],
  { cwd: cna, stdio: "pipe" },
);
const { templates } = await import(`${bundle}?t=${process.pid}`);

const data = {
  projectName: "newt-app",
  testing: "jest",
  database: "sqlite",
  deployment: "none",
  authSecret: "drift-check",
  versions: templates.versions ?? {},
};

const render = (template) => {
  let out = ejs.render(template, data);
  return out.endsWith("\n") ? out : out + "\n";
};

let failed = false;

// ---------------------------------------------------------------- internal

// Intentional divergences between the templates and the site's ui package:
// package.json carries repo-specific fields, globals.css holds the site's own
// design work, and the repo lints with its own eslint.config.js.
const SKIP = new Set([
  "packages/ui/package.json",
  "packages/ui/src/styles/globals.css",
  "packages/ui/eslint.config.mjs",
]);

const tracked = templates.shadcnUi.templates.filter(
  (t) => t.filename.startsWith("packages/ui/") && !SKIP.has(t.filename),
);

const drifted = tracked.filter((t) => {
  const rendered = render(t.template);
  const dest = path.join(repo, t.filename);
  if (fs.existsSync(dest) && fs.readFileSync(dest, "utf8") === rendered) {
    return false;
  }
  if (write) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, rendered);
  }
  return true;
});

// Files packages/ui has that no template claims: components added to the site
// without a matching template, which scaffolded apps therefore never get.
const claimed = new Set(templates.shadcnUi.templates.map((t) => t.filename));
const untracked = ["src/components", "src/hooks", "src/lib"]
  .flatMap((dir) => {
    const abs = path.join(repo, "packages/ui", dir);
    if (!fs.existsSync(abs)) return [];
    return fs.readdirSync(abs).map((f) => `packages/ui/${dir}/${f}`);
  })
  .filter((f) => !claimed.has(f));

if (drifted.length === 0) {
  console.log(`internal: packages/ui matches the templates (${tracked.length} files)`);
} else if (write) {
  console.log(`internal: synced ${drifted.length} file(s) from the templates:`);
  drifted.forEach((t) => console.log(`  ${t.filename}`));
} else {
  failed = true;
  console.error(
    `internal: packages/ui has drifted in ${drifted.length} of ${tracked.length} file(s):`,
  );
  drifted.forEach((t) => console.error(`  ${t.filename}`));
  console.error("\nFix the templates first, then run with --write.");
}

if (untracked.length > 0) {
  failed = true;
  console.error(`\ninternal: ${untracked.length} file(s) in packages/ui that no template claims:`);
  untracked.forEach((f) => console.error(`  ${f}`));
}

// ---------------------------------------------------------------- upstream

if (upstream) {
  const all = templates.shadcnUi.templates
    .map((t) => t.filename.match(/^packages\/ui\/src\/components\/(.+)\.tsx$/)?.[1])
    .filter(Boolean)
    .sort();

  // Asking for a name shadcn does not publish aborts the whole batch and emits
  // nothing, so intersect with the registry first. What is left over is ours.
  const index = await (await fetch("https://ui.shadcn.com/r/index.json")).json();
  const published = new Set((Array.isArray(index) ? index : index.items).map((i) => i.name));
  const components = all.filter((n) => published.has(n));
  const local = all.filter((n) => !published.has(n));

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "shadcn-drift-"));
  const ui = path.join(dir, "src/components/ui");
  fs.mkdirSync(path.join(dir, "src/lib"), { recursive: true });
  fs.mkdirSync(ui, { recursive: true });
  fs.writeFileSync(
    path.join(dir, "package.json"),
    JSON.stringify({ name: "drift", version: "0.0.0", private: true, type: "module" }),
  );
  fs.writeFileSync(
    path.join(dir, "tsconfig.json"),
    JSON.stringify({ compilerOptions: { baseUrl: ".", paths: { "@/*": ["./src/*"] } } }),
  );
  fs.writeFileSync(path.join(dir, "src/styles.css"), '@import "tailwindcss";\n');
  fs.writeFileSync(path.join(dir, "src/lib/utils.ts"), "export const cn = (...a) => a.join(' ')\n");

  const componentsJson = JSON.parse(
    fs.readFileSync(path.join(repo, "packages/ui/components.json"), "utf8"),
  );
  fs.writeFileSync(
    path.join(dir, "components.json"),
    JSON.stringify({
      $schema: "https://ui.shadcn.com/schema.json",
      style: componentsJson.style,
      // rsc decides whether the CLI keeps the "use client" directive, so it has
      // to match the scaffolded app or every client component reports drift
      rsc: true,
      tsx: true,
      tailwind: { config: "", css: "src/styles.css", baseColor: "neutral", cssVariables: true },
      iconLibrary: componentsJson.iconLibrary,
      aliases: {
        components: "@/components",
        utils: "@/lib/utils",
        ui: "@/components/ui",
        lib: "@/lib",
        hooks: "@/hooks",
      },
    }),
  );

  console.log(`\nupstream: asking shadcn to emit ${components.length} component(s)...`);
  try {
    execFileSync("npx", ["--yes", "shadcn@latest", "add", ...components, "--yes", "--overwrite"], {
      cwd: dir,
      stdio: "pipe",
    });
  } catch (error) {
    // the CLI exits non-zero when it skips a component it cannot emit, which is
    // expected here, so judge by what landed on disk rather than by exit code
    const stderr = error.stderr?.toString().trim();
    if (stderr) console.log(`upstream: shadcn said: ${stderr}`);
  }

  const canonical = (s) =>
    s
      .replace(/@newt-app\/ui\/lib\/utils/g, "UTILS")
      .replace(/@newt-app\/ui\/components\//g, "UI/")
      .replace(/@newt-app\/ui\/hooks\//g, "HOOKS/")
      .replace(/@\/lib\/utils/g, "UTILS")
      .replace(/@\/components\/ui\//g, "UI/")
      .replace(/@\/hooks\//g, "HOOKS/")
      .replace(/\s+/g, " ")
      .trim();

  const ours = new Map(
    templates.shadcnUi.templates
      .filter((t) => /^packages\/ui\/src\/components\/.+\.tsx$/.test(t.filename))
      .map((t) => [path.basename(t.filename, ".tsx"), render(t.template)]),
  );

  // Divergences we chose. Anything not listed here is unexplained and fails.
  const INTENTIONAL = {
    calendar:
      "two eslint-disable-next-line react/prop-types, without which the package lints with 4 warnings and --max-warnings 0 fails",
  };

  const diverged = [];
  const expected = [];
  const missing = [];
  for (const name of components) {
    const emitted = path.join(ui, `${name}.tsx`);
    // shadcn lists some components per style with no files, e.g. base-nova
    // dropped form in favour of field. Nothing to compare against.
    if (!fs.existsSync(emitted)) {
      missing.push(name);
      continue;
    }
    if (canonical(ours.get(name)) !== canonical(fs.readFileSync(emitted, "utf8"))) {
      (INTENTIONAL[name] ? expected : diverged).push(name);
    }
  }

  const compared = components.length - missing.length;
  if (diverged.length === 0) {
    console.log(
      `upstream: ${compared - expected.length} of ${compared} component(s) match what shadcn emits`,
    );
  } else {
    failed = true;
    console.error(`upstream: ${diverged.length} of ${compared} component(s) differ:`);
    diverged.forEach((n) => console.error(`  ${n}  (diff ${path.join(ui, n + ".tsx")})`));
  }
  expected.forEach((n) => console.log(`upstream: ${n} differs on purpose, ${INTENTIONAL[n]}`));
  if (missing.length > 0) {
    console.log(
      `upstream: ${missing.length} listed but not emitted for style ${componentsJson.style}: ${missing.join(", ")}`,
    );
  }
  if (local.length > 0) {
    console.log(`upstream: ${local.length} not in the registry, so ours alone: ${local.join(", ")}`);
  }
  console.log(`upstream: shadcn output kept at ${ui}`);
}

if (failed) process.exit(1);
