# @newt-app/nest-next-adapter

Run NestJS controllers inside Next.js route handlers. No second server, no proxy: the full Nest pipeline (routing, guards, pipes, interceptors, exception filters) runs in-process, dispatched from App Router route files.

## Usage

Bind the root module once:

```ts
// lib/nest.ts
import { createNestAdapter } from "@newt-app/nest-next-adapter";
import { AppModule } from "@my-app/api";

export const { route, inject, getContext } = createNestAdapter(AppModule);
```

Bind a controller per route file:

```ts
// app/api/todos/route.ts
import { route } from "@/lib/nest";
import { TodosController } from "@my-app/api";

export const { GET, POST } = route(TodosController);
```

The file's location must match the controller's `@Controller()` path (plus the `api` global prefix). A mismatch throws an error naming both paths instead of silently routing elsewhere.

`inject(Token)` resolves providers outside a request, for server components and server actions. `resolve(Token)` does the same for request- and transient-scoped providers.

## Options

```ts
createNestAdapter(AppModule, {
  globalPrefix: "api",
  logger: false,
  setup: (app) => {},
});
```

- `globalPrefix` prefixes Nest routes so they match files under `app/<prefix>/`. Pass `''` for none.
- `setup` runs after creation and before init: register pipes, filters, or middleware.

## How it works

The app boots once per process via `NestFactory.create` with the Express adapter and `app.init()`, never `listen()`. The boot promise is cached on `globalThis`, so concurrent cold-start requests share one boot and HMR does not leak contexts. Each request is bridged from a Web `Request` into Express and back.

v1 handles JSON, text, and form bodies with buffered responses. Streaming, SSE, and multipart are out of scope.
