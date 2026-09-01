# create-newt-app

## 0.31.7

### Patch Changes

- 6797e1a: drop the first-run telemetry notice

  The one-time block printed after the next steps is gone. `notifiedAt` went with it, so the state file now records only the unreachable backoff and is not written at all on a successful send.

  Nothing else changes: the same event is sent, and `DO_NOT_TRACK=1` and `NEWT_TELEMETRY_DISABLED=1` still turn it off.

## 0.31.6

### Patch Changes

- a6c7d7b: match the standalone compose file to the selected database

  `--deployment standalone` always emitted a Postgres `DATABASE_URL` and a `db: postgres:17-alpine` service, even for sqlite, which is the default. better-sqlite3 read that connection string as a file path and the migrate container died with `Cannot open database because the directory does not exist`, so the stack never came up.

  A sqlite scaffold now drops the `db` service and its healthcheck `depends_on` conditions, and points `DATABASE_URL` at `/data/app.db` on a `db_data` volume shared by web, api, and migrate. Postgres output is unchanged.

## 0.31.5

### Patch Changes

- 8cbf288: send one anonymous event per completed scaffold: the options chosen, the CLI and Node major versions, the platform, whether the run was driven by prompts or flags, and whether it was in CI. No project name, path, file contents or identifier of any kind, and the server does not store the client IP.

  Cancelled runs and failed scaffolds send nothing. Opt out with `DO_NOT_TRACK=1` or `NEWT_TELEMETRY_DISABLED=1`.

  The endpoint is inlined at build time and is empty in every build except an official release, so local builds, contributor test runs and this repo's own scaffold matrix cannot report anything.

## 0.31.4

### Patch Changes

- 646da2f: drop the Nest boilerplate a scaffolded api never uses

  `apps/api` declared five devDependencies nothing in the scaffold imports: `ts-node`, `tsconfig-paths`, `ts-loader`, `source-map-support` and `@eslint/eslintrc`. The first two came from the Nest starter manifest and were repeated in the DI-only and SPA manifests; the next two were injected by the jest module; the last was injected for the api's flat ESLint config, which uses `@eslint/js` and never touches `eslintrc`. Their only remaining reference was `test:debug`, which now runs `node --inspect-brk node_modules/.bin/jest --runInBand` (ts-jest already handles the transform). Jest 30 reads `jest.config.ts` on its own, so nothing needed a TypeScript loader.

  The api manifest also carried `"description": ""`, `"author": ""` and `"license": "UNLICENSED"` from the same starter, plus a `start:dev` that duplicated `dev` verbatim. Both are gone, which matches the other scaffolded packages.

  `apps/api/eslint.config.mjs` hardcoded `globals.jest` regardless of `--testing`. A vitest scaffold now gets `globals.vitest`, so `vi`, `assertType` and `expectTypeOf` are in scope instead of jest's set. No lint result changes: typescript-eslint turns `no-undef` off for TypeScript files, so the wrong list was inert.

## 0.31.3

### Patch Changes

- 39db3b0: Add autocomplete attributes to the auth form inputs so password managers can fill them and Chrome stops warning. Name and email get `name` and `email`; password gets `new-password` in sign up mode and `current-password` in sign in mode. Applies to both the plain and shadcn forms.
- 5b16f60: commit a `.env.example` so a clone can boot

  The scaffolder wrote `.env`, `.gitignore` ignored it, and `initGit` committed the result, so anyone cloning a newt app got a repo with no `BETTER_AUTH_SECRET`, no `BETTER_AUTH_URL`, no `DATABASE_URL` on postgres, and nothing naming them. A `.env.example` now ships next to `.env` with the same keys and a placeholder secret instead of the generated one.

  Both files also end with a newline. `.env` used to end mid-line on the secret, so appending a variable by hand ran onto that line.

- 93da549: Declare `dist/**` as a `build` output in the scaffolded `turbo.json`. The task only listed the Next.js `.next` directories, so `api#build` warned about missing outputs and its cache entry restored nothing: after deleting `apps/api/dist`, a cached build left `start:prod` with no `dist/main` to run.
- 3d7693c: list every `--deployment` choice in `--help`

  The help text read `Deployment: standalone, spa`, omitting `none`, which is both a valid value and the default. It now reads `Deployment: none, standalone, or spa`, matching the other flags, which already list every choice.

- b231d98: Build standalone images on `node:24-alpine` instead of `node:22-alpine`. Scaffolded apps declare `"engines": { "node": ">=24.0.0" }`, so every layer of a `--deployment standalone` build logged an unsupported-engine warning.
- 7d40877: Remove the stale `outputs: ["coverage/**"]` key from the `test` task in the scaffolded `turbo.json`. The `test` script runs `jest` / `vitest run`, which writes no coverage (that is `test:cov`, which is not a turbo task), so turbo printed a "no output files found for task api#test" warning on every `pnpm test`.
- 79c6dff: Scaffold on Next 16.3.3, up from 16.3.2. `@next/eslint-plugin-next` moves with it.
- 33f1bce: Normalize the project name instead of scaffolding a broken project. The name becomes the npm scope for every workspace package (`@name/db`, `@name/auth`, `@name/ui`), so `create-newt-app "My App"` used to scaffold happily and then die at `pnpm install` with `ERR_PNPM_INVALID_DEPENDENCY_NAME`. Names are now lowercased, spaces and other characters npm rejects become hyphens, leading `.` or `_` is dropped, and the result is capped at 214 characters. `create-newt-app "My App"` now creates `my-app` with `@my-app/db`, no error and no prompt. Only an empty name, or one with nothing left after normalizing (such as `...`), is still refused.
- 7e4e06e: Build the standalone api image from the build stage instead of `pnpm deploy`. The deploy step failed outright under pnpm 10 (`ERR_PNPM_DEPLOY_NONINJECTED_WORKSPACE`), and forcing it through left the api crashlooping: `pnpm deploy` hard-copies the source-consumed `auth` and `db` packages into `node_modules`, where Node refuses to strip types. Deriving the stage from `build` keeps them as symlinks into the workspace, which resolve fine, the same way the `migrate` stage already works.

## 0.31.2

### Patch Changes

- 5c1a0a1: Bump the scaffolded Next.js version from 16.3.0 to 16.3.2, and `@next/eslint-plugin-next` to match.

## 0.31.1

### Patch Changes

- b737598: Fix `--deployment spa --linter oxc` scaffolding an app that failed `pnpm lint` out of the box. The generated `next.config.js` spread a ternary into an otherwise empty object literal, which trips `unicorn(no-useless-spread)`; the ternary is now assigned directly.
- 8daee3d: Remove `--deployment custom-server`. The mode ran Next.js and Nest in one process behind a hand-written `apps/web/server.ts` that reached into Nest's HTTP server to re-dispatch requests, and it forced dev to depend on the api build because the bridge consumed `apps/api/dist` rather than TS source. `--deployment standalone` and `--deployment spa` remain, and `--nest-di-only` still runs Nest inside the Next.js process for anyone who wants a single process without Nest's HTTP layer.
- b737598: Stop shipping a broken e2e suite in `--nest-di-only` apps. DI-only Nest has no controllers of its own, so `apps/api/test/app.e2e-spec.ts` could never pass there: the api package never declared supertest, and even with it installed the spec 404s because the route lives in a Next handler. The spec, its runner config, the `test:e2e` script, and the README line are now omitted in that mode. Also adds `vitest/globals` to the DI-only api tsconfig so `--nest-di-only --testing vitest` apps lint clean.

## 0.31.0

### Minor Changes

- 6578e10: typecheck every workspace, not just the web app

  `pnpm typecheck` reached one package: `apps/api`, `packages/auth`, `packages/db` had no script, and `packages/ui` called its `check-types`, which turbo's task never matched. All five now have one, and the task exists under both linters rather than only oxc.

  Turning it on caught two config bugs. `packages/ui` resolved with NodeNext, which cannot follow subpath exports, so `next/link` had no types; the shared react-library config now uses Bundler resolution, matching how a bundler consumes the package. And `apps/api` typechecks through `tsconfig.build.json`, since its `rootDir` of `src` makes a plain `tsc` reject `test/` and `jest.config.ts`.

## 0.30.0

### Minor Changes

- 30490e0: scaffold with pnpm 10

  Generated apps pin `pnpm@10.34.5` and declare `pnpm.onlyBuiltDependencies`. pnpm 10 stopped running dependency build scripts unless they are named there, and without it `better-sqlite3` never compiles its bindings, which breaks `pnpm build` on the auth route.

### Patch Changes

- 570097d: make the strict lint reachable, and fix the jest regex escapes it caught

  eslint apps generated `lint:check` scripts with `--max-warnings 0`, but no root script or turbo task could reach them, so `pnpm lint` auto-fixed and tolerated warnings with nothing stricter to run. The root now has `lint:check` for both linters, and `apps/api` gets `--max-warnings 0` like the others.

  Running it surfaced a real bug: `jest.config.ts` under-escaped its regexes, so `testRegex` emitted `.*.spec.ts$` — a wildcard where a literal dot was meant.

  The standalone and custom-server deployments ship their own `turbo.json`, which never picked up the oxc/eslint split, so `pnpm typecheck` reported a missing task in oxc apps using either. All three templates now agree.

  It also caught three warnings the custom-server template had been shipping: the Nest request listener was typed `(req: any, res: any)`, now `IncomingMessage`/`ServerResponse`, and `server.ts` reads `PORT` without `turbo.json` declaring it.

## 0.29.0

### Minor Changes

- 758759a: add `--extras anti-slop`, which vendors dmmulroy/anti-slop into the scaffolded app

  The rules are an oxlint plugin, so the flag needs `--linter oxc` and is rejected with eslint. `tools/oxlint/anti-slop` holds the plugin source, `.oxlintrc.json` registers it and turns all 15 rules on as errors, and `pnpm lint` enforces them from the first commit. Vendored shadcn components are exempt, since they are upstream code rather than code you write.

- a984c12: run oxlint once from the root when `--linter oxc` is selected

  oxlint resolves the nearest config per file and covers a monorepo in one pass, so the per-package lint tasks were boilerplate around a tool fast enough not to need caching — and they left `apps/api`, `packages/auth` and `packages/db` unlinted. The root now owns `lint`, `lint:check`, `format` and `format:check`, turbo gains a `typecheck` task in place of `lint`, and `apps/web` keeps its `next typegen && tsc --noEmit` as a `typecheck` script. `--linter eslint` is unchanged.

### Patch Changes

- 831246d: The newt-app repo now formats itself with oxfmt instead of Prettier, matching what `create-newt-app --linter oxc` scaffolds: a root `.oxfmtrc.json` and `oxfmt` / `oxfmt --check` as the format scripts. Formatting moves to oxfmt's default 100 column width, and oxfmt also covers `.mjs` and `.css` files that the old Prettier glob missed. Scaffolded apps are unaffected; `--linter eslint` still ships Prettier and `--linter oxc` still ships oxfmt.
- 1b38762: The newt-app repo now lints itself with oxlint instead of ESLint, matching the layout `create-newt-app --linter oxc` scaffolds: one root `.oxlintrc.json` and an `oxlint` dev dependency per package. Scaffolded apps are unaffected; both `--linter eslint` and `--linter oxc` still generate what they did before.
- ac64cab: sync checkbox, field, radio-group and switch with current shadcn output

  shadcn added focus-visible handling for controls inside a `FieldLabel`; the four templates were emitting the older class strings.

## 0.28.0

### Minor Changes

- 9a9c50f: The todo example is now opt-in via `--include-example`, matching how `--shadcn` works.

  **Breaking:** the `--bare` flag is removed, and a non-interactive run without `--include-example` no longer scaffolds the todo example. Pass `--include-example` to keep it. The interactive prompt is unchanged and still defaults to including it.

### Patch Changes

- e9c9bc1: Scaffolded apps now ship an empty `.prettierrc`, so formatting follows prettier's defaults the way `create-turbo` and `create-next-app` do, instead of the `singleQuote` style inherited from `nest new`.
- 90e6493: Turn off `react/prop-types` in the React eslint config, which is redundant when props are typed, and drop the two `eslint-disable` comments it forced into the calendar component. All 60 registry components now match stock `shadcn add` output.

## 0.27.0

### Minor Changes

- 7e86ea1: Target the active Node LTS. Scaffolded apps declared `engines.node >= 20.9.0`, but Node 20 reached end of life on 2026-04-30, so new projects were claiming support for an unsupported runtime. The floor is now 24, `@types/node` moves from the maintenance line to `^24`, and CI runs on 24 as well, so the declared floor, the types and the tested runtime all agree.

  Node 22 is supported until 2027-04, so anyone who needs to stay there can lower `engines.node` and `@types/node` together in the generated project.

- 7c7fc24: Ship vitest 4 to scaffolded apps

  `vitest` and `@vitest/coverage-v8` move from `^3.0.0` to `^4.1.10`, matching the version this repo already runs its own tests on. Vitest 4 builds on Vite 7, which warns when a `.ts` config is loaded as CommonJS, so the API's vitest configs are now `vitest.config.mts` and `vitest.config.e2e.mts`.

### Patch Changes

- 9f31adf: Fill in the package metadata npm surfaces: author, repository (with the monorepo `directory`), homepage, and bugs. The package previously published with none of them, so npm showed no maintainer, no source link, and no way to file an issue.
- bac0772: Make `pnpm test:e2e` pass in a fresh app

  The e2e test requested `GET /` and expected the body `Hello World!`, but the controller serves `@Get('hello')` and returns `{ message: 'Hello from Nest' }`, so the test 404'd in both testing modes. Jest failed even earlier: `@thallesp/nestjs-better-auth` is ESM-only, and the e2e config transformed CommonJS, so the suite could not import `app.module.ts` at all. The jest e2e config now runs in ESM mode.

## 0.26.1

### Patch Changes

- 70c4c4d: Build the CLI with tsdown instead of tsup, which its own README now describes as no longer maintained and points at tsdown as the replacement. The published output is unchanged: the same `dist/index.js` entry the `bin` field names, the same shebang, and the same static template assets under `dist/static`. Sourcemaps are emitted now, which tsup was not doing here.
- 6e1d914: Remove three template files no module imported, so they were never scaffolded: a `form.tsx` left over from before the base-nova migration (which imports Radix while the rest of the package uses Base UI, and which base-nova replaces with `field`), a duplicate `eslint-config`, and a duplicate `jest-e2e.json` already emitted by the testing module. Scaffolded output is unchanged. A test now fails if a template file is not imported by any module, which neither the render tests nor the ui drift check could see, since both walk the registered set.
- 266beda: Drop the `font-heading` class from the six shadcn components that carried it, and the `--font-heading` token that backed it. Upstream tags those headings with `cn-font-heading`, which is an authoring marker the shadcn CLI strips on `add`, so a generated component ships no heading font at all. The six templates are now byte-identical to what `npx shadcn add` emits, which keeps future comparisons against upstream free of a permanent local difference.
- b10ad58: Honor `DATABASE_URL` for SQLite, and resolve the default from the project root rather than a fixed offset from `process.cwd()`. The cwd differs per caller: `packages/db` when migrating, `apps/web` under dev or start, and the project root under a standalone build. Only the first two matched the old `../../dev.db`, so a standalone build opened a different, empty database two directories above the project and every write failed. Signing up returned a 500 under `--deployment standalone --nest-di-only` while every route still answered, because the tables were in the other file.

  The turbo tasks that reach the database now declare `DATABASE_URL`, without which Turbo's strict environment mode dropped it before `migrate` and `build` could see it.

## 0.26.0

### Minor Changes

- 1485dd0: Check for pnpm, git, and a supported Node version before scaffolding anything. A missing tool used to surface as a spawn error partway through, after the project directory had already been created, which the next attempt then refused to overwrite. Only the tools a run will actually use are required, so `--no-install` still works without pnpm and `--no-git` without git.

  A failed `pnpm install` also reported "Installed." and let the run continue into formatting, which then failed with a second, more confusing error. It now fails on the install step.

### Patch Changes

- 4e20b6c: Add the newt-app logo to the README. The README is published to npm, so a release is needed for it to appear there.

## 0.25.0

### Minor Changes

- ae6c7e4: Update scaffolded apps to Next 16.3, and correct the Node floor. Scaffolded apps declared `node >=18` while Next 16 requires `>=20.9.0` and NestJS 11 requires `>=20`, so Node 18 satisfied the stated constraint and then failed at build. Both the scaffolded root and `create-newt-app` itself now declare `>=20.9.0`; the CLI previously declared no `engines` at all.

## 0.24.0

### Minor Changes

- 10c84e6: Add the attachment, bubble, marker, message, and message-scroller components to the shadcn UI templates, pulled from the shadcn registry at the base-nova style. message-scroller brings in `@shadcn/react` as a new ui package dependency. Also syncs `packages/ui/components.json`, which still pointed at the retired `new-york` style.

### Patch Changes

- 07fd617: Extract module selection out of the CLI into `selectModules(selection)` in `src/templates`, and add a render test that runs it across all 192 valid flag combinations. Each combination asserts that no two selected templates claim the same output filename, that every template renders through EJS, that every rendered `.json` parses, and that every `workspace:*` dependency points at a package that combination actually scaffolds. No change to scaffolded output.
- a8e4af9: Stop emitting a root `.prettierrc` when `--linter oxc` is selected. The file was registered in the `root` module, so it shipped with every scaffold, while every other prettier artifact (the eslint configs, the `prettier` devDependency, the `format` scripts) belongs to the `eslint-config` module that `oxc` replaces. It is now registered there too, so each linter emits only its own config. The render test asserts this across all 192 combinations.
- be86236: Add `@types/node` to the root package.json of a scaffolded app. Every configuration gets it, pinned from the versions registry.
- 0785104: Fix the render test, which broke when the versions registry and the combinatorial render test landed in separate PRs: `TemplateData` gained a required `versions` field that the test did not supply, so all 192 cases failed once both were on main. Also re-export `Selection` from `src/types.ts`, which `src/utils.ts` has always imported but never received, and add a `typecheck` script wired into CI. `tsc --noEmit` catches both of these; nothing ran it before because tsup does not typecheck. No change to scaffolded output.
- b0962c2: move every scaffolded dependency pin into a single versions registry and unify the ones that had drifted

## 0.23.4

### Patch Changes

- c43c7d3: Pass `BETTER_AUTH_URL` to the standalone Docker services. Without it Better Auth fell back to trusting `http://localhost:3000`, so a deployed stack rejected requests from its real origin.
- 504b318: Reject `--deployment custom-server --nest-di-only`. DI-only overwrites the scripts that would run the custom server, so `apps/web/server.ts` was generated but never invoked — the deployment mode was silently a no-op.
- 2592c14: Select templates by predicate instead of resolving collisions by composition order. Each generated file is now claimed by exactly one template for a given set of options, so a module can no longer silently overwrite another's file.

## 0.23.3

### Patch Changes

- 015fdd9: Fix the `--deployment standalone --nest-di-only` Dockerfile, which could not build: it filtered the api build by `api`, but DI-only names that package `@<projectName>/api`, so turbo failed with "No package found with name 'api' in workspace".

## 0.23.2

### Patch Changes

- 1ac195b: Use array methods instead of loops in the scaffolder's unit tests.
- 5413783: Extract the spa + nest-di-only rejection into a pure `validateDeploymentCombo` helper with unit tests. CLI behaviour and the error message are unchanged.
- dd103c7: Reject unrecognised values for `--testing`, `--database`, `--linter`, and `--deployment` instead of silently falling back to a default. A typo like `--deployment spaa` now exits with an error naming the valid choices rather than scaffolding with no deployment extras.

## 0.23.1

### Patch Changes

- 88fa7cb: Make `--deployment custom-server` actually run. The single-process server never booted in dev (missing deps) or production (`next start` ran instead of `server.ts`), so `/api/*` was unreachable in both.
- af628f3: Fix `--deployment standalone --nest-di-only`. DI-only overwrote the standalone `next.config.js` and dropped `output: "standalone"`, so the Docker build failed copying `.next/standalone`, and the api image stage ran an entrypoint DI-only never emits. DI-only standalone now builds a single web image with Nest wired in.
- b6784aa: Reject `--deployment spa --nest-di-only`. The combination silently produced an app with no static export and no working auth; SPA mode statically exports Next.js, which cannot contain the route handlers DI-only mode runs on.
- 95104f7: Serve the static export in `--deployment spa`. The `ServeStaticModule` template was overwritten by the api-controllers and todo-example app modules, so scaffolded SPA apps 404'd on `/`.

## 0.23.0

### Minor Changes

- c8db2f4: Passing any config flag (`--shadcn`, `--database`, `--testing`, `--linter`, `--deployment`, `--nest-di-only`, `--bare`) now runs the CLI non-interactively — using the flags and defaults for the rest. Running with no config flags launches the interactive prompts.

  **Breaking:** the `--ci` flag is removed. For a non-interactive default scaffold, pass any explicit flag (e.g. `--testing jest`).

### Patch Changes

- 5ddffdb: fix the custom-server deployment build: the Next.js build type-checked `apps/web/server.ts`, which imports the Nest `AppModule` and its decorator-laden controllers, using a tsconfig without decorator support. The custom-server module now excludes `server.ts` from the web tsconfig (it is built separately via `tsconfig.server.json`), so `pnpm build` succeeds. Added `--deployment custom-server` to the scaffold matrix.

## 0.22.20

### Patch Changes

- 5672caf: add the missing `@projectName/db` workspace dependency to the custom-server and spa api templates — the todo service imports it, so scaffolds in those deployment modes failed to resolve the module (`TS2307`)
- 01ad269: fix spa (static export) build: exclude the redundant Next.js Better Auth route handler, which cannot be statically exported. In spa mode NestJS serves auth via `AuthModule.forRoot`, so the Next.js handler was both unnecessary and broke `next build` with `output: export`

## 0.22.19

### Patch Changes

- 1d0d5cd: CI now builds each scaffolded app (`pnpm build`) across the flag matrix and, on the default combo, boots it and probes both servers over HTTP — the API at `GET /api/hello` (anonymous, DB-free) and the web homepage — asserting they actually serve. Catches production-build and runtime-boot regressions that lint/test miss.
- 7723de5: expand the CI scaffold matrix to cover the standalone deployment strategy and the shadcn + nest-di-only intersection, which previously went untested
- 748c035: fix invalid `bg-muted/50/50` double opacity modifier on input backgrounds in the auth form and todo list templates
- e6c6f0c: Fold the `@newt-app/templates` package into `create-newt-app` (now `src/templates/`) and bundle it at build time. The CLI no longer depends on a separately published templates package, so there is one published package and one release per version. No change to scaffolded output.
- 681f565: surface scaffold failures instead of swallowing them — a template render or static-file copy error now aborts with a non-zero exit and the real error, rather than printing "Done!" over a half-written project
- ccb783f: add vitest unit tests for the scaffolder's utils (package.json/script injection, ENOENT skipping, package.json sorting, project-name validation) and drop the unused `zod` dependency

## 0.22.18

### Patch Changes

- 45bcdf6: Release workflow now creates GitHub Releases on publish. Switches releasing to the official `changesets/action` (version-PR + publish, `createGithubReleases`), which also fixes the empty-commit push failure.
  - @newt-app/templates@0.22.18

## 0.22.17

### Patch Changes

- 0e9cf01: Refresh the vendored shadcn/ui components to the current base-nova registry: update `button`, `card`, `calendar`, `carousel`, `drawer`, and `spinner` to their latest upstream source. `drawer` migrates from `vaul` to `@base-ui/react/drawer` (so `vaul` is dropped and `@base-ui/react` bumps to ^1.6.0). The other ~50 components were already current.
  - @newt-app/templates@0.22.17

## 0.22.16

### Patch Changes

- b676081: Add an `apps/web/components.json` to shadcn scaffolds, matching the official shadcn monorepo layout. This lets `shadcn add <component>` run from `apps/web` (the flow shadcn's docs prescribe), routing shared components to `packages/ui` and leaving room for app-local ones. Also adds the newer `rtl`/`menuColor`/`menuAccent` fields to both components.json files.
  - @newt-app/templates@0.22.16

## 0.22.15

### Patch Changes

- 724094d: Declare Better Auth's core tables (`user`, `session`, `account`, `verification`) in the scaffolded Kysely `DB` interface, with per-dialect column types (ISO strings and 0/1 on SQLite, `Date` and `boolean` on Postgres), so app queries can join against them type-safely.
  - @newt-app/templates@0.22.15

## 0.22.14

### Patch Changes

- 594ecb5: Point documentation links at the new newt-app.com domain (was newt-app.vercel.app): the package README and the scaffolded homepage "Learn more" link.
  - @newt-app/templates@0.22.14

## 0.22.13

### Patch Changes

- c035972: Remove the Vercel logo from the homepage tank animation.
  - @newt-app/templates@0.22.13

## 0.22.12

### Patch Changes

- 5612982: Pivot the homepage logo animation from falling rain to a tank: chips drift in random directions, bounce off the viewport walls and each other, and clicking still sends them ricocheting.
- 5612982: Homepage logo rain chips are now clickable: clicking one shoots it off in a random direction, it bounces off whatever it hits, and then drifts back into the rain.
  - @newt-app/templates@0.22.12

## 0.22.11

### Patch Changes

- 3464ab6: Chips in the homepage logo rain now bounce off each other: elastic circle collisions with area-proportional mass, then each chip eases back into the rain drift.
  - @newt-app/templates@0.22.11

## 0.22.10

### Patch Changes

- 6f40802: Add a gentle per-chip lateral sway to the homepage logo rain, so chips drift through the fall instead of moving in straight lines.
  - @newt-app/templates@0.22.10

## 0.22.9

### Patch Changes

- 87e961f: Port the docs homepage logo rain from SVG + d3 to a three.js WebGL scene, keeping the same look and behavior: theme-aware silhouettes, background circles, size-based opacity, and size-based speed (small chips fast, large slow).
  - @newt-app/templates@0.22.9

## 0.22.8

### Patch Changes

- fcea539: Add an MIT license. The repo gets a root `LICENSE`, and `create-newt-app` declares `"license": "MIT"` and ships the license text in its published tarball.
  - @newt-app/templates@0.22.8

## 0.22.7

### Patch Changes

- dc54874: Switch the README npm badge to the `flat-square` style.
  - @newt-app/templates@0.22.7

## 0.22.6

### Patch Changes

- 2306c2e: Align the docs homepage tagline with the README's real-backend positioning, and audit the docs for the same style: drop the "everything you want and nothing you don't" cliché from the installation page, remove em dashes (homepage badge and deployment pages), and stop calling the output "Next.js projects" when it's a full-stack Next + Nest app.
  - @newt-app/templates@0.22.6

## 0.22.5

### Patch Changes

- 0bbda52: Alphabetize the `scripts` and dependency fields in every scaffolded `package.json`. Module injection appended deps and scripts to the end, leaving generated `package.json` files out of order; a small post-scaffold pass sorts them (no new dependency).
  - @newt-app/templates@0.22.5

## 0.22.4

### Patch Changes

- f8e7da6: Replace the default Turborepo starter README with a concise newt-app README (Getting Started, Documentation, What's inside). The root `README.md` is a symlink to `packages/create-newt-app/README.md`, so the repo and the npm package share one source, mirroring how Next.js is set up.
  - @newt-app/templates@0.22.4

## 0.22.3

### Patch Changes

- 2cf08f5: Swap the Tailwind logo for the oxc logo in the docs homepage hero, and add the oxc logo to the background logo rain (alongside Tailwind).
  - @newt-app/templates@0.22.3

## 0.22.2

### Patch Changes

- f93d2a1: Point the scaffolded homepage "Learn more" links at newt-app's own resources: add a Documentation link (https://newt-app.vercel.app) and fix the placeholder GitHub link to the newt-app repo.
  - @newt-app/templates@0.22.2

## 0.22.1

### Patch Changes

- d245097: Generate a strong random `BETTER_AUTH_SECRET` (32 bytes, base64url) per scaffold instead of the `your-secret-here` placeholder, so a fresh app no longer logs Better Auth's "secret should be at least 32 characters" / low-entropy warnings.
- 2c0b4ea: Add the `db` package to the docs homepage project-structure file tree.
  - @newt-app/templates@0.22.1

## 0.22.0

### Minor Changes

- f72dab3: Add a `--linter` option to choose between ESLint + Prettier (default) and oxc (oxlint + oxfmt). Linting is now owned by the selected linter module — deps, scripts, and config files are injected rather than baked into each app — so picking `oxc` ships no ESLint or Prettier at all, and vice versa.

### Patch Changes

- @newt-app/templates@0.22.0

## 0.21.5

### Patch Changes

- c46b6f7: Fix the standalone Docker deployment to run app migrations. The `migrate` container ran only `auth migrate`, so Kysely app migrations (e.g. the `todo` table) were never applied in production. It now reuses the `build` image and runs `pnpm db:migrate` (Better Auth + Kysely), and the standalone `turbo.json` migrate task is no longer marked interactive.
  - @newt-app/templates@0.21.5

## 0.21.4

### Patch Changes

- 5adf2af: Audit the docs against the current CLI and persistence layer. The Database section and generated README now describe the scaffold-time database choice (SQLite or Postgres, one driver installed) and the shared Kysely connection; the CLI reference documents `--database`, `--nest-di-only`, and `--deployment`; the intro/installation stack and file tree include Kysely and `packages/db`; and the Vercel deployment pages note that Postgres is required (SQLite doesn't persist on serverless).
  - @newt-app/templates@0.21.4

## 0.21.3

### Patch Changes

- 44b2daa: Add the Kysely logo to the docs homepage background animation, alongside the other stack logos now that Kysely ships as the persistence layer.
  - @newt-app/templates@0.21.3

## 0.21.2

### Patch Changes

- b7730b7: Make the todos example user-scoped. The `todo` table gains a `userId` column, every query is scoped to `session.user.id`, and the controller reads the session with `@Session()` (using a type-only `import type { UserSession }` to sidestep the `isolatedModules` + decorator-metadata TS1272 error). In `--nest-di-only` mode the route handlers resolve the session with `auth.api.getSession` and return 401 when there is none. The default example now demonstrates authenticated, per-user data instead of a global list.
  - @newt-app/templates@0.21.2

## 0.21.1

### Patch Changes

- 528e2ee: Drop the redundant `pnpm db:migrate` step from the CLI "Next steps" outro. `pnpm dev` already runs migrations (via turbo's `^migrate`), and the SQLite default needs no database setup, so the happy path is just `cd <app>` then `pnpm dev`.
  - @newt-app/templates@0.21.1

## 0.21.0

### Minor Changes

- 6a6ce8a: Add a Kysely-based persistence layer. A new `packages/db` owns one database connection — SQLite or Postgres, chosen at scaffold time via the interactive prompt or the `--database` flag — that Better Auth and the app share, so only the selected driver is installed (no mixed `pg` + native `better-sqlite3` deps). Migrations are written with Kysely; scaffold and apply them with `pnpm db:make <name>` and `pnpm db:migrate`. The todo example now persists through this layer instead of in-memory state.

### Patch Changes

- @newt-app/templates@0.21.0

## 0.20.2

### Patch Changes

- f694604: Fix the Geist font falling back to the browser default in scaffolded apps. The shadcn `--font-sans` token was self-referential (`var(--font-sans)`) and `font-sans` was applied to `html` while the font variable lives on `body`; the non-shadcn `globals.css` never set `font-family` at all.
  - @newt-app/templates@0.20.2

## 0.20.1

### Patch Changes

- c6270aa: wire up sonner in the shadcn scaffold: mount the Toaster and re-export toast so toasts work out of the box
  - @newt-app/templates@0.20.1

## 0.20.0

### Minor Changes

- b160cdc: zero-config first run: auth defaults to a local sqlite database when DATABASE_URL is unset

### Patch Changes

- @newt-app/templates@0.20.0

## 0.19.3

### Patch Changes

- ca55955: remove em dashes from documentation and the scaffolded README
  - @newt-app/templates@0.19.3

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
