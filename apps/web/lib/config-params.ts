import { createSerializer, parseAsBoolean, parseAsString, parseAsStringLiteral } from "nuqs/server";
import {
  antiSlopAvailable,
  DEFAULT_NAME,
  NEST_MODES,
  NEST_REJECTS,
  todoExampleAvailable,
  type Config,
} from "@/lib/build-command";

// Defaults mirror the panel's initial selection. nuqs clears params at their
// default, so the bare URL means this config and only changes become params.
export const configParsers = {
  name: parseAsString.withDefault(DEFAULT_NAME),
  shadcn: parseAsBoolean.withDefault(true),
  testing: parseAsStringLiteral(["jest", "vitest"] as const).withDefault("vitest"),
  database: parseAsStringLiteral(["sqlite", "postgres"] as const).withDefault("postgres"),
  linter: parseAsStringLiteral(["eslint", "oxc"] as const).withDefault("oxc"),
  deployment: parseAsStringLiteral(["none", "standalone", "spa"] as const).withDefault("none"),
  nest: parseAsStringLiteral(NEST_MODES).withDefault("on"),
  todoExample: parseAsBoolean.withDefault(true),
  antiSlop: parseAsBoolean.withDefault(false),
};

export const configUrlKeys = {
  todoExample: "todo-example",
  antiSlop: "anti-slop",
};

// A hand-edited URL can pair a nest mode with a deployment or an example the
// CLI rejects, or anti-slop with eslint; the panel never renders those combos.
export function sanitizeConfig(c: Config): Config {
  const deployment = NEST_REJECTS[c.nest].has(c.deployment) ? "none" : c.deployment;
  const todoExample = c.todoExample && todoExampleAvailable(c.nest);
  const antiSlop = c.antiSlop && antiSlopAvailable(c.linter);
  return deployment === c.deployment && todoExample === c.todoExample && antiSlop === c.antiSlop
    ? c
    : { ...c, deployment, todoExample, antiSlop };
}

// The panel's config lives in the URL, so the link to the full-page builder
// carries it rather than dropping you back to the defaults.
export const builderHref = createSerializer(configParsers, { urlKeys: configUrlKeys });
