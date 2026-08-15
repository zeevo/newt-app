import type { IncomingMessage, ServerResponse } from "node:http";
import type { Abstract, INestApplication, Type } from "@nestjs/common";

export type InjectionToken<T> = Type<T> | Abstract<T> | string | symbol;

/**
 * Creates and initializes the Nest application. Call `app.init()`, never
 * `app.listen()`: Next owns the server.
 */
export type Bootstrap = () => Promise<INestApplication>;

type RequestListener = (req: IncomingMessage, res: ServerResponse) => void;

export interface Nest {
  /** Default-export this from `pages/api/[[...path]].ts`. */
  handler: (req: IncomingMessage, res: ServerResponse) => Promise<void>;
  app: () => Promise<INestApplication>;
  /** Resolve a singleton provider, for server components and server actions. */
  inject: <T>(token: InjectionToken<T>) => Promise<T>;
  /** Resolve a request- or transient-scoped provider. */
  resolve: <T>(token: InjectionToken<T>) => Promise<T>;
  close: () => Promise<void>;
}

type Cache = Map<Bootstrap, Promise<INestApplication>>;

// The cache has to survive an HMR module-graph rebuild, which module scope
// does not, so it hangs off globalThis.
const CACHE_KEY = Symbol.for("@newt-app/nest-next:apps");

function cache(): Cache {
  const store = globalThis as { [CACHE_KEY]?: Cache };
  return (store[CACHE_KEY] ??= new Map());
}

// Caching the promise rather than the resolved app is what makes N concurrent
// cold-start requests await one boot instead of leaking N-1 applications.
function boot(bootstrap: Bootstrap): Promise<INestApplication> {
  const apps = cache();
  const cached = apps.get(bootstrap);
  if (cached) return cached;

  const booting = bootstrap();
  apps.set(bootstrap, booting);
  // Evict on failure, or every request after one transient error replays the
  // same rejection for the life of the process.
  booting.catch(() => {
    if (apps.get(bootstrap) === booting) apps.delete(bootstrap);
  });
  return booting;
}

export function createNest(bootstrap: Bootstrap): Nest {
  const app = () => boot(bootstrap);

  return {
    app,

    inject: async (token) => (await app()).get(token),

    resolve: async (token) => (await app()).resolve(token),

    // Next hands a Pages Router API route the real Node req/res, so Nest's own
    // listener runs against them untouched. Nothing here inspects the request:
    // routing, guards, pipes, interceptors and filters are all Nest's.
    handler: async (req, res) => {
      const instance = (await app()).getHttpAdapter().getInstance() as RequestListener;
      instance(req, res);
    },

    close: async () => {
      const apps = cache();
      const booting = apps.get(bootstrap);
      if (!booting) return;
      apps.delete(bootstrap);
      const resolved = await booting.catch(() => null);
      await resolved?.close();
    },
  };
}
