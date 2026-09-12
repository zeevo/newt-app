import { describe, it, expect } from "vitest";
import {
  ANTI_SLOP_HINT,
  buildCommand,
  normalizeName,
  DEPLOYMENT_HINTS,
  deploymentOptions,
  extrasHints,
  NEST_MODES,
  NEST_REJECTS,
  todoExampleAvailable,
  TODO_EXAMPLE_HINT,
  type Config,
} from "@/lib/build-command";

// the panel makes shadcn and stylex mutually exclusive, so the styling axis is
// three states, not four
const STYLING = [
  { shadcn: false, stylex: false },
  { shadcn: true, stylex: false },
  { shadcn: false, stylex: true },
] as const;

// every config the panel can reach — deployment comes from the same function
// that renders the select, so hiding an option here means hiding it in the UI
const reachable: Config[] = NEST_MODES.flatMap((nest) =>
  deploymentOptions(nest).flatMap((deployment) =>
    STYLING.flatMap(({ shadcn, stylex }) =>
      (todoExampleAvailable(nest) ? [true, false] : [false]).flatMap((todoExample) =>
        (["jest", "vitest"] as const).flatMap((testing) =>
          (["sqlite", "postgres"] as const).flatMap((database) =>
            (["eslint", "oxc"] as const).flatMap((linter) =>
              (linter === "oxc" ? [true, false] : [false]).flatMap((antiSlop) =>
                [true, false].map((agentsMd) => ({
                  name: "my-app",
                  shadcn,
                  stylex,
                  testing,
                  database,
                  linter,
                  deployment,
                  nest,
                  todoExample,
                  antiSlop,
                  agentsMd,
                })),
              ),
            ),
          ),
        ),
      ),
    ),
  ),
);

describe("buildCommand", () => {
  it("hides exactly the deployments the CLI rejects per nest mode", () => {
    // Pinned against validateDeploymentCombo in packages/create-newt-app. The
    // reachable set below is derived from NEST_REJECTS, so without this the
    // suite would happily agree with a wrong value.
    expect(NEST_MODES.map((nest) => [nest, [...NEST_REJECTS[nest]].sort()])).toEqual([
      ["on", []],
      ["off", ["spa"]],
      ["di-only", ["spa"]],
    ]);
    expect(deploymentOptions("off")).toEqual(["none", "standalone"]);
    expect(deploymentOptions("di-only")).toEqual(["none", "standalone"]);
    expect(deploymentOptions("on")).toEqual(["none", "standalone", "spa"]);
  });

  it("never pairs a nest mode with a deployment the CLI rejects", () => {
    const invalid = reachable
      .map(buildCommand)
      .filter((command) =>
        NEST_MODES.some(
          (nest) =>
            command.includes(`--nest ${nest}`) &&
            [...NEST_REJECTS[nest]].some((mode) => command.includes(`--deployment ${mode}`)),
        ),
      );

    expect(invalid).toEqual([]);
  });

  // validateExampleCombo rejects the pair: the example is a Nest module.
  it("never pairs --nest off with --include-example", () => {
    const invalid = reachable
      .map(buildCommand)
      .filter((command) => command.includes("--nest off") && command.includes("--include-example"));

    expect(invalid).toEqual([]);
  });

  it("only offers anti-slop with the linter that can run it", () => {
    const invalid = reachable
      .map(buildCommand)
      .filter((command) => command.includes("--extras anti-slop") && !command.includes("oxc"));

    expect(invalid).toEqual([]);
  });

  it("explains every extra that is switched on", () => {
    const c = reachable.find((config) => config.deployment === "spa")!;

    expect(extrasHints({ ...c, todoExample: true, antiSlop: true })).toEqual([
      DEPLOYMENT_HINTS.spa,
      TODO_EXAMPLE_HINT,
      ANTI_SLOP_HINT,
    ]);
    expect(extrasHints({ ...c, deployment: "none", todoExample: false, antiSlop: false })).toEqual(
      [],
    );
  });

  it("emits a config flag whenever shadcn is off, so the CLI stays non-interactive", () => {
    // With no flags the CLI prompts, and its interactive default turns shadcn
    // back on — the panel would be lying.
    const withoutFlags = reachable
      .filter((c) => !c.shadcn)
      .map(buildCommand)
      .filter((command) => !command.includes(" -- "));

    expect(withoutFlags).toEqual([]);
  });

  it("leaves the command bare when every option is at its interactive default", () => {
    expect(
      buildCommand({
        name: "my-app",
        shadcn: true,
        stylex: false,
        testing: "jest",
        database: "sqlite",
        linter: "eslint",
        deployment: "none",
        nest: "on",
        todoExample: true,
        antiSlop: false,
        agentsMd: true,
      }),
    ).toBe("npm create newt-app@latest my-app -- --shadcn --include-example");
  });
  it("puts the project name in the command", () => {
    const c = reachable[0]!;

    expect(buildCommand({ ...c, name: "my-thing" })).toContain("newt-app@latest my-thing");
    // an empty box should still emit a runnable command
    expect(buildCommand({ ...c, name: "   " })).toContain("newt-app@latest my-app");
  });

  it("emits the name the CLI will scaffold under", () => {
    // Pinned against normalizeProjectName in packages/create-newt-app.
    const c = reachable[0]!;

    expect(
      ["my app", "MyApp", "_foo", ".hidden", "My Cool App!"].map((name) => normalizeName(name)),
    ).toEqual(["my-app", "myapp", "foo", "hidden", "my-cool-app"]);
    expect(normalizeName("a".repeat(215))).toBe("a".repeat(214));
    expect(buildCommand({ ...c, name: "My App" })).toContain("newt-app@latest my-app");
    // nothing survives normalizing, so the panel falls back to its default
    expect(buildCommand({ ...c, name: "..." })).toContain("newt-app@latest my-app");
  });
});
