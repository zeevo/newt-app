import { createRequire } from "node:module";
import { homedir } from "node:os";
import { promises } from "node:fs";
import https from "node:https";
import path from "node:path";
import type { ModuleSelection } from "./templates";

// Inlined by tsdown, and empty in every build but a release, so nothing else
// can report a scaffold even if the opt-out logic were wrong.
// turbo.json must list this under the build task or turbo strips it.
const ENDPOINT = process.env.NEWT_TELEMETRY_URL ?? "";

const SEND_TIMEOUT_MS = 2000;

// So an airgapped machine pays the timeout once rather than on every scaffold.
const UNREACHABLE_BACKOFF_MS = 30 * 24 * 60 * 60 * 1000;

const require = createRequire(import.meta.url);
// SAFETY: the package manifest sits next to this source and is published with
// it, and npm requires a version field, so the shape is fixed at build time.
const { version: CLI_VERSION } = require("../package.json") as { version: string };

export type TelemetryMode = "interactive" | "flags";

export type RunReport = {
  mode: TelemetryMode;
  explicitFlags: readonly string[];
  selection: ModuleSelection;
};

type State = {
  notifiedAt?: number;
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
    // SAFETY: every field on State is optional and only ever read as a number,
    // so a corrupt or hand-edited file degrades to "notify and try again"
    // rather than throwing. This function only ever writes it.
    return JSON.parse(await promises.readFile(statePath(), "utf8")) as State;
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
    // A read-only home directory means no backoff and no notice record. Both
    // degrade to "ask again next time", which is worse than nothing but never
    // a reason to fail a scaffold.
  }
}

// Only the major: the server counts these per distinct value.
export function nodeMajor(version: string = process.version): string {
  const match = /^v?(\d+)/.exec(version);
  return match ? `v${match[1]}` : "other";
}

export function buildPayload(report: RunReport) {
  const { selection } = report;
  return {
    cliVersion: CLI_VERSION,
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

      // Deliberately not unref'd. An awaited promise does not hold the event
      // loop open by itself, so unref'ing here makes the process exit before
      // the request completes and nothing is ever delivered. The caller's
      // process.exit is what bounds the worst case instead.
      // Only a 2xx counts as delivered. If the endpoint ever stops being ours
      // and something answers 404, treating that as success would cost every
      // user a round trip on every scaffold forever, with the backoff never
      // arming.
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

const NOTICE = [
  "create-newt-app sends one anonymous event per scaffold: the options you chose,",
  "the CLI and Node major versions, your platform, whether prompts or flags were",
  "used, and whether this is CI. No project name, no paths, no file contents, and",
  "no identifier of any kind.",
  "Opt out with DO_NOT_TRACK=1 or NEWT_TELEMETRY_DISABLED=1.",
].join("\n");

// Never rejects. Call only after the project exists, so a cancelled run
// reports nothing.
export async function reportRun(report: RunReport): Promise<void> {
  if (!isEnabled()) return;

  const state = await readState();
  if (state.unreachableUntil && state.unreachableUntil > Date.now()) return;

  if (!state.notifiedAt) {
    console.log();
    console.log(NOTICE);
    console.log();
    await writeState({ ...state, notifiedAt: Date.now() });
  }

  const delivered = await post(JSON.stringify(buildPayload(report)));

  if (!delivered) {
    await writeState({
      ...state,
      notifiedAt: state.notifiedAt ?? Date.now(),
      unreachableUntil: Date.now() + UNREACHABLE_BACKOFF_MS,
    });
  } else if (state.unreachableUntil) {
    await writeState({ ...state, unreachableUntil: undefined });
  }
}
