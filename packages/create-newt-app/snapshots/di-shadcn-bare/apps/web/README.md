# my-app / web

The Next.js frontend. It runs on port 3000 in development.

```sh
pnpm dev
```

API routes are served in-process by Next.js route handlers that resolve NestJS
providers directly — there is no separate backend process.

## Scripts

- `pnpm dev` — run the dev server on port 3000
- `pnpm build` — production build
- `pnpm start` — serve the production build
- `pnpm typecheck` — type-check the app
