<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->

After making changes, run `pnpm lint:check` and fix all errors.

# Project notes

- **web** runs on port 3000.
- There is no separate backend process. API routes are Next.js route handlers that resolve NestJS providers in-process.
- Migrations live in `packages/db`. Run `pnpm db:migrate`; scaffold a new one with `pnpm db:make <name>`.
- Environment is read from the root `.env` (see `.env.example`): `DATABASE_URL`, `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`.
- NestJS controllers must validate request bodies with a schema (the api registers a global `StandardSchemaValidationPipe`); keep the todo controller as the reference for how to do it.
