import { describe, it, expect } from "vitest";
import { deploymentOptions, type Config } from "@/lib/build-command";
import { configParsers, sanitizeConfig } from "@/lib/config-params";

describe("config params", () => {
  it("accepts every value the panel can select", () => {
    const accepted = {
      testing: ["jest", "vitest"],
      database: ["sqlite", "postgres"],
      linter: ["eslint", "oxc"],
      deployment: deploymentOptions("full"),
      mode: ["full", "nest-di-only", "bare"],
    } as const;

    Object.entries(accepted).forEach(([key, values]) => {
      values.forEach((value) => {
        expect(
          configParsers[key as keyof typeof accepted].parse(value),
          `${key}=${value}`,
        ).toBe(value);
      });
    });
  });

  it("rejects unknown values so hand-edited urls fall back to the default", () => {
    expect(configParsers.testing.parse("mocha")).toBeNull();
    expect(configParsers.deployment.parse("docker")).toBeNull();
    expect(configParsers.mode.parse("no-nest")).toBeNull();
  });

  it("drops a deployment the CLI rejects with di-only", () => {
    const base: Config = {
      shadcn: true,
      testing: "vitest",
      database: "postgres",
      linter: "oxc",
      deployment: "spa",
      mode: "nest-di-only",
      includeExample: true,
    };
    expect(sanitizeConfig(base).deployment).toBe("none");
    expect(
      sanitizeConfig({ ...base, deployment: "standalone" }).deployment,
    ).toBe("standalone");
    expect(sanitizeConfig({ ...base, mode: "full" }).deployment).toBe("spa");
  });

  it("drops every deployment in bare mode", () => {
    const base: Config = {
      shadcn: true,
      testing: "vitest",
      database: "postgres",
      linter: "oxc",
      deployment: "standalone",
      mode: "bare",
      includeExample: true,
    };
    expect(sanitizeConfig(base).deployment).toBe("none");
    expect(sanitizeConfig({ ...base, deployment: "spa" }).deployment).toBe(
      "none",
    );
  });
});
