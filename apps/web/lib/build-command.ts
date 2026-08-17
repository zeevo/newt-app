export type Config = {
  shadcn: boolean;
  testing: "jest" | "vitest";
  database: "sqlite" | "postgres";
  linter: "eslint" | "oxc";
  deployment: "none" | "standalone" | "custom-server" | "spa";
  mode: "full" | "nest-di-only";
  includeExample: boolean;
};

// Both pairs are rejected by validateDeploymentCombo in create-newt-app, so the
// builder must not offer them — the emitted command would just error.
export const DI_ONLY_REJECTS = new Set<Config["deployment"]>([
  "spa",
  "custom-server",
]);

export const DI_ONLY_REJECTS_HINT =
  "spa and custom-server already run Nest inside Next.js, so di-only rejects them.";

export const DEPLOYMENT_HINTS: Record<
  Exclude<Config["deployment"], "none">,
  string
> = {
  standalone: 'Next.js output: "standalone", in Docker alongside Nest.',
  "custom-server": "A custom Node server runs Next.js and Nest together.",
  spa: "Next.js static export, served by Nest. No SSR.",
};

// "none" adds no deployment files, so there is nothing to describe.
export function deploymentHint(c: Config): string | null {
  const base = c.deployment === "none" ? null : DEPLOYMENT_HINTS[c.deployment];
  if (c.mode !== "nest-di-only") return base;
  return base ? `${base} ${DI_ONLY_REJECTS_HINT}` : DI_ONLY_REJECTS_HINT;
}

export const DI_ONLY_HINT =
  "Nest runs as an application context with no HTTP server, and Next.js route handlers resolve its services through inject(). The app stays a single Next.js project, so it deploys to Vercel with no extra infrastructure.";

export const EXAMPLE_APP_HINT = "Include an example to-do list feature.";

export const DATABASE_HINT =
  "SQLite writes to a local file, which is not persisted on serverless filesystems like Vercel’s. Better Auth and your app share one Kysely connection either way.";

const DEPLOYMENTS = [
  "none",
  "standalone",
  "custom-server",
  "spa",
] as const satisfies readonly Config["deployment"][];

export function deploymentOptions(
  mode: Config["mode"],
): readonly Config["deployment"][] {
  return DEPLOYMENTS.filter(
    (deployment) =>
      !(mode === "nest-di-only" && DI_ONLY_REJECTS.has(deployment)),
  );
}

export function buildCommand(c: Config): string {
  const flags: string[] = [];
  if (c.shadcn) flags.push("--shadcn");
  if (c.testing !== "jest") flags.push("--testing vitest");
  if (c.database !== "sqlite") flags.push("--database postgres");
  if (c.linter !== "eslint") flags.push("--linter oxc");
  if (c.deployment !== "none") flags.push(`--deployment ${c.deployment}`);
  if (c.mode === "nest-di-only") flags.push("--nest-di-only");
  if (c.includeExample) flags.push("--include-example");
  // Passing a config flag is what puts the CLI in non-interactive mode. Every
  // other option here matches its default, so without this the CLI would prompt
  // and shadcn would come back on — the opposite of what the panel shows.
  if (!flags.length && !c.shadcn) flags.push("--testing jest");
  return flags.length
    ? `npm create newt-app@latest my-app -- ${flags.join(" ")}`
    : "npm create newt-app@latest my-app";
}
