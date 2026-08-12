import { IncomingMessage, ServerResponse, type OutgoingHttpHeaders } from "node:http";
import { Socket } from "node:net";

type ExpressLike = (req: IncomingMessage, res: ServerResponse) => void;

function toBuffer(chunk: unknown, encoding?: string): Buffer {
  if (Buffer.isBuffer(chunk)) return chunk;
  if (typeof chunk === "string") return Buffer.from(chunk, encoding as BufferEncoding | undefined);
  return Buffer.from(chunk as Uint8Array);
}

// Dispatches a Web Request into an Express app without a listening server:
// a socketless IncomingMessage carries the request in, and write/end are
// intercepted to collect the response instead of flushing to a socket.
export async function dispatch(express: ExpressLike, request: Request): Promise<Response> {
  const url = new URL(request.url);
  const body = request.body ? Buffer.from(await request.arrayBuffer()) : null;

  const req = new IncomingMessage(new Socket());
  req.method = request.method;
  req.url = url.pathname + url.search;
  request.headers.forEach((value, key) => {
    req.headers[key.toLowerCase()] = value;
  });
  if (body) {
    req.headers["content-length"] ??= String(body.length);
    req.push(body);
  }
  req.push(null);
  // A real request flips `complete` when the message ends; without it,
  // body-parser's isFinished() guard never trips and a second parser in the
  // stack (nestjs-better-auth registers one) re-reads the drained stream and
  // throws "stream is not readable".
  req.once("end", () => {
    req.complete = true;
  });

  const res = new ServerResponse(req);
  const chunks: Buffer[] = [];

  return new Promise<Response>((resolve) => {
    const settle = () => {
      const status = res.statusCode;
      const headers = new Headers();
      Object.entries(res.getHeaders()).forEach(([key, value]) => {
        if (value === undefined) return;
        const values = Array.isArray(value) ? value : [value];
        values.forEach((v) => headers.append(key, String(v)));
      });
      const payload = Buffer.concat(chunks);
      const bodyless =
        status === 204 || status === 304 || request.method === "HEAD" || payload.length === 0;
      resolve(
        new Response(bodyless ? null : new Uint8Array(payload), {
          status,
          headers,
        }),
      );
    };

    res.write = function (chunk: unknown, encoding?: unknown, callback?: unknown): boolean {
      chunks.push(toBuffer(chunk, typeof encoding === "string" ? encoding : undefined));
      const cb = typeof encoding === "function" ? encoding : callback;
      if (typeof cb === "function") (cb as () => void)();
      return true;
    } as typeof res.write;

    res.end = function (
      this: ServerResponse,
      chunk?: unknown,
      encoding?: unknown,
      callback?: unknown,
    ) {
      if (chunk !== undefined && chunk !== null && typeof chunk !== "function")
        chunks.push(toBuffer(chunk, typeof encoding === "string" ? encoding : undefined));
      const cb = [chunk, encoding, callback].find((a) => typeof a === "function");
      settle();
      if (typeof cb === "function") (cb as () => void)();
      return this;
    } as typeof res.end;

    // writeHead stores headers in the raw header string, invisible to
    // getHeaders(), so mirror them through setHeader instead
    res.writeHead = function (
      this: ServerResponse,
      status: number,
      reasonOrHeaders?: unknown,
      maybeHeaders?: unknown,
    ) {
      res.statusCode = status;
      const extra = (typeof reasonOrHeaders === "object" ? reasonOrHeaders : maybeHeaders) as
        | OutgoingHttpHeaders
        | undefined;
      if (extra)
        Object.entries(extra).forEach(([key, value]) => {
          if (value !== undefined) res.setHeader(key, value);
        });
      return this;
    } as typeof res.writeHead;

    express(req, res);
  });
}
