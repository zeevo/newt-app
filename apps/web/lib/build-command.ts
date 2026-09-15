export type Nest = "on" | "off" | "di-only";

export type Config = {
  name: string;
  shadcn: boolean;
  stylex: boolean;
  testing: "jest" | "vitest";
  database: "sqlite" | "postgres";
  linter: "eslint" | "oxc";
  deployment: "none" | "standalone" | "spa";
  nest: Nest;
  todoExample: boolean;
  antiSlop: boolean;
  agentsMd: boolean;
};

export const NEST_MODES = ["on", "off", "di-only"] as const satisfies readonly Nest[];

// Rejected by validateDeploymentCombo in create-newt-app, so the builder must
// not offer it — the emitted command would just error. spa hands a static
// export to Nest to serve, so it needs a Nest with its own HTTP server.
export const NEST_REJECTS = {
  on: new Set<Config["deployment"]>(),
  off: new Set<Config["deployment"]>(["spa"]),
  "di-only": new Set<Config["deployment"]>(["spa"]),
} satisfies Record<Nest, ReadonlySet<Config["deployment"]>>;

export const NEST_REJECTS_HINT = {
  on: "",
  off: "spa hands a static export to Nest to serve, and off ships no Nest.",
  "di-only": "spa statically exports Next.js, which cannot hold the route handlers di-only needs.",
} satisfies Record<Nest, string>;

export const DEPLOYMENT_HINTS = {
  standalone: 'Next.js output: "standalone", in Docker alongside Nest.',
  spa: "Next.js static export, served by Nest. No SSR.",
} satisfies Record<Exclude<Config["deployment"], "none">, string>;

// "none" adds no deployment files, so there is nothing to describe.
export function deploymentHint(c: Config): string | null {
  const base = c.deployment === "none" ? null : DEPLOYMENT_HINTS[c.deployment];
  if (c.nest === "on") return base;
  const rejects = NEST_REJECTS_HINT[c.nest];
  return base ? `${base} ${rejects}` : rejects;
}

export const NEST_HINTS = {
  on: undefined,
  off: "No apps/api: Next.js route handlers own the backend, and nothing scaffolds @nestjs.",
  "di-only":
    "Nest runs with no HTTP server, and Next.js route handlers resolve its services through inject().",
} satisfies Record<Nest, string | undefined>;

// The example is a Nest module either way: an @Injectable service behind a
// controller, or behind a route handler that injects it.
export function todoExampleAvailable(nest: Nest): boolean {
  return nest !== "off";
}

// Every testing config, script and dev dependency lands in apps/api.
export function testingAvailable(nest: Nest): boolean {
  return nest !== "off";
}

export const TODO_EXAMPLE_HINT = "Include an example to-do list feature.";

export const ANTI_SLOP_HINT =
  "Vendors dmmulroy/anti-slop into tools/oxlint and turns its 15 rules on as errors: no undocumented type assertions, no unknown returns, no runtime typeof narrowing.";

export function antiSlopAvailable(linter: Config["linter"]): boolean {
  return linter === "oxc";
}

export function extrasHints(c: Config): string[] {
  return [
    deploymentHint(c),
    c.todoExample ? TODO_EXAMPLE_HINT : null,
    c.antiSlop ? ANTI_SLOP_HINT : null,
  ].filter((hint) => hint !== null);
}

const DEPLOYMENTS = [
  "none",
  "standalone",
  "spa",
] as const satisfies readonly Config["deployment"][];

export function deploymentOptions(nest: Nest): readonly Config["deployment"][] {
  return DEPLOYMENTS.filter((deployment) => !NEST_REJECTS[nest].has(deployment));
}

// Pinned against normalizeProjectName in packages/create-newt-app, so the panel
// shows the name the CLI will actually scaffold under.
export function normalizeName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-._~]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-._]+/, "")
    .replace(/-+$/, "")
    .slice(0, 214);
}

export function buildCommand(c: Config): string {
  const flags: string[] = [];
  if (c.shadcn) flags.push("--shadcn");
  if (c.stylex) flags.push("--stylex");
  if (c.testing !== "jest" && testingAvailable(c.nest)) flags.push("--testing vitest");
  if (c.database !== "sqlite") flags.push("--database postgres");
  if (c.linter !== "eslint") flags.push("--linter oxc");
  if (c.deployment !== "none") flags.push(`--deployment ${c.deployment}`);
  if (c.nest !== "on") flags.push(`--nest ${c.nest}`);
  if (c.todoExample) flags.push("--include-example");
  if (c.antiSlop) flags.push("--extras anti-slop");
  if (!c.agentsMd) flags.push("--no-agents-md");
  // Passing a config flag is what puts the CLI in non-interactive mode. Every
  // other option here matches its default, so without this the CLI would prompt
  // and shadcn would come back on — the opposite of what the panel shows.
  if (!flags.length && !c.shadcn) flags.push("--testing jest");
  const name = normalizeName(c.name) || DEFAULT_NAME;
  return flags.length
    ? `npm create newt-app@latest ${name} -- ${flags.join(" ")}`
    : `npm create newt-app@latest ${name}`;
}

export const DEFAULT_NAME = "my-app";
