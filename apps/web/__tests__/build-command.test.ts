import { describe, it, expect } from "vitest";
import {
  ANTI_SLOP_HINT,
  buildCommand,
  nameError,
  DEPLOYMENT_HINTS,
  deploymentOptions,
  DI_ONLY_REJECTS,
  extrasHints,
  TODO_EXAMPLE_HINT,
  type Config,
} from "@/lib/build-command";

// every config the panel can reach — deployment comes from the same function
// that renders the select, so hiding an option here means hiding it in the UI
const reachable: Config[] = [true, false].flatMap((nestDiOnly) =>
  deploymentOptions(nestDiOnly).flatMap((deployment) =>
    [true, false].flatMap((shadcn) =>
      [true, false].flatMap((todoExample) =>
        (["jest", "vitest"] as const).flatMap((testing) =>
          (["sqlite", "postgres"] as const).flatMap((database) =>
            (["eslint", "oxc"] as const).flatMap((linter) =>
              (linter === "oxc" ? [true, false] : [false]).map((antiSlop) => ({
                name: "my-app",
                shadcn,
                testing,
                database,
                linter,
                deployment,
                nestDiOnly,
                todoExample,
                antiSlop,
              })),
            ),
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
    expect([...DI_ONLY_REJECTS].sort()).toEqual(["spa"]);
    expect(deploymentOptions(true)).toEqual(["none", "standalone"]);
  });

  it("never pairs --nest-di-only with a deployment the CLI rejects", () => {
    const invalid = reachable
      .map(buildCommand)
      .filter(
        (command) =>
          command.includes("--nest-di-only") &&
          [...DI_ONLY_REJECTS].some((mode) => command.includes(`--deployment ${mode}`)),
      );

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
        testing: "jest",
        database: "sqlite",
        linter: "eslint",
        deployment: "none",
        nestDiOnly: false,
        todoExample: true,
        antiSlop: false,
      }),
    ).toBe("npm create newt-app@latest my-app -- --shadcn --include-example");
  });
  it("puts the project name in the command", () => {
    const c = reachable[0]!;

    expect(buildCommand({ ...c, name: "my-thing" })).toContain("newt-app@latest my-thing");
    // an empty box should still emit a runnable command
    expect(buildCommand({ ...c, name: "   " })).toContain("newt-app@latest my-app");
  });

  it("flags names the CLI would reject", () => {
    // Pinned against validateProjectName in packages/create-newt-app.
    expect(nameError("my-app")).toBeNull();
    expect(nameError("")).toBeNull();
    expect(nameError("my/app")).toContain("can only contain");
    expect(nameError("a".repeat(215))).toContain("214");
    expect(nameError("MyApp")).toBe("Project name must be lowercase. Try: myapp");
    expect(nameError("my app")).toBe("Project name cannot contain spaces. Try: my-app");
    expect(["_foo", ".hidden"].map((name) => nameError(name) !== null)).toEqual([true, true]);
  });
});
