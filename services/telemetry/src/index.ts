// Ingest for create-newt-app run telemetry. Deployed separately from the
// monorepo with `wrangler deploy`; nothing here is published to npm.
//
// The endpoint is unauthenticated and always will be: the CLI is public, so any
// shared secret is one `npm pack` away from being extracted. The defence is
// therefore cheap validation, a hard size cap, bounded cardinality on every
// column, and a rate limiting rule in front of the Worker.

type Env = { DB: D1Database };

// Larger than any honest payload by an order of magnitude, small enough that a
// flood cannot make us read megabytes before rejecting.
const MAX_BODY_BYTES = 4 * 1024;

// Every field below is a closed set. An open one would let anyone write
// unlimited distinct values into a column we GROUP BY, which is the real abuse
// risk here -- unbounded cardinality costs far more than request volume.
const ENUMS = {
  platform: [
    "aix",
    "android",
    "cygwin",
    "darwin",
    "freebsd",
    "haiku",
    "linux",
    "netbsd",
    "openbsd",
    "sunos",
    "win32",
  ],
  mode: ["interactive", "flags"],
  testing: ["jest", "vitest"],
  database: ["sqlite", "postgres"],
  linter: ["eslint", "oxc"],
  deployment: ["none", "standalone", "spa"],
  ci: [
    "none",
    "unknown",
    "github-actions",
    "gitlab-ci",
    "circleci",
    "travis",
    "buildkite",
    "jenkins",
    "teamcity",
    "codebuild",
    "vercel",
    "netlify",
  ],
} as const;

const KNOWN_FLAGS = [
  "--shadcn",
  "--testing",
  "--database",
  "--linter",
  "--deployment",
  "--nest-di-only",
  "--include-example",
  "--extras",
];

// The two fields a client can put arbitrary text in. Both collapse to "other"
// rather than being rejected, so a malformed version still counts as a run.
function normalizeCliVersion(value: unknown): string {
  const text = String(value);
  return /^\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(text) ? text : "other";
}

function normalizeNodeMajor(value: unknown): string {
  const match = /^v(\d{1,3})$/.exec(String(value));
  if (!match) return "other";
  const major = Number(match[1]);
  return major >= 18 && major <= 40 ? `v${major}` : "other";
}

// Bounded at 2^8 combinations because the set of flags is fixed. Anything
// outside the known list is dropped rather than stored.
function normalizeExplicitFlags(value: unknown): string | null {
  if (value === "") return "";
  if (!KNOWN_FLAGS.includes(String(value).split(",")[0] ?? "")) return null;
  const parts = String(value).split(",");
  if (parts.length > KNOWN_FLAGS.length) return null;
  if (!parts.every((part) => KNOWN_FLAGS.includes(part))) return null;
  return [...new Set(parts)].sort().join(",");
}

function enumValue<K extends keyof typeof ENUMS>(key: K, value: unknown): string | null {
  const allowed: readonly unknown[] = ENUMS[key];
  // SAFETY: membership in a closed list of string literals is the check, so a
  // value that passes it is one of those strings.
  return allowed.includes(value) ? (value as string) : null;
}

// Only real JSON booleans count. 0, "true" and null are rejected rather than
// coerced, so a wrong type fails the row instead of silently becoming false.
function bool(value: unknown): number | null {
  return value === true ? 1 : value === false ? 0 : null;
}

type Row = {
  ts: number;
  cli_version: string;
  node_major: string;
  platform: string;
  mode: string;
  ci: string;
  explicit_flags: string;
  shadcn: number;
  testing: string;
  database: string;
  linter: string;
  deployment: string;
  nest_di_only: number;
  todo_example: number;
  anti_slop: number;
};

function parse(body: unknown, now: number): Row | null {
  if (typeof body !== "object" || body === null) return null;
  // SAFETY: JSON.parse produced this and the check above rules out null and
  // every primitive, so property access is defined. Each field is validated
  // individually below; nothing here is trusted beyond being indexable.
  const b = body as Record<string, unknown>;

  const row = {
    ts: now,
    cli_version: normalizeCliVersion(b.cliVersion),
    node_major: normalizeNodeMajor(b.nodeMajor),
    platform: enumValue("platform", b.platform),
    mode: enumValue("mode", b.mode),
    ci: enumValue("ci", b.ci),
    explicit_flags: normalizeExplicitFlags(b.explicitFlags),
    shadcn: bool(b.shadcn),
    testing: enumValue("testing", b.testing),
    database: enumValue("database", b.database),
    linter: enumValue("linter", b.linter),
    deployment: enumValue("deployment", b.deployment),
    nest_di_only: bool(b.nestDiOnly),
    todo_example: bool(b.todoExample),
    anti_slop: bool(b.antiSlop),
  };

  // SAFETY: every field above is typed `T | null`, and this rejects the row
  // unless all of them are non-null, which is exactly Row.
  return Object.values(row).every((value) => value !== null) ? (row as Row) : null;
}

const INSERT = `INSERT INTO runs (
  ts, cli_version, node_major, platform, mode, ci, explicit_flags,
  shadcn, testing, database, linter, deployment, nest_di_only, todo_example, anti_slop
) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

    // content-length is attacker controlled, so it is a cheap early reject
    // rather than the actual check.
    const declared = Number(request.headers.get("content-length"));
    if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) {
      return new Response("Payload Too Large", { status: 413 });
    }

    let body: unknown;
    try {
      const raw = await request.text();
      if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) {
        return new Response("Payload Too Large", { status: 413 });
      }
      body = JSON.parse(raw);
    } catch {
      return new Response("Bad Request", { status: 400 });
    }

    const row = parse(body, Math.floor(Date.now() / 1000));
    if (!row) return new Response("Bad Request", { status: 400 });

    // The client IP is visible here and is deliberately not stored. Without it
    // there is no identifier of any kind on a row, which is what lets this be
    // described as anonymous without qualification.
    try {
      await env.DB.prepare(INSERT)
        .bind(...Object.values(row))
        .run();
    } catch {
      return new Response("Internal Server Error", { status: 500 });
    }

    return new Response("ok");
  },
};
