import type { Abstract, INestApplication, Type } from "@nestjs/common";
import { bootApp, closeApp, type AdapterOptions, type RootModule } from "./context";
import { makeRoute, type RouteHandlers } from "./route";

export type InjectionToken<T> = Type<T> | Abstract<T> | string | symbol;

export interface NestAdapter {
  /** Bind a controller to a route file: `export const { GET, POST } = route(TodosController)` */
  route: (controller: Type<unknown>) => RouteHandlers;
  /** Resolve a singleton provider, for RSCs and server actions. */
  inject: <T>(token: InjectionToken<T>) => Promise<T>;
  /** Resolve a request- or transient-scoped provider. */
  resolve: <T>(token: InjectionToken<T>) => Promise<T>;
  getContext: () => Promise<INestApplication>;
  close: () => Promise<void>;
}

export function createNestAdapter(module: RootModule, options: AdapterOptions = {}): NestAdapter {
  return {
    route: (controller) => makeRoute(module, controller, options),
    inject: async (token) => (await bootApp(module, options)).get(token),
    resolve: async (token) => (await bootApp(module, options)).resolve(token),
    getContext: () => bootApp(module, options),
    close: () => closeApp(module),
  };
}
