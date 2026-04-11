# create-newt-app

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
