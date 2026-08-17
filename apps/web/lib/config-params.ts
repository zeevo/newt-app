import { parseAsBoolean, parseAsStringLiteral } from "nuqs/server";
import { DI_ONLY_REJECTS, type Config } from "@/lib/build-command";

// Defaults mirror the panel's initial selection. nuqs clears params at their
// default, so the bare URL means this config and only changes become params.
export const configParsers = {
  shadcn: parseAsBoolean.withDefault(true),
  testing: parseAsStringLiteral(["jest", "vitest"] as const).withDefault(
    "vitest",
  ),
  database: parseAsStringLiteral(["sqlite", "postgres"] as const).withDefault(
    "postgres",
  ),
  linter: parseAsStringLiteral(["eslint", "oxc"] as const).withDefault("oxc"),
  deployment: parseAsStringLiteral([
    "none",
    "standalone",
    "custom-server",
    "spa",
  ] as const).withDefault("none"),
  mode: parseAsStringLiteral(["full", "nest-di-only"] as const).withDefault(
    "full",
  ),
  includeExample: parseAsBoolean.withDefault(false),
};

export const configUrlKeys = {
  includeExample: "include-example",
};

// A hand-edited URL can pair di-only with a deployment the CLI rejects; the
// panel never renders that combo.
export function sanitizeConfig(c: Config): Config {
  return c.mode === "nest-di-only" && DI_ONLY_REJECTS.has(c.deployment)
    ? { ...c, deployment: "none" }
    : c;
}
