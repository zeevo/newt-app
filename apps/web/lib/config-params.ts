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
  stylex: parseAsBoolean.withDefault(false),
  testing: parseAsStringLiteral(["jest", "vitest"] as const).withDefault("vitest"),
  database: parseAsStringLiteral(["sqlite", "postgres"] as const).withDefault("postgres"),
  linter: parseAsStringLiteral(["eslint", "oxc"] as const).withDefault("oxc"),
  deployment: parseAsStringLiteral(["none", "standalone", "spa"] as const).withDefault("none"),
  nest: parseAsStringLiteral(NEST_MODES).withDefault("on"),
  todoExample: parseAsBoolean.withDefault(true),
  antiSlop: parseAsBoolean.withDefault(false),
  agentsMd: parseAsBoolean.withDefault(true),
};

export const configUrlKeys = {
  todoExample: "todo-example",
  antiSlop: "anti-slop",
  agentsMd: "agents-md",
};

// A hand-edited URL can pair a nest mode with a deployment or an example the
// CLI rejects, anti-slop with eslint, or both styling systems at once; the
// panel never renders any of those combos.
export function sanitizeConfig(c: Config): Config {
  const deployment = NEST_REJECTS[c.nest].has(c.deployment) ? "none" : c.deployment;
  const todoExample = c.todoExample && todoExampleAvailable(c.nest);
  const antiSlop = c.antiSlop && antiSlopAvailable(c.linter);
  const stylex = c.stylex && !c.shadcn;
  return deployment === c.deployment &&
    todoExample === c.todoExample &&
    antiSlop === c.antiSlop &&
    stylex === c.stylex
    ? c
    : { ...c, deployment, todoExample, antiSlop, stylex };
}

// The panel's config lives in the URL, so the link to the full-page builder
// carries it rather than dropping you back to the defaults.
export const builderHref = createSerializer(configParsers, { urlKeys: configUrlKeys });
