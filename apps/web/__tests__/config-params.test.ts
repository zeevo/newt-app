import { describe, it, expect } from "vitest";
import { deploymentOptions, NEST_MODES, type Config } from "@/lib/build-command";
import { configParsers, sanitizeConfig } from "@/lib/config-params";

describe("config params", () => {
  it("accepts every value the panel can select", () => {
    const accepted = [
      ["testing", ["jest", "vitest"]],
      ["database", ["sqlite", "postgres"]],
      ["linter", ["eslint", "oxc"]],
      ["deployment", deploymentOptions("on")],
      ["nest", NEST_MODES],
    ] as const;

    accepted.forEach(([key, values]) => {
      values.forEach((value) => {
        expect(configParsers[key].parse(value), `${key}=${value}`).toBe(value);
      });
    });
  });

  it("rejects unknown values so hand-edited urls fall back to the default", () => {
    expect(configParsers.testing.parse("mocha")).toBeNull();
    expect(configParsers.deployment.parse("docker")).toBeNull();
    expect(configParsers.nest.parse("di")).toBeNull();
  });

  it("drops a deployment the CLI rejects for the selected nest mode", () => {
    const base: Config = {
      name: "my-app",
      shadcn: true,
      stylex: false,
      testing: "vitest",
      database: "postgres",
      linter: "oxc",
      deployment: "spa",
      nest: "di-only",
      todoExample: true,
      antiSlop: true,
    };
    expect(sanitizeConfig(base).deployment).toBe("none");
    expect(sanitizeConfig({ ...base, nest: "off" }).deployment).toBe("none");
    expect(sanitizeConfig({ ...base, deployment: "standalone" }).deployment).toBe("standalone");
    expect(sanitizeConfig({ ...base, nest: "on" }).deployment).toBe("spa");
  });

  it("drops the todo example when nest is off", () => {
    const base: Config = {
      name: "my-app",
      shadcn: true,
      stylex: false,
      testing: "vitest",
      database: "postgres",
      linter: "oxc",
      deployment: "none",
      nest: "off",
      todoExample: true,
      antiSlop: false,
    };
    expect(sanitizeConfig(base).todoExample).toBe(false);
    expect(sanitizeConfig({ ...base, nest: "di-only" }).todoExample).toBe(true);
  });
  it("drops anti-slop when the linter cannot run it", () => {
    const base: Config = {
      name: "my-app",
      shadcn: true,
      stylex: false,
      testing: "vitest",
      database: "postgres",
      linter: "oxc",
      deployment: "none",
      nest: "on",
      todoExample: true,
      antiSlop: true,
    };
    expect(sanitizeConfig(base).antiSlop).toBe(true);
    expect(sanitizeConfig({ ...base, linter: "eslint" }).antiSlop).toBe(false);
  });
});
