---
"create-newt-app": patch
---

make the strict lint reachable, and fix the jest regex escapes it caught

eslint apps generated `lint:check` scripts with `--max-warnings 0`, but no root script or turbo task could reach them, so `pnpm lint` auto-fixed and tolerated warnings with nothing stricter to run. The root now has `lint:check` for both linters, and `apps/api` gets `--max-warnings 0` like the others.

Running it surfaced a real bug: `jest.config.ts` under-escaped its regexes, so `testRegex` emitted `.*.spec.ts$` — a wildcard where a literal dot was meant.
