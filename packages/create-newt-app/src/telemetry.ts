import { homedir } from "node:os";
import { promises } from "node:fs";
import https from "node:https";
import path from "node:path";
import pkg from "../package.json" with { type: "json" };
import type { ModuleSelection } from "./templates";

// Inlined by tsdown, and empty in every build but a release, so nothing else
// can report a scaffold even if the opt-out logic were wrong.
// turbo.json must list this under the build task or turbo strips it.
const ENDPOINT = process.env.NEWT_TELEMETRY_URL ?? "";

const SEND_TIMEOUT_MS = 2000;

// So an airgapped machine pays the timeout once rather than on every scaffold.
const UNREACHABLE_BACKOFF_MS = 30 * 24 * 60 * 60 * 1000;

export type TelemetryMode = "interactive" | "flags";

export type RunReport = {
  mode: TelemetryMode;
  explicitFlags: readonly string[];
  selection: ModuleSelection;
};

type State = {
  unreachableUntil?: number;
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

function statePath(): string {
  const base = process.env.XDG_STATE_HOME ?? path.join(homedir(), ".local", "state");
  return path.join(base, "create-newt-app", "telemetry.json");
}

async function readState(): Promise<State> {
  try {
    const state: State = JSON.parse(await promises.readFile(statePath(), "utf8"));
    return state;
  } catch {
    return {};
  }
}

async function writeState(next: State): Promise<void> {
  try {
    const file = statePath();
    await promises.mkdir(path.dirname(file), { recursive: true });
    await promises.writeFile(file, JSON.stringify(next), "utf8");
  } catch {
    // A read-only home means no backoff record, never a failure.
  }
}

const VALUE_FLAGS = new Set(["--testing", "--database", "--linter", "--deployment", "--extras"]);

const BOOL_FLAGS = new Set([
  "--shadcn",
  "--nest-di-only",
  "--include-example",
  "--no-install",
  "--no-git",
  "-ni",
  "-ng",
]);

const MAX_COMMAND_LENGTH = 200;

// Rebuilt from argv rather than echoed: the project name is the one token that
// identifies a user, and an unrecognized flag would put arbitrary text into a
// column the server groups by.
export function invocationCommand(argv: readonly string[] = process.argv): string {
  const args = argv.slice(2);
  const parts: string[] = [];

  args.forEach((arg, index) => {
    if (VALUE_FLAGS.has(args[index - 1] ?? "")) return;
    if (VALUE_FLAGS.has(arg)) {
      parts.push(arg, args[index + 1] ?? "");
      return;
    }
    if (BOOL_FLAGS.has(arg)) {
      parts.push(arg);
      return;
    }
    parts.push(arg.startsWith("-") ? "<flag>" : "<name>");
  });

  return ["create-newt-app", ...parts].join(" ").slice(0, MAX_COMMAND_LENGTH).trim();
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
    command: invocationCommand(),
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
function post(body: string): Promise<boolean> {
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
      // Only 2xx counts, or a permanent 404 would never arm the backoff.
      req.on("response", (res) => {
        res.resume();
        const status = res.statusCode ?? 0;
        res.on("end", () => resolve(status >= 200 && status < 300));
      });
      req.on("timeout", () => {
        req.destroy();
        resolve(false);
      });
      req.on("error", () => resolve(false));
      req.end(body);
    } catch {
      resolve(false);
    }
  });
}

// Never rejects. Call only after the project exists, so a cancelled run sends nothing.
export async function reportRun(report: RunReport): Promise<void> {
  if (!isEnabled()) return;

  const state = await readState();
  if (state.unreachableUntil && state.unreachableUntil > Date.now()) return;

  const delivered = await post(JSON.stringify(buildPayload(report)));

  if (!delivered) {
    await writeState({ unreachableUntil: Date.now() + UNREACHABLE_BACKOFF_MS });
  } else if (state.unreachableUntil) {
    await writeState({});
  }
}
