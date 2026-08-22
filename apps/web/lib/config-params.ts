import { createSerializer, parseAsBoolean, parseAsString, parseAsStringLiteral } from "nuqs/server";
import { antiSlopAvailable, DEFAULT_NAME, DI_ONLY_REJECTS, type Config } from "@/lib/build-command";

// Defaults mirror the panel's initial selection. nuqs clears params at their
// default, so the bare URL means this config and only changes become params.
export const configParsers = {
  name: parseAsString.withDefault(DEFAULT_NAME),
  shadcn: parseAsBoolean.withDefault(true),
  testing: parseAsStringLiteral(["jest", "vitest"] as const).withDefault("vitest"),
  database: parseAsStringLiteral(["sqlite", "postgres"] as const).withDefault("postgres"),
  linter: parseAsStringLiteral(["eslint", "oxc"] as const).withDefault("oxc"),
  deployment: parseAsStringLiteral([
    "none",
    "standalone",
    "custom-server",
    "spa",
  ] as const).withDefault("none"),
  nestDiOnly: parseAsBoolean.withDefault(false),
  todoExample: parseAsBoolean.withDefault(true),
  antiSlop: parseAsBoolean.withDefault(false),
};

export const configUrlKeys = {
  nestDiOnly: "nest-di-only",
  todoExample: "todo-example",
  antiSlop: "anti-slop",
};

// A hand-edited URL can pair di-only with a deployment the CLI rejects, or
// anti-slop with eslint; the panel never renders either combo.
export function sanitizeConfig(c: Config): Config {
  const deployment = c.nestDiOnly && DI_ONLY_REJECTS.has(c.deployment) ? "none" : c.deployment;
  const antiSlop = c.antiSlop && antiSlopAvailable(c.linter);
  return deployment === c.deployment && antiSlop === c.antiSlop
    ? c
    : { ...c, deployment, antiSlop };
}

// The panel's config lives in the URL, so the link to the full-page builder
// carries it rather than dropping you back to the defaults.
export const builderHref = createSerializer(configParsers, { urlKeys: configUrlKeys });
