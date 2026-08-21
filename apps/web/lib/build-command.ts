export type Config = {
  shadcn: boolean;
  testing: "jest" | "vitest";
  database: "sqlite" | "postgres";
  linter: "eslint" | "oxc";
  deployment: "none" | "standalone" | "custom-server" | "spa";
  nestDiOnly: boolean;
  todoExample: boolean;
  antiSlop: boolean;
};

// Both pairs are rejected by validateDeploymentCombo in create-newt-app, so the
// builder must not offer them — the emitted command would just error.
export const DI_ONLY_REJECTS = new Set<Config["deployment"]>(["spa", "custom-server"]);

export const DI_ONLY_REJECTS_HINT =
  "spa and custom-server already run Nest inside Next.js, so di-only rejects them.";

export const DEPLOYMENT_HINTS: Record<Exclude<Config["deployment"], "none">, string> = {
  standalone: 'Next.js output: "standalone", in Docker alongside Nest.',
  "custom-server": "A custom Node server runs Next.js and Nest together.",
  spa: "Next.js static export, served by Nest. No SSR.",
};

// "none" adds no deployment files, so there is nothing to describe.
export function deploymentHint(c: Config): string | null {
  const base = c.deployment === "none" ? null : DEPLOYMENT_HINTS[c.deployment];
  if (!c.nestDiOnly) return base;
  return base ? `${base} ${DI_ONLY_REJECTS_HINT}` : DI_ONLY_REJECTS_HINT;
}

export const DI_ONLY_HINT =
  "Nest runs with no HTTP server, and Next.js route handlers resolve its services through inject().";

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
  "custom-server",
  "spa",
] as const satisfies readonly Config["deployment"][];

export function deploymentOptions(nestDiOnly: boolean): readonly Config["deployment"][] {
  return DEPLOYMENTS.filter((deployment) => !(nestDiOnly && DI_ONLY_REJECTS.has(deployment)));
}

export function buildCommand(c: Config): string {
  const flags: string[] = [];
  if (c.shadcn) flags.push("--shadcn");
  if (c.testing !== "jest") flags.push("--testing vitest");
  if (c.database !== "sqlite") flags.push("--database postgres");
  if (c.linter !== "eslint") flags.push("--linter oxc");
  if (c.deployment !== "none") flags.push(`--deployment ${c.deployment}`);
  if (c.nestDiOnly) flags.push("--nest-di-only");
  if (c.todoExample) flags.push("--include-example");
  if (c.antiSlop) flags.push("--extras anti-slop");
  // Passing a config flag is what puts the CLI in non-interactive mode. Every
  // other option here matches its default, so without this the CLI would prompt
  // and shadcn would come back on — the opposite of what the panel shows.
  if (!flags.length && !c.shadcn) flags.push("--testing jest");
  return flags.length
    ? `npm create newt-app@latest my-app -- ${flags.join(" ")}`
    : "npm create newt-app@latest my-app";
}
