# my-app / web

The Next.js frontend. It runs on port 3000 in development.

```sh
pnpm dev
```

In development, requests to `/api/*` are rewritten to the NestJS backend at
`http://localhost:3001` (see `next.config.js`). Run the backend with `pnpm dev`
from the repo root.

## Scripts

- `pnpm dev` — run the dev server on port 3000
- `pnpm build` — production build
- `pnpm start` — serve the production build
- `pnpm typecheck` — type-check the app
