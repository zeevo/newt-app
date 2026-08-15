import { parseAsBoolean, parseAsStringLiteral } from "nuqs/server";
import { IN_PROCESS_REJECTS, type Config } from "@/lib/build-command";

// Defaults mirror the panel's initial selection. nuqs clears params at their
// default, so the bare URL means this config and only changes become params.
export const configParsers = {
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
  nest: parseAsStringLiteral(["separate", "embedded", "di-only"] as const).withDefault("separate"),
  todoExample: parseAsBoolean.withDefault(true),
};

export const configUrlKeys = {
  todoExample: "todo-example",
};

// A hand-edited URL can pair an in-process Nest with a deployment the CLI
// rejects; the panel never renders that combo.
export function sanitizeConfig(c: Config): Config {
  return c.nest !== "separate" && IN_PROCESS_REJECTS.has(c.deployment)
    ? { ...c, deployment: "none" }
    : c;
}
