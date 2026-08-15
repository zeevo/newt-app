# @newt-app/nest-next

Run a full NestJS HTTP application inside Next.js. No second server, no proxy.

A Pages Router API route receives Next's real Node `req`/`res`, so Nest's own request listener runs against them untouched. Nothing is translated or reinterpreted, which is why guards, middleware, pipes, interceptors, exception filters, custom decorators, versioning, SSE, streaming, file uploads, and `@Res()` passthrough all behave exactly as they do on a standalone Nest server.

## Usage

You own the bootstrap, so every Nest configuration API is available. Call `init()`, never `listen()`: Next owns the server.

```ts
// lib/nest.ts
import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { createNest } from "@newt-app/nest-next";
import { AppModule } from "@my-app/api";

export const nest = createNest(async () => {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
    logger: false,
  });
  app.setGlobalPrefix("api");
  await app.init();
  return app;
});
```

```ts
// pages/api/[[...path]].ts
import { nest } from "@/lib/nest";

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default nest.handler;
```

That is the whole integration. Every request under `/api` goes to Nest, and Nest's router decides what handles it.

`config` has to be written out in the route file: Next statically analyzes it and will not follow a re-export. `bodyParser: false` on both sides hands Nest the unread request stream, which is what Nest's own parsers and libraries like better-auth expect.

## Reaching Nest outside a request

Server components and server actions can resolve providers directly, with no HTTP hop:

```ts
import { nest } from "@/lib/nest";
import { TodosService } from "@my-app/api";

const todos = await nest.inject(TodosService);
```

`inject()` resolves singletons. `resolve()` does the same for request- and transient-scoped providers.

## API

```ts
createNest(bootstrap: () => Promise<INestApplication>): {
  handler: (req: IncomingMessage, res: ServerResponse) => Promise<void>;
  app: () => Promise<INestApplication>;
  inject: <T>(token: InjectionToken<T>) => Promise<T>;
  resolve: <T>(token: InjectionToken<T>) => Promise<T>;
  close: () => Promise<void>;
}
```

The application boots once per process. The boot promise (not the resolved app) is cached on `globalThis`, so concurrent cold-start requests share one boot rather than leaking one application each, and an HMR module-graph rebuild does not start a second one. A failed boot is evicted so the next request retries instead of replaying the rejection.

## Limits

WebSocket gateways and microservice transports need access to the server's `upgrade` event and to connections Next does not own, so they cannot run here. Use a custom Node server for those.
