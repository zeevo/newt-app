import { RequestMethod, type Type } from "@nestjs/common";
import { PATH_METADATA, METHOD_METADATA } from "@nestjs/common/constants";
import { bootApp, type AdapterOptions, type RootModule } from "./context";
import { dispatch } from "./bridge";

export type NextRouteContext = {
  params?: Promise<Record<string, string | string[]>>;
};

export type NextRouteHandler = (request: Request, context?: NextRouteContext) => Promise<Response>;

export type RouteHandlers = {
  GET: NextRouteHandler;
  POST: NextRouteHandler;
  PUT: NextRouteHandler;
  PATCH: NextRouteHandler;
  DELETE: NextRouteHandler;
  HEAD: NextRouteHandler;
  OPTIONS: NextRouteHandler;
};

const HTTP_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"] as const;

type ControllerRoute = { method: string; path: string; pattern: RegExp };

function joinPath(...segments: (string | undefined)[]): string {
  const joined = segments
    .filter((s): s is string => s !== undefined && s !== "")
    .map((s) => s.replace(/^\/+|\/+$/g, ""))
    .filter((s) => s !== "")
    .join("/");
  return `/${joined}`;
}

function toPattern(path: string): RegExp {
  const source = path
    .split("/")
    .map((segment) =>
      segment.startsWith(":") ? "[^/]+" : segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    )
    .join("/");
  return new RegExp(`^${source}/?$`);
}

// The routes a controller owns, derived from the same decorator metadata
// Nest's router uses.
function controllerRoutes(controller: Type<unknown>, globalPrefix: string): ControllerRoute[] {
  const prefix: string | string[] = Reflect.getMetadata(PATH_METADATA, controller) ?? "/";
  const prefixes = Array.isArray(prefix) ? prefix : [prefix];
  const proto = controller.prototype as Record<string, unknown>;
  return Object.getOwnPropertyNames(controller.prototype)
    .filter((name) => name !== "constructor")
    .flatMap((name) => {
      const handler = proto[name];
      if (typeof handler !== "function") return [];
      const methodPath: string | string[] | undefined = Reflect.getMetadata(PATH_METADATA, handler);
      const method: number | undefined = Reflect.getMetadata(METHOD_METADATA, handler);
      if (methodPath === undefined || method === undefined) return [];
      const methodPaths = Array.isArray(methodPath) ? methodPath : [methodPath];
      const methodName = RequestMethod[method] ?? "ALL";
      return prefixes.flatMap((p) =>
        methodPaths.map((mp) => {
          const path = joinPath(globalPrefix, p, mp);
          return { method: methodName, path, pattern: toPattern(path) };
        }),
      );
    });
}

export function makeRoute(
  module: RootModule,
  controller: Type<unknown>,
  options: AdapterOptions = {},
): RouteHandlers {
  const routes = controllerRoutes(controller, options.globalPrefix ?? "api");

  const handlerFor =
    (httpMethod: string): NextRouteHandler =>
    async (request) => {
      const { pathname } = new URL(request.url);
      const owned = routes.some(
        (route) =>
          (route.method === httpMethod || route.method === "ALL") && route.pattern.test(pathname),
      );
      if (!owned) {
        const known = routes.length
          ? routes.map((r) => `${r.method} ${r.path}`).join(", ")
          : "(none)";
        throw new Error(
          `${controller.name} does not handle ${httpMethod} ${pathname}. ` +
            `Its routes are: ${known}. ` +
            `Either the route file's location does not match the controller's ` +
            `@Controller() path, or the controller has no ${httpMethod} handler there.`,
        );
      }
      const app = await bootApp(module, options);
      const express = app.getHttpAdapter().getInstance() as Parameters<typeof dispatch>[0];
      return dispatch(express, request);
    };

  return Object.fromEntries(
    HTTP_METHODS.map((method) => [method, handlerFor(method)]),
  ) as RouteHandlers;
}
