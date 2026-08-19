import "reflect-metadata";
import { createServer, type Server } from "node:http";
import { AddressInfo } from "node:net";
import {
  BadRequestException,
  CanActivate,
  Catch,
  Controller,
  ExceptionFilter,
  ArgumentsHost,
  Get,
  Injectable,
  MessageEvent,
  Module,
  ParseIntPipe,
  Param,
  Query,
  Sse,
  UnauthorizedException,
  UseFilters,
  UseGuards,
  VersioningType,
} from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { Observable, interval, map, take } from "rxjs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createNest, type Nest } from "./index.js";

@Injectable()
class CounterService {
  readonly id = Math.random().toString(36).slice(2);
}

@Injectable()
class TokenGuard implements CanActivate {
  canActivate(context: import("@nestjs/common").ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{
      headers: Record<string, string | undefined>;
    }>();
    if (request.headers.authorization !== "letmein") {
      throw new UnauthorizedException("nope");
    }
    return true;
  }
}

@Catch(BadRequestException)
class ShapedFilter implements ExceptionFilter {
  catch(_exception: BadRequestException, host: ArgumentsHost) {
    host
      .switchToHttp()
      .getResponse<{
        status: (code: number) => { json: (body: unknown) => void };
      }>()
      .status(422)
      .json({ shaped: true });
  }
}

@Controller()
class RootController {
  constructor(private readonly counter: CounterService) {}

  @Get("open")
  open() {
    return { id: this.counter.id };
  }

  @Get("guarded")
  @UseGuards(TokenGuard)
  guarded() {
    return { ok: true };
  }

  @Get("piped")
  @UseFilters(ShapedFilter)
  piped(@Query("n", ParseIntPipe) n: number) {
    return { n };
  }

  @Get("wild/*splat")
  wild(@Param("splat") splat: string[]) {
    return { splat };
  }

  @Sse("sse")
  sse(): Observable<MessageEvent> {
    return interval(5).pipe(
      take(2),
      map((n) => ({ data: { tick: n } }) as MessageEvent),
    );
  }
}

@Controller({ path: "ver", version: "2" })
class VersionedController {
  @Get()
  get() {
    return { version: 2 };
  }
}

@Module({
  controllers: [RootController, VersionedController],
  providers: [CounterService],
})
class TestModule {}

async function bootTestApp() {
  const app = await NestFactory.create(TestModule, { logger: false });
  app.setGlobalPrefix("api");
  app.enableVersioning({ type: VersioningType.URI });
  await app.init();
  return app;
}

const servers: Server[] = [];
const nests: Nest[] = [];

// Every test builds its own Nest so the boot cache, which is keyed on the
// bootstrap function, never leaks state across cases.
async function serve(bootstrap = bootTestApp) {
  const nest = createNest(bootstrap);
  nests.push(nest);
  const server = createServer((req, res) => void nest.handler(req, res));
  servers.push(server);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const { port } = server.address() as AddressInfo;
  return { nest, base: `http://127.0.0.1:${port}` };
}

afterEach(async () => {
  await Promise.all(nests.splice(0).map((nest) => nest.close()));
  await Promise.all(servers.splice(0).map((server) => new Promise((r) => server.close(r))));
});

describe("createNest", () => {
  it("serves a controller route through Nest", async () => {
    const { base } = await serve();
    const response = await fetch(`${base}/api/open`);

    expect(response.status).toBe(200);
    expect(await response.json()).toHaveProperty("id");
  });

  it("runs guards, so an unauthorized request never reaches the handler", async () => {
    const { base } = await serve();

    const denied = await fetch(`${base}/api/guarded`);
    expect(denied.status).toBe(401);
    expect(await denied.json()).toMatchObject({ message: "nope" });

    const allowed = await fetch(`${base}/api/guarded`, {
      headers: { authorization: "letmein" },
    });
    expect(allowed.status).toBe(200);
  });

  it("runs pipes and exception filters", async () => {
    const { base } = await serve();

    expect(await (await fetch(`${base}/api/piped?n=41`)).json()).toEqual({
      n: 41,
    });

    const shaped = await fetch(`${base}/api/piped?n=nope`);
    expect(shaped.status).toBe(422);
    expect(await shaped.json()).toEqual({ shaped: true });
  });

  // Nest owns the routing, so the two shapes that broke the PR #298 adapter
  // (its route-ownership assertion could not model either) are just routes.
  it("routes URI-versioned controllers", async () => {
    const { base } = await serve();

    expect(await (await fetch(`${base}/api/v2/ver`)).json()).toEqual({
      version: 2,
    });
    expect((await fetch(`${base}/api/ver`)).status).toBe(404);
  });

  it("routes wildcard paths", async () => {
    const { base } = await serve();

    expect(await (await fetch(`${base}/api/wild/a/b/c`)).json()).toEqual({
      splat: ["a", "b", "c"],
    });
  });

  it("streams @Sse responses instead of buffering them", async () => {
    const { base } = await serve();
    const response = await fetch(`${base}/api/sse`);

    expect(response.headers.get("content-type")).toContain("text/event-stream");

    // Reading an event off an open stream is the whole claim: a buffered
    // bridge only resolves on res.end, which never comes for an event stream.
    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let seen = "";
    while (!seen.includes('{"tick":0}')) {
      const { value, done } = await reader.read();
      expect(done).toBe(false);
      seen += decoder.decode(value);
    }
    await reader.cancel();
  });

  it("404s an unmatched path from Nest rather than throwing", async () => {
    const { base } = await serve();
    const response = await fetch(`${base}/api/__nope__`);

    expect(response.status).toBe(404);
    expect(await response.json()).toMatchObject({ statusCode: 404 });
  });

  it("boots once for concurrent cold-start requests", async () => {
    const bootstrap = vi.fn(bootTestApp);
    const { base } = await serve(bootstrap);

    const responses = await Promise.all(Array.from({ length: 8 }, () => fetch(`${base}/api/open`)));

    expect(bootstrap).toHaveBeenCalledTimes(1);
    const ids = await Promise.all(
      responses.map(async (r) => ((await r.json()) as { id: string }).id),
    );
    expect(new Set(ids).size).toBe(1);
  });

  it("retries after a failed boot instead of replaying the rejection", async () => {
    const bootstrap = vi.fn<() => Promise<never>>().mockRejectedValueOnce(new Error("boom"));
    const nest = createNest(bootstrap as never);
    nests.push(nest);

    await expect(nest.app()).rejects.toThrow("boom");

    bootstrap.mockImplementation(bootTestApp as never);
    await expect(nest.app()).resolves.toBeDefined();
    expect(bootstrap).toHaveBeenCalledTimes(2);
  });

  it("injects the same singleton the controller received", async () => {
    const { nest, base } = await serve();

    const fromRoute = (
      (await (await fetch(`${base}/api/open`)).json()) as {
        id: string;
      }
    ).id;
    const injected = await nest.inject(CounterService);

    expect(injected.id).toBe(fromRoute);
  });
});
