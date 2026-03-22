# newt-app

`newt-app` is a project scaffolder. `create-newt-app` is a CLI that generates new full-stack TypeScript monorepos.

## How it works

When someone runs `create-newt-app my-thing`, the CLI reads templates from `packages/templates/src/` and writes them out as a new project.

## Key distinction

- **`packages/templates/src/`** — source of truth for what gets scaffolded. Edit these when changing the default app.
- **`apps/web`**, **`apps/api`**, **`packages/ui`**, etc. — the dev/demo app inside this monorepo. These are NOT template outputs.

## When making changes

If asked to change the default app (styling, components, structure), edit the templates only:

- Web app templates: `packages/templates/src/web/templates/`
- UI package templates: `packages/templates/src/ui/templates/`
- API templates: `packages/templates/src/api/templates/`

Do not edit `apps/web` or other live packages unless explicitly asked.

## Iterating on templates

After editing any template source file, the packages must be rebuilt before the CLI reflects the changes:

```bash
# 1. Rebuild (from repo root)
pnpm build

# 2. Scaffold a test app
cd /tmp && node /path/to/newt-app/packages/create-newt-app/dist/index.js test-app --no-install --no-git

# 3. Install and verify
cd /tmp/test-app && pnpm install && pnpm check-types && pnpm lint
```

To re-test from scratch:
```bash
rm -rf /tmp/test-app
```

## Running a newt app

No database setup needed for smoke testing. Just:

```bash
lsof -ti:3000,3001 | xargs kill -9 2>/dev/null  # free ports
rm -rf /tmp/test-app
cd /tmp && node /path/to/newt-app/packages/create-newt-app/dist/index.js test-app --no-git
cd /tmp/test-app && cp .env.example .env && pnpm dev &
```

Check it's up: `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000`

## What's working well

- Always rebuild templates (`pnpm build --filter=@newt-app/templates --filter=create-newt-app`) before scaffolding — faster than full `pnpm build`
- globals.css lives in `packages/ui/src/globals.css` and is imported by the web app as `@projectName/ui/globals.css`
- PostCSS config lives in `packages/ui/postcss.config.mjs` and web app delegates to it
- UI package owns: `button.tsx`, `link.tsx`, `utils.ts` (cn), `globals.css`, `postcss.config.mjs`
- CSS variables use dark-only oklch values in `:root` — no light mode, no `.dark` class needed
- Semantic Tailwind classes (`text-foreground`, `text-muted-foreground`, `decoration-muted-foreground`) work because `@theme inline` maps the CSS variables
