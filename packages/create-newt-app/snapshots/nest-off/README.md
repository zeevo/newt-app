# my-app

Full-stack monorepo: Next.js 16 + better-auth + SQLite.

## Quick start

```sh
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Linting

`pnpm lint` checks without modifying files and fails on any warning; `pnpm lint:fix` applies automatic fixes.

## Apps

- **web**: Next.js frontend (port 3000)

## Packages

- **`@my-app/auth`**: better-auth config
- **`@my-app/db`**: Kysely client and migrations
- **`@my-app/ui`**: shared React components
- **`@my-app/eslint-config`**: shared ESLint config
- **`@my-app/typescript-config`**: shared tsconfig
