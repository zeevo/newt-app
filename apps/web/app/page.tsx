import Link from "next/link";
import { Suspense } from "react";
import { Band } from "@/components/band";
import { CodeBlock } from "@/components/code-block";
import { CopyButton } from "@/components/copy-button";
import { FlagGrid } from "@/components/flag-grid";
import { Icons } from "@/components/icons";
import { InteractiveFileTree } from "@/components/interactive-file-tree";
import LogoRain from "@/components/logo-rain";
import { Pipeline } from "@/components/pipeline";
import { WindowFrame } from "@/components/window-frame";
import { siteConfig } from "@/lib/config";
import { version as cliVersion } from "../../../packages/create-newt-app/package.json";

const INSTALL = "npm create newt-app";

const ANSWERS = [
  ["name", "my-app", ""],
  ["Next.js", "on", "apps/web on :3000"],
  ["NestJS", "on", "apps/api on :3001"],
  ["Better Auth", "on", "packages/auth"],
  ["database", "sqlite", "kysely + better-sqlite3"],
  ["testing", "jest", "in apps/api"],
  ["linter", "eslint", "eslint + prettier"],
  ["shadcn/ui", "on", "63 components"],
  ["deployment", "none", "no Dockerfile"],
];

const WRITES = `$ npm create newt-app@latest my-app

my-app/
├─ apps/web                    next.js, :3000
├─ apps/api                    nestjs, :3001
├─ packages/ui                 shadcn/ui + 63 components
├─ packages/auth               better auth configuration
├─ packages/db                 kysely + sqlite
├─ packages/eslint-config      eslint + prettier
├─ packages/typescript-config  shared tsconfig
└─ pnpm-workspace.yaml`;

const STEPS = [
  {
    code: "npm create newt-app",
    body: "Runs the CLI through npx. Node and pnpm are checked before a single file is written.",
  },
  {
    code: "answer, or pass flags",
    body: "Nine prompts. Passing any config flag switches the run to non-interactive and skips all of them.",
  },
  {
    code: "pnpm install",
    body: "The selected template modules are written, dependencies installed, the tree formatted and git initialized.",
  },
  {
    code: "pnpm dev",
    body: "Turborepo runs both apps: Next.js on 3000 and, unless Nest is off, NestJS on 3001.",
  },
];

const FILES = [
  {
    label: "apps/web/next.config.js",
    tag: "proxy",
    code: `async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination:
        'http://localhost:3001/api/:path*',
    },
  ];
}`,
  },
  {
    label: "packages/auth/src/index.ts",
    tag: "auth",
    code: `import { betterAuth } from "better-auth";
import { driver } from "@my-app/db";

export const auth = betterAuth({
  database: driver,
  emailAndPassword: { enabled: true },
});`,
  },
  {
    label: "packages/db/src/index.ts",
    tag: "data",
    code: `import { Kysely, SqliteDialect } from "kysely";
import type { DB } from "./schema.js";

export const db = new Kysely<DB>({
  dialect: new SqliteDialect({
    database: driver,
  }),
});`,
  },
];

const FLAGS = [
  {
    flag: "--nest <on|off|di-only>",
    body: "on writes apps/api with its own HTTP server. di-only keeps the Nest container and injects its providers into Next.js route handlers. off writes no apps/api at all.",
  },
  {
    flag: "--database <sqlite|postgres>",
    body: "Picks the Kysely dialect in packages/db and the driver Better Auth is handed.",
  },
  {
    flag: "--testing <jest|vitest>",
    body: "The runner, its config and its dev dependencies, all of which land in apps/api. Not offered with --nest off.",
  },
  {
    flag: "--linter <eslint|oxc>",
    body: "ESLint with Prettier, or oxlint with oxfmt and a tools/oxlint directory.",
  },
  {
    flag: "--deployment <none|standalone|spa>",
    body: "standalone adds Dockerfiles and docker-compose.yml. spa hands a static export to Nest to serve, so it needs --nest on.",
  },
  {
    flag: "--shadcn",
    body: "Vendors 63 shadcn/ui components into packages/ui.",
  },
  {
    flag: "--stylex",
    body: "StyleX in place of Tailwind. Mutually exclusive with --shadcn.",
  },
  {
    flag: "--include-example",
    body: "A todo module: an injectable service behind a Nest controller, or behind a route handler that injects it.",
  },
  {
    flag: "--extras anti-slop",
    body: "oxlint rules that reject low-evidence TypeScript. Requires --linter oxc.",
  },
  {
    flag: "--no-install, --no-git",
    body: "Skip pnpm install, skip git init. The next steps printed at the end adjust to match.",
  },
];

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden border-b pt-10 pb-14 sm:pt-16">
        {/* the tank is sized independently of the section so the spec sheet can
            hang out of its bottom edge rather than stretch it */}
        <div className="pointer-events-none absolute inset-x-0 top-2 z-0 container h-[30rem] sm:h-[34rem]">
          <LogoRain />
        </div>
        {/* the chips drift behind the copy, so the column gets a scrim wide
            enough to hold the lede without boxing it in */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[5] [background:radial-gradient(94%_44%_at_50%_46%,var(--background)_46%,transparent_86%)] sm:[background:radial-gradient(58%_52%_at_50%_44%,var(--background)_32%,transparent_78%)]"
        />
        <div className="pointer-events-none relative z-10 container flex flex-col items-center text-center">
          <a
            href={siteConfig.links.npm}
            target="_blank"
            rel="noreferrer"
            className="pointer-events-auto inline-flex items-center gap-2 rounded-full border bg-background/80 py-1.5 pr-3 pl-4 text-sm text-muted-foreground shadow-sm backdrop-blur transition-colors hover:text-foreground"
          >
            <span className="size-2 rounded-full bg-green-500" />
            create-newt-app v{cliVersion}
            <span aria-hidden>→</span>
          </a>
          <h1 className="mt-7 max-w-[20ch] text-4xl leading-[1.12] font-semibold tracking-tight text-balance sm:text-5xl xl:text-[3.1rem]">
            Nine prompts, one workspace.{" "}
            <span className="text-amber-700 dark:text-amber-400">
              Every answer changes the file set.
            </span>
          </h1>
          <p className="mt-6 max-w-[64ch] text-base leading-relaxed text-muted-foreground lg:text-lg">
            create-newt-app asks about Nest, the database, the test runner, the linter and the
            deployment target, then writes only the files those answers imply. Next.js runs on 3000,
            NestJS on 3001, and <Code>/api</Code> is rewritten between them.
          </p>
          <div className="pointer-events-auto mt-8 flex flex-wrap items-center justify-center gap-3">
            <div className="flex h-11 items-center gap-2 rounded-lg border bg-background pr-2 pl-5 text-sm whitespace-nowrap shadow-sm">
              <span className="shrink-0 text-muted-foreground select-none">$</span>
              <span className="font-mono">{INSTALL}</span>
              <CopyButton value={INSTALL} className="static shrink-0" />
            </div>
            <Link
              href="/builder"
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-amber-800 px-5 text-sm font-semibold text-white transition-colors hover:bg-amber-700 dark:bg-amber-500 dark:text-[oklch(0.19_0.03_262)] dark:hover:bg-amber-400"
            >
              Open the builder
            </Link>
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-lg border bg-background px-5 text-sm font-semibold transition-colors hover:bg-muted"
            >
              <Icons.gitHub className="size-4" />
              GitHub
            </a>
          </div>
        </div>
        <div className="relative z-10 container mt-14">
          <WindowFrame lights label="my-app" tag="defaults" className="shadow-xl">
            <div className="grid gap-px bg-border md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <div className="bg-card p-5 sm:p-6">
                <p className="mb-4 font-mono text-[0.7rem] tracking-[0.16em] text-muted-foreground uppercase">
                  answers
                </p>
                <dl className="space-y-2 font-mono text-sm">
                  {ANSWERS.map(([label, value, note]) => (
                    <div key={label} className="flex flex-wrap items-baseline gap-x-3">
                      <dt className="w-32 shrink-0 text-muted-foreground">{label}</dt>
                      <dd className="font-semibold text-amber-800 dark:text-amber-300">{value}</dd>
                      {note && <dd className="text-xs text-muted-foreground/70">{note}</dd>}
                    </div>
                  ))}
                </dl>
              </div>
              <div className="bg-code p-5 sm:p-6">
                <p className="mb-4 font-mono text-[0.7rem] tracking-[0.16em] text-muted-foreground uppercase">
                  writes
                </p>
                <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-muted-foreground">
                  {WRITES}
                </pre>
              </div>
            </div>
          </WindowFrame>
        </div>
      </section>

      <Band
        id="pipeline"
        index="01"
        eyebrow="How it works"
        title="From an empty directory to two servers."
        lede="No global install, no template to clone and strip, no post-clone rename pass."
      >
        <Pipeline steps={STEPS} className="mt-12" />
      </Band>

      <Band
        id="wiring"
        index="02"
        eyebrow="Already wired"
        title="Three files you would otherwise write yourself."
        lede="The proxy, the auth config and the database client are emitted pointing at each other, which is the part a template repository leaves to you."
      >
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {FILES.map((file) => (
            <CodeBlock key={file.label} label={file.label} tag={file.tag} code={file.code} />
          ))}
        </div>
      </Band>

      <Band
        id="flags"
        index="03"
        eyebrow="Reference"
        title="Every prompt is also a flag."
        lede={
          <>
            Passing any one of these puts the CLI in non-interactive mode, so a command is
            reproducible in CI. Combinations that cannot work, such as <Code>--deployment spa</Code>{" "}
            with <Code>--nest off</Code>, are rejected before anything is written.
          </>
        }
      >
        <FlagGrid flags={FLAGS} />
      </Band>

      <Band
        id="builder"
        index="04"
        eyebrow="Command builder"
        title="Toggle the answers, read the tree."
        lede="The tree is checked against the scaffolder in CI, so a node appears here exactly when create-newt-app writes that file."
      >
        <div className="mt-10 rounded-lg border bg-card p-2">
          {/* nuqs reads useSearchParams, which needs a boundary on a
              statically rendered page */}
          <Suspense>
            <InteractiveFileTree />
          </Suspense>
        </div>
      </Band>

      <Band
        index="05"
        eyebrow="About"
        title="Curated, so day one is not a deletion pass."
        lede="A starter earns its place by the decisions it already made. These are the ones it makes: pnpm workspaces over npm, Turborepo for the task graph, Kysely over an ORM, Better Auth over a hosted identity provider, and one shared package per concern rather than one per app."
      >
        <p className="mt-4 max-w-[64ch] text-lg text-muted-foreground">
          Every combination the flags allow is scaffolded in CI, then installed, linted, built,
          booted and probed over HTTP. Changing a template that breaks a mode turns the matrix red
          before it reaches npm.
        </p>
      </Band>
    </>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-foreground/[0.06] px-1 py-0.5 font-mono text-[0.85em] whitespace-nowrap text-foreground dark:bg-foreground/10">
      {children}
    </code>
  );
}
