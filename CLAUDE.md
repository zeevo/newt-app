# newt-app

`newt-app` is a project scaffolder. `create-newt-app` is a CLI that generates new full-stack TypeScript monorepos.

## How it works

When someone runs `create-newt-app my-thing`, the CLI reads templates from `packages/create-newt-app/src/templates/` and writes them out as a new project.

## Terminology

- **newt app** — a project created by running `create-newt-app`. Lives outside this repo (e.g. `/tmp/test-app`). Not to be confused with the newt-app site.
- **the docs** — `apps/web` / `apps/api` / `packages/ui` inside this monorepo. The docs site for newt-app. Run with `pnpm --filter=web dev`.

## Key distinction

- **`packages/create-newt-app/src/templates/`** — source of truth for what gets scaffolded. Edit these when changing the default app.
- **`apps/web`**, **`apps/api`**, **`packages/ui`**, etc. — the dev/demo app inside this monorepo. These are NOT template outputs.

## When making changes

If asked to change the default app (styling, components, structure), edit the templates only:

- Web app templates: `packages/create-newt-app/src/templates/web/templates/`
- UI package templates: `packages/create-newt-app/src/templates/ui/templates/`
- API templates: `packages/create-newt-app/src/templates/api/templates/`

## Iterating on templates

After editing any template source file, rebuild with the fast filter command (not full `pnpm build`):

```bash
# 1. Rebuild only what's needed
pnpm build --filter=create-newt-app

# 2. Scaffold a test app (--no-install skips pnpm install, faster for iteration)
cd /tmp && node /path/to/newt-app/packages/create-newt-app/dist/index.js test-app --no-install --no-git

# 3. Install and verify
cd /tmp/test-app && pnpm install && pnpm lint
```

To re-test from scratch:

```bash
chmod -R 755 /tmp/test-app && rm -rf /tmp/test-app
```

(`chmod` first — NestJS build can create root-owned files that block `rm -rf`.)

## Updating scaffold snapshots

`packages/create-newt-app/snapshots/` holds the full output of five scaffolded apps, one
directory per CLI combo. Any template edit changes them, so regenerate and review the diff
as part of the change:

```bash
pnpm build --filter=create-newt-app        # snapshots come from dist, not src
pnpm --filter=create-newt-app test -u
```

The test refuses to run against a `dist` older than `src`, so the rebuild is not optional.
Snapshots keep the extension the scaffolder emitted, which means vitest, oxfmt and oxlint
are all configured to skip that directory (`--disable-nested-config` on the root `lint` and
`format` scripts exists because the `full` combo emits its own `.oxlintrc.json` and
`.oxfmtrc.json`).

Adding a combo needs one extra step: the scaffolded `.gitignore` ignores `.env`, and a
nested gitignore outranks the root one, so the new combo's `.env` snapshot needs
`git add -f packages/create-newt-app/snapshots/<combo>/.env` the first time.

## Running a newt app

No database setup needed for smoke testing. Just:

```bash
# Free ports — only kill Node processes, not browsers
for pid in $(lsof -ti:3000,3001 2>/dev/null); do
  comm=$(ps -p $pid -o comm= 2>/dev/null)
  if [[ "$comm" == *node* ]]; then kill -9 $pid 2>/dev/null; fi
done

chmod -R 755 /tmp/test-app 2>/dev/null && rm -rf /tmp/test-app
cd /tmp && node /path/to/newt-app/packages/create-newt-app/dist/index.js test-app --no-git
cd /tmp/test-app && pnpm dev &
```

Check it's up: `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000`

## anti-slop

`tools/oxlint/anti-slop` holds oxlint rules vendored from dmmulroy/anti-slop, loaded
by `.oxlintrc.json`, so `pnpm lint` enforces them like any other rule.

All fifteen are on. `packages/ui/src/components` is exempt from the three it trips,
since that is upstream shadcn code we re-pull rather than write.

`packages/create-newt-app/src/templates/anti-slop/static/` is a second copy at the same
upstream pin, shipped to scaffolded apps by `--extras anti-slop`. Re-sync both together.

## Keeping shadcn components current

`packages/ui` is generated from the shadcn-ui templates, which are themselves
`shadcn add` output. Two questions, one script:

```bash
node scripts/check-ui-drift.mjs                     # does packages/ui still match the templates?
node scripts/check-ui-drift.mjs --upstream          # do the templates still match shadcn?
node scripts/check-ui-drift.mjs --upstream --write  # take shadcn's version, then resync packages/ui
```

Manual, not CI: the upstream half runs the shadcn CLI over the network. Review
the diff and open a PR with a changeset, since scaffolded apps get the result.

## Adding a new template file

Three places to update when adding a template (e.g. a new UI component):

1. **Create the template** in `packages/create-newt-app/src/templates/ui/templates/my-component.ts` (or `web/templates/`)
2. **Register it** in the module index (`packages/create-newt-app/src/templates/ui/index.ts`):
   - Add the import
   - Add to the `templates: []` array
3. **Export it** (UI components only) — add an entry to `exports` in `packages/create-newt-app/src/templates/ui/templates/package-json.ts`

## Adding a static file (fonts, favicons, images)

Static files (binaries, fonts, SVGs) live in `packages/create-newt-app/src/templates/web/static/` and are mapped to output paths via `staticFiles` in `packages/create-newt-app/src/templates/web/index.ts`.

To add a new static file:

1. Copy the file into `packages/create-newt-app/src/templates/web/static/` (or a subdirectory)
2. Add a `{ src: "web/static/...", filename: "apps/web/..." }` entry to `staticFiles` in `packages/create-newt-app/src/templates/web/index.ts`

Public files (served at `/`) go to `apps/web/public/`. Next.js special files (favicon, icons, manifest) go to `apps/web/app/`.

## PR workflow

**Always work in a feature branch — never commit directly to main.**

1. `git checkout main && git pull`
2. `git checkout -b <descriptive-kebab-case-name>`
3. Implement and commit with short lowercase messages (no prefixes, no period)
4. Add a changeset with `/changeset` skill — required before merging
5. Push and open PR with `gh pr create`

**PR body:** summary bullets only — no test plan section. No "Generated with Claude Code" attribution.

**Changesets:** all packages version together via the `fixed` group in `.changeset/config.json` — one changeset bumps all in lockstep.

**CI checks:** `pnpm lint`, `pnpm test`, `pnpm build` on the monorepo root. Does NOT check scaffolded app correctness.

## What's working well

- globals.css lives in `packages/ui/src/globals.css` and is imported by the web app as `@projectName/ui/globals.css`
- PostCSS config lives in `packages/ui/postcss.config.mjs` and web app delegates to it
- UI package owns: `button.tsx`, `link.tsx`, `logo.tsx`, `utils.ts` (cn), `globals.css`, `postcss.config.mjs`
- CSS variables use dark-only oklch values in `:root` — no light mode, no `.dark` class needed
- Semantic Tailwind classes (`text-foreground`, `text-muted-foreground`, `decoration-muted-foreground`) work because `@theme inline` maps the CSS variables
