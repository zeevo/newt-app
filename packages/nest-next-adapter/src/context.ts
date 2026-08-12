import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import type { DynamicModule, INestApplication, NestApplicationOptions, Type } from "@nestjs/common";

export type RootModule = Type<unknown> | DynamicModule;

export interface AdapterOptions {
  /** Prefix Nest routes so they match the route files under app/<prefix>/. Default: "api". Pass "" for none. */
  globalPrefix?: string;
  logger?: NestApplicationOptions["logger"];
  /** Runs after creation, before init. Register pipes, filters, or middleware here. */
  setup?: (app: INestApplication) => void | Promise<void>;
}

type BootCache = Map<RootModule, Promise<INestApplication>>;

// The cache must survive HMR module-graph rebuilds, so it lives on globalThis
// rather than in module scope.
const CACHE_KEY = Symbol.for("@newt-app/nest-next-adapter:apps");

function cache(): BootCache {
  const store = globalThis as { [CACHE_KEY]?: BootCache };
  return (store[CACHE_KEY] ??= new Map());
}

// Caching the promise, not the resolved app, means N concurrent cold-start
// requests all await one boot instead of leaking N-1 contexts.
export function bootApp(
  module: RootModule,
  options: AdapterOptions = {},
): Promise<INestApplication> {
  const apps = cache();
  const cached = apps.get(module);
  if (cached) return cached;

  const booting = (async () => {
    const app = await NestFactory.create(module, new ExpressAdapter(), {
      logger: options.logger ?? false,
      abortOnError: false,
    });
    const prefix = options.globalPrefix ?? "api";
    if (prefix !== "") app.setGlobalPrefix(prefix);
    app.enableShutdownHooks();
    await options.setup?.(app);
    await app.init();
    return app;
  })();

  apps.set(module, booting);
  // a failed boot must not poison the cache, or every request after a
  // transient failure returns the same rejection forever
  booting.catch(() => {
    if (apps.get(module) === booting) apps.delete(module);
  });
  return booting;
}

export async function closeApp(module: RootModule): Promise<void> {
  const apps = cache();
  const booting = apps.get(module);
  if (!booting) return;
  apps.delete(module);
  const app = await booting.catch(() => null);
  await app?.close();
}
