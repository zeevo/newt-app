# create-newt-app

## 0.19.2

### Patch Changes

- e3ad1b8: remove the Considerations section from the Vercel deployment docs
  - @newt-app/templates@0.19.2

## 0.19.1

### Patch Changes

- 135703e: redesign the deployment docs diagrams with a consistent, crisp SVG system
  - @newt-app/templates@0.19.1

## 0.19.0

### Minor Changes

- 60ccbe6: run db migrations automatically before dev via a turbo dependsOn, so `pnpm dev` is a single command to get going

### Patch Changes

- @newt-app/templates@0.19.0

## 0.18.9

### Patch Changes

- 0501de8: add tailwind eslint rules to the docs site and fix a conflicting border class
- 0501de8: rework the homepage hero: release pill, descriptive headline with inline logo chips
  - @newt-app/templates@0.18.9

## 0.18.8

### Patch Changes

- 23a89d0: add vitest/globals to the scaffolded api tsconfig so typed lint resolves test globals
  - @newt-app/templates@0.18.8

## 0.18.7

### Patch Changes

- 129a8eb: fix scaffolded app.controller.spec: provide AppService in the testing module
  - @newt-app/templates@0.18.7

## 0.18.6

### Patch Changes

- 0ee50e7: fix --bare with --nest-di-only: api index no longer exports the removed todos service
  - @newt-app/templates@0.18.6

## 0.18.5

### Patch Changes

- 23e6b04: drop the kysely logo from the homepage animation
  - @newt-app/templates@0.18.5

## 0.18.4

### Patch Changes

- 87d8d6c: remove unused video showcase component and demo stub from the docs site
  - @newt-app/templates@0.18.4

## 0.18.3

### Patch Changes

- 714353c: fix homepage layout on mobile: auto-sizing overlap card, shorter hero, no-wrap file tree rows
  - @newt-app/templates@0.18.3

## 0.18.2

### Patch Changes

- 4f34c3e: add docs sections to the mobile nav menu
  - @newt-app/templates@0.18.2

## 0.18.1

### Patch Changes

- d36be35: fix react/prop-types lint warnings in the scaffolded shadcn calendar
  - @newt-app/templates@0.18.1

## 0.18.0

### Minor Changes

- 72472a3: scaffold a preconfigured components.json so shadcn add works from day one

### Patch Changes

- @newt-app/templates@0.18.0

## 0.17.1

### Patch Changes

- 1f9f576: replace hardcoded grays with theme tokens in the base web templates
  - @newt-app/templates@0.17.1

## 0.17.0

### Minor Changes

- 896e211: add --bare option and interactive prompt to scaffold without the todo example

### Patch Changes

- @newt-app/templates@0.17.0

## 0.16.0

### Minor Changes

- 14f779b: upgrade next.js to 16.2.10 in all web app templates and bump @next/eslint-plugin-next to match

### Patch Changes

- 5cee2c4: fix release flow: single version commit, publish, then push with tags
- 2454ca9: refresh the docs site ui package to the base-ui shadcn generation the templates ship
  - @newt-app/templates@0.16.0

## 0.15.1

### Patch Changes

- d53bad4: clean up hero markup: semantic color tokens and remove dead classes
- 0732928: replace orbit with logo-rain animation on the docs homepage
  - @newt-app/templates@0.15.1

## 0.15.0

### Patch Changes

- Updated dependencies [673ee97]
  - @newt-app/templates@0.15.0

## 0.14.3

### Patch Changes

- fc92e32: port copy button from shadcn/ui with legacy clipboard fallback and consistent positioning
- caf14aa: restyle docs right-hand sidebar to match shadcn/ui toc patterns
  - @newt-app/templates@0.14.3

## 0.14.2

### Patch Changes

- 37aae9b: use inject utility in di-only route templates instead of getContext + ctx.get
  - @newt-app/templates@0.14.2

## 0.14.1

### Patch Changes

- ff8f91e: add prev/next pager navigation to docs pages
- c161ff7: add animated request flow diagram to introduction docs
  - @newt-app/templates@0.14.1

## 0.14.0

### Minor Changes

- f042342: add inject helper to nest di-only mode
- b9d8ae8: remove vercel deployment option; update deployment docs to be di-only mode centric

### Patch Changes

- 073716c: make homepage orbit animation larger and slower
- e573358: add deployment docs
  - @newt-app/templates@0.14.0

## 0.13.2

### Patch Changes

- 080bf98: revert pull_request trigger from release workflow; fix squash commit format instead
  - @newt-app/templates@0.13.2

## 0.13.1

### Patch Changes

- b05930e: fix release workflow not triggering when Version Packages PR is merged
  - @newt-app/templates@0.13.1

## 0.13.0

### Minor Changes

- fd98f57: test PAT-triggered release workflow

### Patch Changes

- @newt-app/templates@0.13.0

## 0.12.0

### Minor Changes

- facdf47: add AppService, rename getNestApp to getContext, wire AppService into /api/hello

### Patch Changes

- @newt-app/templates@0.12.0

## 0.11.0

### Minor Changes

- f3d4274: release

### Patch Changes

- @newt-app/templates@0.11.0

## 0.10.0

### Minor Changes

- 4133089: remove main.ts from di-only mode

### Patch Changes

- @newt-app/templates@0.10.0

## 0.9.0

### Minor Changes

- 4fb6ed6: move controllers and guards to api-controllers module, excluded in di-only mode

### Patch Changes

- @newt-app/templates@0.9.0

## 0.8.3

### Patch Changes

- 48318a2: add /api/hello route for di-only mode
  - @newt-app/templates@0.8.3

## 0.8.2

### Patch Changes

- 247b9cd: release
  - @newt-app/templates@0.8.2

## 0.8.1

### Patch Changes

- e75e57f: add todos service spec to jest and vitest template variants
- 8ff37e3: lint runs --fix by default, add lint:check for check-only
- 2e5e5c7: remove server scripts and platform-express from nest-di-only api package
  - @newt-app/templates@0.8.1

## 0.8.0

### Minor Changes

- 582ec04: publish nest-di-only mode and next.config fixes

### Patch Changes

- @newt-app/templates@0.8.0

## 0.7.0

### Minor Changes

- bc79044: fix github link in docs config
- 9b1b647: add nest-di-only mode: NestJS as a DI container inside Next.js, with App Router route handlers calling services directly
- 185b61c: update docs logo to newt icon

### Patch Changes

- 86bfddc: remove standalone output from base next.config, add AGENTS.md and CLAUDE.md to web template
  - @newt-app/templates@0.7.0

## 0.6.0

### Minor Changes

- ace40a1: add deployment strategy option to CLI: standalone (default), custom server, SPA mode, Vercel

### Patch Changes

- @newt-app/templates@0.6.0

## 0.5.0

### Minor Changes

- fb26655: minor release

### Patch Changes

- @newt-app/templates@0.5.0

## 0.4.1

### Patch Changes

- a65f089: use CORS_ORIGIN env var in NestJS main.ts, falling back to localhost:3000
  - @newt-app/templates@0.4.1

## 0.4.0

### Minor Changes

- 37b7d8a: consistent filename styling across page.tsx in both default and shadcn modes
- b0cb35b: show jest before vitest in the testing framework prompt
- 0c160dc: load root .env in api and web so monorepo apps pick up a single .env at the repo root
- 81b3730: scaffold .env directly instead of .env.example

### Patch Changes

- @newt-app/templates@0.4.0

## 0.3.0

### Minor Changes

- b5af71d: update page.tsx layout to use rounded cards and remove border-l/border-r columns

### Patch Changes

- @newt-app/templates@0.3.0

## 0.2.2

### Patch Changes

- 7fb209f: add next-themes support when shadcn/ui is selected
  - @newt-app/templates@0.2.2

## 0.2.1

### Patch Changes

- 8962d3f: shadcn apps now default to dark mode with shadcn Input, Label, Checkbox, and Card components in page, auth-form, and todo-list
  - @newt-app/templates@0.2.1

## 0.2.0

### Minor Changes

- 9ba4ec3: add shadcn/ui option to create-newt-app

### Patch Changes

- Updated dependencies [9ba4ec3]
  - @newt-app/templates@0.2.0

## 0.1.1

### Patch Changes

- 683e84e: fix npm publish permissions and group packages into fixed release
- Updated dependencies [683e84e]
  - @newt-app/templates@0.1.1

## 0.1.0

### Minor Changes

- 8bf53d1: ci, jest, typescript 6, new shadcn components, and template improvements

### Patch Changes

- Updated dependencies [8bf53d1]
  - @newt-app/templates@0.1.0

## 0.0.2

### Patch Changes

- 83647ca: Initial publish
- Updated dependencies [83647ca]
  - @newt-app/templates@0.0.2
