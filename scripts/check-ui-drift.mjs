// Checks that packages/ui matches the shadcn-ui templates (the source of
// truth for scaffolded apps). The docs site's ui package is generated from
// those templates by rendering them with projectName=newt-app — when the
// two drift apart (as happened between #93 and #111), this fails.
//
// Usage:
//   node scripts/check-ui-drift.mjs           # report drift, exit 1 if any
//   node scripts/check-ui-drift.mjs --write   # sync packages/ui from templates
//
// Requires the templates package to be built first:
//   pnpm build --filter=@newt-app/templates

import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(
  path.join(repo, "packages/create-newt-app/package.json"),
);
const ejs = require("ejs");

let templates;
try {
  ({ templates } = require(path.join(repo, "packages/templates/dist/index.js")));
} catch {
  console.error(
    "Could not load packages/templates/dist — run `pnpm build --filter=@newt-app/templates` first.",
  );
  process.exit(1);
}

// Intentional divergences between the templates and the docs site's ui package:
// - package.json: repo-specific name, version, and scripts
// - globals.css: docs-site design customizations live there
// - eslint.config.mjs: the repo uses its own eslint.config.js
const SKIP = new Set([
  "packages/ui/package.json",
  "packages/ui/src/styles/globals.css",
  "packages/ui/eslint.config.mjs",
]);

const data = { projectName: "newt-app", testing: "jest" };
const write = process.argv.includes("--write");

const drifted = [];
for (const t of templates.shadcnUi.templates) {
  if (!t.filename.startsWith("packages/ui/") || SKIP.has(t.filename)) continue;

  let rendered = ejs.render(t.template, data);
  if (!rendered.endsWith("\n")) rendered += "\n";

  const dest = path.join(repo, t.filename);
  const actual = fs.existsSync(dest) ? fs.readFileSync(dest, "utf8") : null;

  if (actual !== rendered) {
    drifted.push(t.filename);
    if (write) {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, rendered);
    }
  }
}

if (drifted.length === 0) {
  console.log("packages/ui matches the shadcn-ui templates.");
} else if (write) {
  console.log(`Synced ${drifted.length} file(s) from templates:`);
  for (const f of drifted) console.log(`  ${f}`);
} else {
  console.error(
    `packages/ui has drifted from the shadcn-ui templates in ${drifted.length} file(s):`,
  );
  for (const f of drifted) console.error(`  ${f}`);
  console.error(
    "\nFix the templates first (they are the source of truth), then run:\n  node scripts/check-ui-drift.mjs --write",
  );
  process.exit(1);
}
