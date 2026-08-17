import { describe, it, expect } from "vitest";
import {
  buildCommand,
  deploymentOptions,
  DI_ONLY_REJECTS,
  type Config,
} from "@/lib/build-command";

// every config the panel can reach — deployment comes from the same function
// that renders the select, so hiding an option here means hiding it in the UI
const reachable: Config[] = (["full", "nest-di-only"] as const).flatMap(
  (mode) =>
    deploymentOptions(mode).flatMap((deployment) =>
      [true, false].flatMap((shadcn) =>
        [true, false].flatMap((includeExample) =>
          (["jest", "vitest"] as const).flatMap((testing) =>
            (["sqlite", "postgres"] as const).flatMap((database) =>
              (["eslint", "oxc"] as const).map((linter) => ({
                shadcn,
                testing,
                database,
                linter,
                deployment,
                mode,
                includeExample,
              })),
            ),
          ),
        ),
      ),
    ),
);

describe("buildCommand", () => {
  it("hides exactly the deployments the CLI rejects with di-only", () => {
    // Pinned against validateDeploymentCombo in packages/create-newt-app. The
    // reachable set below is derived from DI_ONLY_REJECTS, so without this the
    // suite would happily agree with a wrong value.
    expect([...DI_ONLY_REJECTS].sort()).toEqual(["custom-server", "spa"]);
    expect(deploymentOptions("nest-di-only")).toEqual(["none", "standalone"]);
  });

  it("never pairs --nest-di-only with a deployment the CLI rejects", () => {
    const invalid = reachable
      .map(buildCommand)
      .filter(
        (command) =>
          command.includes("--nest-di-only") &&
          [...DI_ONLY_REJECTS].some((deployment) =>
            command.includes(`--deployment ${deployment}`),
          ),
      );

    expect(invalid).toEqual([]);
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
        mode: "full",
        includeExample: false,
      }),
    ).toBe("npm create newt-app@latest my-app -- --shadcn");
  });
});
