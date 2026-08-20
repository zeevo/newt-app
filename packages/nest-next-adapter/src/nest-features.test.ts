import {
  ArgumentsHost,
  BadRequestException,
  CallHandler,
  CanActivate,
  Catch,
  Controller,
  createParamDecorator,
  ExceptionFilter,
  ExecutionContext,
  Get,
  Header,
  HttpStatus,
  Inject,
  Injectable,
  MiddlewareConsumer,
  Module,
  NestInterceptor,
  NestModule,
  Param,
  ParseIntPipe,
  PipeTransform,
  Post,
  Query,
  Redirect,
  SetMetadata,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { APP_INTERCEPTOR, Reflector } from "@nestjs/core";
import { map, type Observable } from "rxjs";
import { createNestAdapter } from "./index";

type Req = Record<string, unknown> & {
  headers: Record<string, string | undefined>;
};
type Res = { setHeader: (name: string, value: string) => void };

const Roles = (...roles: string[]) => SetMetadata("roles", roles);

const RequestHeader = createParamDecorator(
  (name: string, ctx: ExecutionContext) => ctx.switchToHttp().getRequest<Req>().headers[name],
);

@Injectable()
class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.get<string[]>("roles", context.getHandler());
    if (!required) return true;
    const role = context.switchToHttp().getRequest<Req>().headers["x-role"];
    return typeof role === "string" && required.includes(role);
  }
}

@Injectable()
class GlobalHeaderInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    context.switchToHttp().getResponse<Res>().setHeader("x-global", "seen");
    return next.handle();
  }
}

@Injectable()
class WrapInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(map((data) => ({ data, wrapped: true })));
  }
}

class TeapotError extends Error {}

@Catch(TeapotError)
class TeapotFilter implements ExceptionFilter {
  catch(_exception: TeapotError, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<{
      status: (code: number) => { json: (b: unknown) => void };
    }>();
    res.status(HttpStatus.I_AM_A_TEAPOT).json({ short: "and stout" });
  }
}

@Injectable()
class UppercasePipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (typeof value !== "string" || value.length === 0)
      throw new BadRequestException("name required");
    return value.toUpperCase();
  }
}

@Controller("features")
class FeaturesController {
  constructor(@Inject("GREETING") private readonly greeting: string) {}

  @Get("query")
  query(@Query("limit", ParseIntPipe) limit: number) {
    return { limit, type: typeof limit };
  }

  @Get("param/:id")
  param(@Param("id", ParseIntPipe) id: number) {
    return { id, doubled: id * 2 };
  }

  @Get("custom-decorator")
  customDecorator(@RequestHeader("x-custom") value: string | undefined) {
    return { value: value ?? null };
  }

  @UseGuards(RolesGuard)
  @Roles("admin")
  @Get("admin")
  admin() {
    return { secret: true };
  }

  @UseInterceptors(WrapInterceptor)
  @Get("wrapped")
  wrapped() {
    return { inner: 1 };
  }

  @UseFilters(TeapotFilter)
  @Get("teapot")
  teapot() {
    throw new TeapotError();
  }

  @Post("pipe")
  pipe(@Query("name", UppercasePipe) name: string) {
    return { name };
  }

  @Header("x-static-header", "always")
  @Get("static-header")
  staticHeader() {
    return { ok: true };
  }

  @Redirect("https://example.com/next", 302)
  @Get("redirect")
  redirect() {}

  @Get("middleware")
  middleware(@RequestHeader("x-middleware") stamp: string | undefined) {
    return { stamp: stamp ?? null };
  }

  @Get("factory")
  factory() {
    return { greeting: this.greeting };
  }
}

@Module({
  controllers: [FeaturesController],
  providers: [
    RolesGuard,
    UppercasePipe,
    { provide: "GREETING", useFactory: () => "from a factory provider" },
    { provide: APP_INTERCEPTOR, useClass: GlobalHeaderInterceptor },
  ],
})
class FeaturesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req: Req, _res: unknown, next: () => void) => {
        req.headers["x-middleware"] = "stamped";
        next();
      })
      .forRoutes("*");
  }
}

const adapter = createNestAdapter(FeaturesModule);
const features = adapter.route(FeaturesController);
const url = (path: string) => `http://test.local/api/features/${path}`;

afterAll(() => adapter.close());

describe("pipes", () => {
  it("ParseIntPipe converts query params", async () => {
    const res = await features.GET(new Request(url("query?limit=5")));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ limit: 5, type: "number" });
  });

  it("ParseIntPipe rejects a bad value with 400", async () => {
    const res = await features.GET(new Request(url("query?limit=nope")));
    expect(res.status).toBe(400);
  });

  it("ParseIntPipe converts path params", async () => {
    const res = await features.GET(new Request(url("param/21")));
    expect(await res.json()).toEqual({ id: 21, doubled: 42 });
  });

  it("custom pipes transform and reject", async () => {
    const ok = await features.POST(new Request(url("pipe?name=mochi"), { method: "POST" }));
    expect(await ok.json()).toEqual({ name: "MOCHI" });
    const bad = await features.POST(new Request(url("pipe"), { method: "POST" }));
    expect(bad.status).toBe(400);
  });
});

describe("decorators", () => {
  it("createParamDecorator reads the bridged request", async () => {
    const res = await features.GET(
      new Request(url("custom-decorator"), {
        headers: { "x-custom": "made it through" },
      }),
    );
    expect(await res.json()).toEqual({ value: "made it through" });
  });

  it("@Header sets a static response header", async () => {
    const res = await features.GET(new Request(url("static-header")));
    expect(res.headers.get("x-static-header")).toBe("always");
  });

  it("@Redirect produces a 302 with a location header", async () => {
    const res = await features.GET(new Request(url("redirect")));
    expect(res.status).toBe(302);
    expect(res.headers.get("location")).toBe("https://example.com/next");
  });
});

describe("guards with metadata", () => {
  it("Reflector-driven guard rejects a missing role", async () => {
    const res = await features.GET(new Request(url("admin")));
    expect(res.status).toBe(403);
  });

  it("and admits the required role", async () => {
    const res = await features.GET(new Request(url("admin"), { headers: { "x-role": "admin" } }));
    expect(await res.json()).toEqual({ secret: true });
  });
});

describe("interceptors", () => {
  it("route interceptors transform the response body", async () => {
    const res = await features.GET(new Request(url("wrapped")));
    expect(await res.json()).toEqual({ data: { inner: 1 }, wrapped: true });
  });

  it("APP_INTERCEPTOR runs on every route and can set headers", async () => {
    const res = await features.GET(new Request(url("query?limit=1")));
    expect(res.headers.get("x-global")).toBe("seen");
  });
});

describe("exception filters", () => {
  it("@Catch filters map custom errors", async () => {
    const res = await features.GET(new Request(url("teapot")));
    expect(res.status).toBe(418);
    expect(await res.json()).toEqual({ short: "and stout" });
  });
});

describe("middleware and providers", () => {
  it("module middleware runs before handlers", async () => {
    const res = await features.GET(new Request(url("middleware")));
    expect(await res.json()).toEqual({ stamp: "stamped" });
  });

  it("factory providers resolve into controllers", async () => {
    const res = await features.GET(new Request(url("factory")));
    expect(await res.json()).toEqual({ greeting: "from a factory provider" });
  });
});
