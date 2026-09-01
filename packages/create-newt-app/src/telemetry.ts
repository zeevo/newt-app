import https from "node:https";
import pkg from "../package.json" with { type: "json" };
import type { ModuleSelection } from "./templates";

// Inlined by tsdown, and empty in every build but a release, so nothing else
// can report a scaffold even if the opt-out logic were wrong.
// turbo.json must list this under the build task or turbo strips it.
const ENDPOINT = process.env.NEWT_TELEMETRY_URL ?? "";

// A real round trip to the edge measures ~110ms, and DNS or refused failures
// return in about that too. Only a firewall that drops packets waits out the
// full budget, and it does so on every run, so this is deliberately tight.
const SEND_TIMEOUT_MS = 1000;

export type TelemetryMode = "interactive" | "flags";

export type RunReport = {
  mode: TelemetryMode;
  explicitFlags: readonly string[];
  selection: ModuleSelection;
};

const CI_PROVIDERS = [
  ["GITHUB_ACTIONS", "github-actions"],
  ["GITLAB_CI", "gitlab-ci"],
  ["CIRCLECI", "circleci"],
  ["TRAVIS", "travis"],
  ["BUILDKITE", "buildkite"],
  ["JENKINS_URL", "jenkins"],
  ["TEAMCITY_VERSION", "teamcity"],
  ["CODEBUILD_BUILD_ID", "codebuild"],
  ["VERCEL", "vercel"],
  ["NETLIFY", "netlify"],
] as const;

export function detectCi(env: NodeJS.ProcessEnv = process.env): string {
  const named = CI_PROVIDERS.find(([key]) => env[key]);
  if (named) return named[1];
  return env.CI ? "unknown" : "none";
}

// DO_NOT_TRACK is the cross-tool convention from consoledonottrack.com, and is
// checked first so the project-specific switches cannot re-enable past it.
export function isOptedOut(env: NodeJS.ProcessEnv = process.env): boolean {
  if (env.DO_NOT_TRACK === "1" || env.DO_NOT_TRACK?.toLowerCase() === "true") return true;
  if (env.NEWT_TELEMETRY_DISABLED === "1") return true;
  if (env.NEWT_TELEMETRY !== undefined) return env.NEWT_TELEMETRY !== "1";
  return false;
}

export function isEnabled(env: NodeJS.ProcessEnv = process.env): boolean {
  return Boolean(ENDPOINT) && !isOptedOut(env);
}

export function nodeMajor(version: string = process.version): string {
  const match = /^v?(\d+)/.exec(version);
  return match ? `v${match[1]}` : "other";
}

export function buildPayload(report: RunReport) {
  const { selection } = report;
  return {
    cliVersion: pkg.version,
    nodeMajor: nodeMajor(),
    platform: process.platform,
    mode: report.mode,
    ci: detectCi(),
    // Sorted, so one set of flags is one value and not one per ordering.
    explicitFlags: [...report.explicitFlags].sort().join(","),
    shadcn: selection.shadcn,
    testing: selection.testing,
    database: selection.database,
    linter: selection.linter,
    deployment: selection.deployment,
    nestDiOnly: selection.nestDiOnly,
    todoExample: selection.todoExample,
    antiSlop: selection.extras.includes("anti-slop"),
  };
}

// node:https rather than fetch: fetch's connect timeout cannot be configured
// without pulling in undici, and its 10s default outlives an AbortSignal. On a
// firewall that DROPs packets that leaves the CLI sitting there for nine
// seconds after it has already printed "Next steps".
function post(body: string): Promise<void> {
  return new Promise((resolve) => {
    try {
      const req = https.request(ENDPOINT, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "content-length": Buffer.byteLength(body),
        },
        timeout: SEND_TIMEOUT_MS,
      });

      // Never unref this socket: an awaited promise does not hold the event
      // loop open, so the process would exit before the request completes.
      req.on("response", (res) => {
        res.resume();
        res.on("end", () => resolve());
      });
      req.on("timeout", () => {
        req.destroy();
        resolve();
      });
      req.on("error", () => resolve());
      req.end(body);
    } catch {
      resolve();
    }
  });
}

// Never rejects. Call only after the project exists, so a cancelled run sends nothing.
export async function reportRun(report: RunReport): Promise<void> {
  if (!isEnabled()) return;
  await post(JSON.stringify(buildPayload(report)));
}
