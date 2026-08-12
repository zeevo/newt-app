import {
  Body,
  CanActivate,
  Controller,
  Delete,
  ExecutionContext,
  Get,
  HttpCode,
  Injectable,
  Module,
  NotFoundException,
  Param,
  Post,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { json } from "express";
import { createNestAdapter } from "./index";

type RequestWithHeaders = { headers: Record<string, string | undefined> };

let bootCount = 0;

@Injectable()
class CatsService {
  private readonly cats = new Map<string, { id: string; name: string }>([
    ["1", { id: "1", name: "mochi" }],
  ]);

  onModuleInit() {
    bootCount += 1;
  }

  findAll() {
    return [...this.cats.values()];
  }

  findOne(id: string) {
    const cat = this.cats.get(id);
    if (!cat) throw new NotFoundException(`no cat ${id}`);
    return cat;
  }

  create(name: string) {
    const id = String(this.cats.size + 1);
    const cat = { id, name };
    this.cats.set(id, cat);
    return cat;
  }

  remove(id: string) {
    this.cats.delete(id);
  }
}

@Injectable()
class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithHeaders>();
    if (request.headers["x-api-key"] !== "secret") throw new UnauthorizedException();
    return true;
  }
}

@Controller("cats")
class CatsController {
  constructor(private readonly cats: CatsService) {}

  @Get()
  findAll() {
    return this.cats.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.cats.findOne(id);
  }

  @UseGuards(ApiKeyGuard)
  @Post()
  create(@Body() body: { name: string }) {
    return this.cats.create(body.name);
  }

  @Delete(":id")
  @HttpCode(204)
  remove(@Param("id") id: string) {
    this.cats.remove(id);
  }
}

@Controller("dogs")
class DogsController {
  @Get()
  findAll() {
    return [];
  }
}

@Module({
  controllers: [CatsController, DogsController],
  providers: [CatsService, ApiKeyGuard],
})
class TestModule {}

const adapter = createNestAdapter(TestModule);
const cats = adapter.route(CatsController);

afterAll(() => adapter.close());

describe("route()", () => {
  it("serves a controller GET route", async () => {
    const res = await cats.GET(new Request("http://test.local/api/cats"));
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("application/json");
    expect(await res.json()).toEqual([{ id: "1", name: "mochi" }]);
  });

  it("resolves path params through Nest", async () => {
    const res = await cats.GET(new Request("http://test.local/api/cats/1"));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ id: "1", name: "mochi" });
  });

  it("maps Nest exceptions to their status codes", async () => {
    const res = await cats.GET(new Request("http://test.local/api/cats/404"));
    expect(res.status).toBe(404);
    expect(await res.json()).toMatchObject({ statusCode: 404 });
  });

  it("runs guards: rejects without the api key", async () => {
    const res = await cats.POST(
      new Request("http://test.local/api/cats", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: "biscuit" }),
      }),
    );
    expect(res.status).toBe(401);
  });

  it("parses JSON bodies and applies default Nest status codes", async () => {
    const res = await cats.POST(
      new Request("http://test.local/api/cats", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": "secret",
        },
        body: JSON.stringify({ name: "biscuit" }),
      }),
    );
    expect(res.status).toBe(201);
    expect(await res.json()).toMatchObject({ name: "biscuit" });
  });

  it("honors @HttpCode(204) with an empty body", async () => {
    const res = await cats.DELETE(
      new Request("http://test.local/api/cats/2", { method: "DELETE" }),
    );
    expect(res.status).toBe(204);
    expect(res.body).toBeNull();
  });

  it("rejects a request the controller does not own", async () => {
    const dogs = adapter.route(DogsController);
    await expect(dogs.GET(new Request("http://test.local/api/cats"))).rejects.toThrow(
      /DogsController does not handle GET \/api\/cats/,
    );
  });

  it("names the known routes in the mismatch error", async () => {
    await expect(
      cats.PATCH(new Request("http://test.local/api/cats", { method: "PATCH" })),
    ).rejects.toThrow(/GET \/api\/cats/);
  });
});

describe("inject()", () => {
  it("resolves providers outside a request", async () => {
    const service = await adapter.inject(CatsService);
    expect(service.findAll().length).toBeGreaterThan(0);
  });
});

describe("boot", () => {
  it("boots the app exactly once under concurrent first requests", async () => {
    @Module({
      controllers: [CatsController],
      providers: [CatsService, ApiKeyGuard],
    })
    class FreshModule {}
    const fresh = createNestAdapter(FreshModule);
    const route = fresh.route(CatsController);
    const before = bootCount;
    const responses = await Promise.all(
      Array.from({ length: 5 }, () => route.GET(new Request("http://test.local/api/cats"))),
    );
    responses.forEach((res) => expect(res.status).toBe(200));
    expect(bootCount).toBe(before + 1);
    await fresh.close();
  });

  it("tolerates stacked body parsers like nestjs-better-auth registers", async () => {
    @Module({
      controllers: [CatsController],
      providers: [CatsService, ApiKeyGuard],
    })
    class StackedParsersModule {}
    // wrapped in a closure so Nest cannot detect it by name and skip its own
    // parser, matching how nestjs-better-auth registers SkipBodyParsingMiddleware
    const parse = json();
    const stacked = createNestAdapter(StackedParsersModule, {
      setup: (app) => {
        app.use((req: never, res: never, next: never) => parse(req, res, next));
      },
    });
    const res = await stacked.route(CatsController).POST(
      new Request("http://test.local/api/cats", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": "secret",
        },
        body: JSON.stringify({ name: "noodle" }),
      }),
    );
    expect(res.status).toBe(201);
    expect(await res.json()).toMatchObject({ name: "noodle" });
    await stacked.close();
  });
});
