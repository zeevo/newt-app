#!/usr/bin/env node
// Weekly dependency staleness report.
//
// Two sets of versions matter here and only one of them is visible to normal
// tooling:
//
//   1. This repo's own workspace manifests. Ordinary, and not user facing.
//   2. packages/create-newt-app/src/templates/versions.ts, a plain TypeScript
//      object holding every version a scaffolded app receives. It is not a
//      package.json, so nothing else reads it, and it is what people actually
//      install.
//
// Both are compared against the npm registry. Nothing here opens a pull
// request and nothing here exits non-zero because a dependency is behind: a
// permanently red scheduled workflow gets ignored. Only an internal error
// fails the run.
//
// Usage: node scripts/dependency-report.mjs [> report.md]

import { readFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const versionsFile = "packages/create-newt-app/src/templates/versions.ts";

// A package whose registry entry has not moved in this long is worth a look.
// tsup sat unmaintained for nine months without ever being marked deprecated,
// so the deprecation flag alone is not enough of a signal.
const DORMANT_DAYS = 365;
const QUIET_DAYS = 180;

// The registry is a free service. Keep a lid on how hard 100+ lookups hit it.
const CONCURRENCY = 6;
const RETRIES = 3;

const repoSlug = process.env.GITHUB_REPOSITORY ?? "zeevo/newt-app";
const serverUrl = process.env.GITHUB_SERVER_URL ?? "https://github.com";
const repoUrl = `${serverUrl}/${repoSlug}`;

const USER_AGENT = `newt-app-dependency-report (${repoUrl})`;

// GitHub rejects issue bodies over 65536 characters.
const MAX_BODY = 60000;

// ---------------------------------------------------------------- semver bits

const parseVersion = (value) => {
  const match = /^(\d+)\.(\d+)\.(\d+)(?:[-+](.*))?$/.exec(value ?? "");
  if (!match) return null;
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
    prerelease: match[4] ?? null,
    raw: value,
  };
};

const compareVersions = (a, b) => a.major - b.major || a.minor - b.minor || a.patch - b.patch;

// Ranges in this repo are exact, caret, or tilde. Anything more exotic is
// reported as unparsed rather than guessed at.
const parseRange = (range) => {
  const match = /^(\^|~|)\s*(\d+\.\d+\.\d+(?:[-+][^\s]*)?)$/.exec((range ?? "").trim());
  if (!match) return null;
  const version = parseVersion(match[2]);
  if (!version) return null;
  return { operator: match[1], version };
};

// Does `candidate` fall inside the range? A caret cannot cross a major, and on
// a 0.x version it cannot cross a minor either, which is the whole reason
// those ranges silently freeze.
const satisfies = (candidate, range) => {
  const { operator, version } = range;
  if (compareVersions(candidate, version) < 0) return false;
  if (operator === "") return compareVersions(candidate, version) === 0;
  if (operator === "~") {
    return candidate.major === version.major && candidate.minor === version.minor;
  }
  if (version.major > 0) return candidate.major === version.major;
  if (version.minor > 0) {
    return candidate.major === 0 && candidate.minor === version.minor;
  }
  return compareVersions(candidate, version) === 0;
};

// ------------------------------------------------------------- input scraping

// versions.ts is a flat object literal of string values, so a scoped regex over
// the literal is enough and avoids compiling TypeScript just to read it.
const readTemplateVersions = async () => {
  const source = await readFile(path.join(repoRoot, versionsFile), "utf8");
  const literal = /export const versions = \{([\s\S]*?)\n\} as const;/.exec(source);
  if (!literal) {
    throw new Error(`could not find the versions object literal in ${versionsFile}`);
  }
  const entries = [...literal[1].matchAll(/^\s*"([^"]+)":\s*"([^"]+)",?\s*$/gm)];
  if (entries.length === 0) {
    throw new Error(`parsed zero entries out of ${versionsFile}`);
  }
  return entries.map((match) => ({ name: match[1], range: match[2] }));
};

// Declared ranges rather than locked versions, deliberately: a scaffolded app
// ships without a lockfile, so the range is what a new user resolves against.
const readWorkspaceVersions = async () => {
  const nested = await Promise.all(
    ["apps", "packages"].map(async (dir) => {
      const base = path.join(repoRoot, dir);
      if (!existsSync(base)) return [];
      const children = await readdir(base, { withFileTypes: true });
      return children
        .filter((child) => child.isDirectory())
        .map((child) => path.join(dir, child.name, "package.json"))
        .filter((relative) => existsSync(path.join(repoRoot, relative)));
    }),
  );

  const manifests = await Promise.all(
    ["package.json", ...nested.flat()].map(async (relative) => ({
      relative,
      manifest: JSON.parse(await readFile(path.join(repoRoot, relative), "utf8")),
    })),
  );

  // One package can be declared by several workspaces. Keep every declaration
  // so the report can say where a stale version is coming from.
  const byName = new Map();
  manifests.forEach(({ relative, manifest }) => {
    const owner = manifest.name ?? relative;
    Object.entries({
      ...(manifest.dependencies ?? {}),
      ...(manifest.devDependencies ?? {}),
    })
      // Workspace links and git or file specifiers have no registry entry.
      .filter(([, range]) => /^[\^~]?\d/.test(range))
      .forEach(([name, range]) => {
        const existing = byName.get(name) ?? { name, range, owners: [] };
        existing.owners.push(owner);
        byName.set(name, existing);
      });
  });

  return [...byName.values()].sort((a, b) => a.name.localeCompare(b.name));
};

// ------------------------------------------------------------------- registry

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// The abbreviated packument is a fraction of the size of the full document and
// still carries everything needed: dist-tags, per-version deprecation notices,
// and the last time the registry entry changed at all.
const fetchPackument = async (name) => {
  const url = `https://registry.npmjs.org/${name.replace("/", "%2F")}`;
  const attempt = async (remaining) => {
    try {
      const response = await fetch(url, {
        headers: {
          accept: "application/vnd.npm.install-v1+json",
          "user-agent": USER_AGENT,
        },
      });
      if (response.status === 404) return { error: "not found on the registry" };
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return { data: await response.json() };
    } catch (error) {
      if (remaining <= 0) return { error: String(error.message ?? error) };
      await sleep((RETRIES - remaining + 1) * 500);
      return attempt(remaining - 1);
    }
  };
  return attempt(RETRIES);
};

const runPool = async (items, limit, worker) => {
  const results = new Array(items.length);
  const queue = items.map((item, index) => ({ item, index }));
  const runners = Array.from({ length: Math.min(limit, queue.length) }, async () => {
    while (queue.length > 0) {
      const next = queue.shift();
      results[next.index] = await worker(next.item);
    }
  });
  await Promise.all(runners);
  return results;
};

// ------------------------------------------------------------------- analysis

const daysSince = (timestamp, now) =>
  Math.floor((now.getTime() - new Date(timestamp).getTime()) / 86400000);

const analyze = ({ name, range, owners }, packument, now) => {
  const base = { name, range, owners };
  if (packument.error) return { ...base, unresolved: packument.error };

  const data = packument.data;
  const latest = parseVersion(data["dist-tags"]?.latest);
  const parsedRange = parseRange(range);
  if (!latest) return { ...base, unresolved: "the registry has no latest tag" };
  if (!parsedRange) return { ...base, unresolved: `unrecognized range "${range}"` };

  // What a fresh install resolves to today, which for a scaffolded app is what
  // the user actually gets.
  const resolved = Object.keys(data.versions ?? {})
    .map(parseVersion)
    .filter((version) => version !== null && version.prerelease === null)
    .filter((version) => satisfies(version, parsedRange))
    .sort(compareVersions)
    .pop();

  const deprecations = [latest.raw, resolved?.raw]
    .filter((version) => version !== undefined)
    .map((version) => ({ version, note: data.versions?.[version]?.deprecated }))
    .filter((entry) => typeof entry.note === "string" && entry.note.length > 0);

  return {
    ...base,
    pinned: parsedRange.version,
    operator: parsedRange.operator,
    latest,
    resolved: resolved ?? null,
    deprecations,
    idleDays: data.modified ? daysSince(data.modified, now) : null,
    // No install against this range will ever reach the latest release.
    frozen: resolved !== undefined && compareVersions(resolved, latest) < 0,
    majorsBehind: latest.major - parsedRange.version.major,
    // The range floats above the number written down, so the lockfile in this
    // repo tests one version while a fresh scaffold installs another.
    floats: resolved !== undefined && compareVersions(resolved, parsedRange.version) > 0,
  };
};

// --------------------------------------------------------------------- render

const link = (name) => `[\`${name}\`](https://www.npmjs.com/package/${name})`;

const table = (headers, rows) =>
  [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.join(" | ")} |`),
  ].join("\n");

const section = (heading, body) => (body ? `### ${heading}\n\n${body}\n` : "");

const details = (summary, body) =>
  `<details><summary>${summary}</summary>\n\n${body}\n\n</details>`;

const months = (days) => `${Math.floor(days / 30)} months`;

const ageTable = (findings) =>
  table(
    ["Package", "Declared", "Latest", "Last activity"],
    findings.map((finding) => [
      link(finding.name),
      `\`${finding.range}\``,
      `\`${finding.latest.raw}\``,
      `${months(finding.idleDays)} ago`,
    ]),
  );

const renderGroup = (title, blurb, findings) => {
  const resolved = findings.filter((finding) => !finding.unresolved);
  const unresolved = findings.filter((finding) => finding.unresolved);

  const deprecated = resolved.filter((finding) => finding.deprecations.length > 0);
  const byAge = (a, b) => b.idleDays - a.idleDays;
  const idle = (finding, low, high) =>
    finding.idleDays !== null && finding.idleDays >= low && finding.idleDays < high;

  const dormant = resolved.filter((finding) => idle(finding, DORMANT_DAYS, Infinity)).sort(byAge);
  const quiet = resolved.filter((finding) => idle(finding, QUIET_DAYS, DORMANT_DAYS)).sort(byAge);
  const majors = resolved
    .filter((finding) => finding.majorsBehind > 0)
    .sort((a, b) => b.majorsBehind - a.majorsBehind);
  // The interesting subset of frozen ranges: a caret on a 0.x version, where
  // the range looks permissive but can never pick up the next minor.
  const frozenZero = resolved.filter(
    (finding) =>
      finding.frozen &&
      finding.operator === "^" &&
      finding.pinned.major === 0 &&
      finding.latest.major === 0,
  );
  const floating = resolved.filter((finding) => finding.floats && finding.majorsBehind === 0);
  // "Current" means the range installs the latest release, not that the number
  // written down matches it.
  const current = resolved.filter(
    (finding) => !finding.frozen && finding.deprecations.length === 0,
  );

  const body = [
    `${blurb}\n`,
    `${resolved.length} of ${findings.length} entries resolved against the registry. ${current.length} install the latest release.\n`,
    section(
      `Deprecated (${deprecated.length})`,
      deprecated.length === 0
        ? ""
        : table(
            ["Package", "Declared", "Version", "Notice"],
            deprecated.map((finding) => [
              link(finding.name),
              `\`${finding.range}\``,
              finding.deprecations.map((entry) => `\`${entry.version}\``).join(", "),
              finding.deprecations[0].note.slice(0, 160).replace(/\|/g, "\\|"),
            ]),
          ),
    ),
    section(
      `No registry activity in over a year (${dormant.length})`,
      dormant.length === 0
        ? ""
        : `A finished package and an abandoned one look identical from here, so read this list rather than acting on it.\n\n${ageTable(dormant)}`,
    ),
    section(
      `Quiet for over six months (${quiet.length})`,
      quiet.length === 0
        ? ""
        : details("Not necessarily a problem, but worth a glance", ageTable(quiet)),
    ),
    section(
      `Majors behind (${majors.length})`,
      majors.length === 0
        ? ""
        : table(
            ["Package", "Declared", "Installs", "Latest", "Majors"],
            majors.map((finding) => [
              link(finding.name),
              `\`${finding.range}\``,
              `\`${finding.resolved?.raw ?? "none"}\``,
              `\`${finding.latest.raw}\``,
              String(finding.majorsBehind),
            ]),
          ),
    ),
    section(
      `Frozen caret on a 0.x version (${frozenZero.length})`,
      frozenZero.length === 0
        ? ""
        : `A caret on a \`0.x\` version cannot cross a minor, so these ranges are pinned in practice and will never pick up the newer release on their own.\n\n${table(
            ["Package", "Declared", "Ceiling", "Latest"],
            frozenZero.map((finding) => [
              link(finding.name),
              `\`${finding.range}\``,
              `\`${finding.resolved?.raw ?? "none"}\``,
              `\`${finding.latest.raw}\``,
            ]),
          )}`,
    ),
    section(
      `Range floats above the declared version (${floating.length})`,
      floating.length === 0
        ? ""
        : details(
            "The number written down is not the number installed",
            table(
              ["Package", "Declared", "Installs"],
              floating.map((finding) => [
                link(finding.name),
                `\`${finding.range}\``,
                `\`${finding.resolved?.raw ?? "none"}\``,
              ]),
            ),
          ),
    ),
    section(
      `Could not be checked (${unresolved.length})`,
      unresolved.length === 0
        ? ""
        : unresolved.map((finding) => `- ${link(finding.name)}: ${finding.unresolved}`).join("\n"),
    ),
  ]
    .filter(Boolean)
    .join("\n");

  return `## ${title}\n\n${body}`;
};

const render = (templateFindings, workspaceFindings, now) =>
  [
    `Generated ${now.toISOString().slice(0, 10)} by [\`dependency-report.yml\`](${repoUrl}/blob/main/.github/workflows/dependency-report.yml). Refreshed weekly in place, so this issue stays the only copy. No pull requests are opened: the version set is curated on purpose, and this is only the signal.`,
    "",
    renderGroup(
      "Scaffolded app versions",
      `Read from [\`${versionsFile}\`](${repoUrl}/blob/main/${versionsFile}). These are the versions every new app installs, so drift here reaches users rather than CI. Scaffolded apps ship without a lockfile, which means the "Installs" column is what someone running \`create-newt-app\` gets today.`,
      templateFindings,
    ),
    "",
    renderGroup(
      "This repo's own tooling",
      "Declared ranges across the workspace manifests. Internal only: nothing here is installed by a scaffolded app.",
      workspaceFindings,
    ),
    "",
    "---",
    "",
    `Deprecation notices come from the registry. Dormancy is a heuristic: a package can be abandoned without ever being marked deprecated, so anything untouched for over ${DORMANT_DAYS} days is listed regardless of how current its version number looks.`,
  ].join("\n");

// ----------------------------------------------------------------------- main

const main = async () => {
  const now = new Date();
  const templateVersions = await readTemplateVersions();
  const workspaceVersions = await readWorkspaceVersions();

  const names = [
    ...new Set([...templateVersions, ...workspaceVersions].map((entry) => entry.name)),
  ];
  process.stderr.write(
    `resolving ${names.length} packages (${templateVersions.length} scaffolded, ${workspaceVersions.length} workspace)\n`,
  );

  const packuments = new Map(
    (await runPool(names, CONCURRENCY, fetchPackument)).map((result, index) => [
      names[index],
      result,
    ]),
  );

  const analyzeAll = (entries) =>
    entries.map((entry) => analyze(entry, packuments.get(entry.name), now));

  const body = render(analyzeAll(templateVersions), analyzeAll(workspaceVersions), now);

  const failures = [...packuments.values()].filter((result) => result.error).length;
  process.stderr.write(`${names.length - failures} resolved, ${failures} failed\n`);

  process.stdout.write(
    body.length > MAX_BODY
      ? `${body.slice(0, MAX_BODY)}\n\n_Report truncated to fit a GitHub issue body._\n`
      : `${body}\n`,
  );
};

main().catch((error) => {
  process.stderr.write(`dependency report failed: ${error.stack ?? error}\n`);
  process.exit(1);
});
