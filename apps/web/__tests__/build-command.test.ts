import { describe, it, expect } from "vitest";
import {
  buildCommand,
  deploymentOptions,
  IN_PROCESS_REJECTS,
  type Config,
  type NestMode,
} from "@/lib/build-command";

// every config the panel can reach — deployment comes from the same function
// that renders the select, so hiding an option here means hiding it in the UI
const reachable: Config[] = (
  ["separate", "embedded", "di-only"] as const satisfies readonly NestMode[]
).flatMap((nest) =>
  deploymentOptions(nest).flatMap((deployment) =>
    [true, false].flatMap((shadcn) =>
      [true, false].flatMap((todoExample) =>
        (["jest", "vitest"] as const).flatMap((testing) =>
          (["sqlite", "postgres"] as const).flatMap((database) =>
            (["eslint", "oxc"] as const).map((linter) => ({
              shadcn,
              testing,
              database,
              linter,
              deployment,
              nest,
              todoExample,
            })),
          ),
        ),
      ),
    ),
  ),
);

describe("buildCommand", () => {
  it("hides exactly the deployments the CLI rejects with an in-process Nest", () => {
    // Pinned against validateDeploymentCombo in packages/create-newt-app. The
    // reachable set below is derived from IN_PROCESS_REJECTS, so without this
    // the suite would happily agree with a wrong value.
    expect([...IN_PROCESS_REJECTS].sort()).toEqual(["custom-server", "spa"]);
    expect(deploymentOptions("di-only")).toEqual(["none", "standalone"]);
    expect(deploymentOptions("embedded")).toEqual(["none", "standalone"]);
    expect(deploymentOptions("separate")).toEqual(["none", "standalone", "custom-server", "spa"]);
  });

  it("never pairs an in-process Nest flag with a deployment the CLI rejects", () => {
    const invalid = reachable
      .map(buildCommand)
      .filter(
        (command) =>
          (command.includes("--nest-di-only") || command.includes("--nest-embedded")) &&
          [...IN_PROCESS_REJECTS].some((mode) => command.includes(`--deployment ${mode}`)),
      );

    expect(invalid).toEqual([]);
  });

  it("never emits both Nest flags at once", () => {
    const both = reachable
      .map(buildCommand)
      .filter(
        (command) => command.includes("--nest-di-only") && command.includes("--nest-embedded"),
      );

    expect(both).toEqual([]);
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
        shadcn: true,
        testing: "jest",
        database: "sqlite",
        linter: "eslint",
        deployment: "none",
        nest: "separate",
        todoExample: true,
      }),
    ).toBe("npm create newt-app@latest my-app -- --shadcn --include-example");
  });
});
