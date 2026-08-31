import { describe, expect, it } from "vitest";
import { buildPayload, detectCi, isEnabled, isOptedOut, nodeMajor } from "./telemetry";
import type { ModuleSelection } from "./templates";

const selection: ModuleSelection = {
  deployment: "standalone",
  nestDiOnly: false,
  todoExample: true,
  shadcn: true,
  database: "postgres",
  linter: "oxc",
  testing: "vitest",
  extras: ["anti-slop"],
};

const OPT_OUT_CASES: [NodeJS.ProcessEnv, boolean][] = [
  [{ DO_NOT_TRACK: "1" }, true],
  [{ DO_NOT_TRACK: "true" }, true],
  [{ DO_NOT_TRACK: "TRUE" }, true],
  [{ DO_NOT_TRACK: "0" }, false],
  [{ NEWT_TELEMETRY_DISABLED: "1" }, true],
  [{ NEWT_TELEMETRY: "0" }, true],
  [{ NEWT_TELEMETRY: "1" }, false],
  [{}, false],
];

describe("opt out", () => {
  it.each(OPT_OUT_CASES)("%o -> optedOut=%s", (env, expected) => {
    expect(isOptedOut(env)).toBe(expected);
  });

  it("lets DO_NOT_TRACK win over NEWT_TELEMETRY=1", () => {
    const env: NodeJS.ProcessEnv = { DO_NOT_TRACK: "1", NEWT_TELEMETRY: "1" };
    expect(isOptedOut(env)).toBe(true);
  });
});

describe("no endpoint means no telemetry", () => {
  it("is disabled even with every switch set to on", () => {
    const env: NodeJS.ProcessEnv = { NEWT_TELEMETRY: "1" };
    expect(isEnabled(env)).toBe(false);
  });
});

const CI_CASES: [NodeJS.ProcessEnv, string][] = [
  [{ GITHUB_ACTIONS: "true" }, "github-actions"],
  [{ GITLAB_CI: "true" }, "gitlab-ci"],
  [{ BUILDKITE: "true" }, "buildkite"],
  // A provider we do not name still has to be distinguishable from a laptop,
  // or this repo's own scaffold matrix would look like real usage.
  [{ CI: "true" }, "unknown"],
  [{}, "none"],
];

describe("CI detection", () => {
  it.each(CI_CASES)("%o -> %s", (env, expected) => {
    expect(detectCi(env)).toBe(expected);
  });

  it("prefers the named provider over the bare CI flag", () => {
    const env: NodeJS.ProcessEnv = { CI: "true", CIRCLECI: "true" };
    expect(detectCi(env)).toBe("circleci");
  });
});

describe("node major", () => {
  it.each([
    ["v24.14.1", "v24"],
    ["24.14.1", "v24"],
    ["v22.0.0-nightly", "v22"],
    ["garbage", "other"],
  ])("%s -> %s", (input, expected) => {
    expect(nodeMajor(input)).toBe(expected);
  });
});

describe("payload", () => {
  it("carries every selection the CLI resolved", () => {
    const payload = buildPayload({ mode: "flags", explicitFlags: ["--linter"], selection });

    expect(payload).toMatchObject({
      mode: "flags",
      shadcn: true,
      testing: "vitest",
      database: "postgres",
      linter: "oxc",
      deployment: "standalone",
      nestDiOnly: false,
      todoExample: true,
      antiSlop: true,
    });
  });

  it("sorts explicit flags so one set is one value", () => {
    const a = buildPayload({ mode: "flags", explicitFlags: ["--shadcn", "--linter"], selection });
    const b = buildPayload({ mode: "flags", explicitFlags: ["--linter", "--shadcn"], selection });

    expect(a.explicitFlags).toBe("--linter,--shadcn");
    expect(a.explicitFlags).toBe(b.explicitFlags);
  });

  it("records no flags for a fully prompted run", () => {
    const payload = buildPayload({ mode: "interactive", explicitFlags: [], selection });
    expect(payload.explicitFlags).toBe("");
    expect(payload.mode).toBe("interactive");
  });

  it("carries no project name, path or identifier", () => {
    const serialized = JSON.stringify(
      buildPayload({ mode: "interactive", explicitFlags: [], selection }),
    );

    expect(
      Object.keys(buildPayload({ mode: "interactive", explicitFlags: [], selection })).sort(),
    ).toEqual([
      "antiSlop",
      "ci",
      "cliVersion",
      "database",
      "deployment",
      "explicitFlags",
      "linter",
      "mode",
      "nestDiOnly",
      "nodeMajor",
      "platform",
      "shadcn",
      "testing",
      "todoExample",
    ]);
    expect(serialized).not.toContain(process.cwd());
  });
});
