import Link from "next/link";
import { Suspense } from "react";
import { CopyButton } from "@/components/copy-button";
import { Icons } from "@/components/icons";
import { InteractiveFileTree } from "@/components/interactive-file-tree";
import LogoRain from "@/components/logo-rain";
import { Section } from "@/components/section";
import { TerminalCast } from "@/components/terminal-cast";
import { siteConfig } from "@/lib/config";
import { version as cliVersion } from "../../../packages/create-newt-app/package.json";

const INSTALL = "npm create newt-app";

const PILL =
  "inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors";

const WORKSPACES = [
  {
    path: "apps/web",
    title: "Next.js frontend",
    body: (
      <>
        App Router on port 3000. <C>next.config.js</C> rewrites <C>/api/:path*</C> to{" "}
        <C>http://localhost:3001</C>, so the browser only ever talks to one origin.
      </>
    ),
  },
  {
    path: "apps/api",
    title: "NestJS backend",
    body: (
      <>
        Bootstraps with <C>setGlobalPrefix(&apos;api&apos;)</C> and listens on 3001. Controllers,
        providers, and a test suite on Jest or Vitest.
      </>
    ),
  },
  {
    path: "packages/auth",
    title: "Better Auth",
    body: (
      <>
        One <C>betterAuth()</C> call with email and password enabled, exported as <C>auth</C> and
        imported by both apps.
      </>
    ),
  },
  {
    path: "packages/db",
    title: "Kysely and migrations",
    body: (
      <>
        A typed <C>Kysely&lt;DB&gt;</C> client over SQLite or Postgres, with <C>src/schema.ts</C>{" "}
        and a migration runner.
      </>
    ),
  },
];

const FLOW = [
  {
    title: "Browser to Next.js",
    body: (
      <>
        <C>fetch(&apos;/api/hello&apos;)</C> hits Next on 3000. The rewrite forwards it to Nest
        server-side, so there is no preflight and no second origin to configure.
      </>
    ),
  },
  {
    title: "Nest to the session",
    body: (
      <>
        <C>AuthModule.forRoot({"{ auth }"})</C> guards every route. <C>@AllowAnonymous()</C> opens
        one back up; everything else resolves a <C>UserSession</C>.
      </>
    ),
  },
  {
    title: "Session to the database",
    body: (
      <>
        Better Auth is handed the same driver the app queries through, so the session table and your
        tables live in one database with one migration history.
      </>
    ),
  },
];

function C({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-foreground/[0.06] px-1 py-0.5 font-mono text-[0.85em] whitespace-nowrap text-foreground dark:bg-foreground/10">
      {children}
    </code>
  );
}

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden border-b">
        <div aria-hidden className="hero-wash pointer-events-none absolute inset-0 -z-10" />
        <div className="container grid items-center gap-10 py-12 lg:grid-cols-[1fr_1.12fr] lg:gap-14 lg:py-16">
          <div>
            <a
              href={siteConfig.links.npm}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border bg-background/80 py-1.5 pr-3 pl-4 text-sm text-muted-foreground shadow-sm backdrop-blur transition-colors hover:text-foreground"
            >
              <span className="size-2 rounded-full bg-green-500" />
              create-newt-app v{cliVersion} on npm
              <span aria-hidden>→</span>
            </a>
            <h1 className="mt-6 text-4xl leading-[1.12] font-semibold tracking-tight text-balance sm:text-5xl xl:text-[2.85rem]">
              One command writes the workspace.{" "}
              <span className="text-sky-700 dark:text-sky-400">
                Next.js on :3000, NestJS on :3001.
              </span>
            </h1>
            <p className="mt-5 max-w-[56ch] text-base leading-relaxed text-muted-foreground lg:text-lg">
              create-newt-app writes a pnpm workspace with a Next.js frontend, a NestJS backend,
              Better Auth shared by both, and a typed Kysely database layer. They are configured
              against each other before you open the editor.
            </p>
            <div className="mt-7 flex h-11 w-fit items-center gap-2 rounded-full border bg-background pr-2 pl-5 text-sm whitespace-nowrap shadow-sm">
              <span className="shrink-0 text-muted-foreground select-none">$</span>
              <span className="font-mono">{INSTALL}</span>
              <CopyButton value={INSTALL} className="static shrink-0" />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Link
                href="/builder"
                className={`${PILL} bg-gradient-to-br from-sky-600 to-sky-800 text-white shadow-[0_6px_18px_-6px_oklch(0.5_0.13_245/0.6)] hover:from-sky-500 hover:to-sky-700`}
              >
                Build a command
              </Link>
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noreferrer"
                className={`${PILL} border bg-background hover:bg-muted`}
              >
                <Icons.gitHub className="size-4" />
                View on GitHub
              </a>
            </div>
          </div>
          <TerminalCast className="min-w-0" />
        </div>
      </section>

      <Section
        id="stack"
        eyebrow="What it writes"
        title="Four workspaces, already wired together."
        lede="The scaffolder does not hand you an empty monorepo. The proxy between the two apps, the auth config, and the database client are configured against each other in the files it writes."
      >
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {WORKSPACES.map((item) => (
            <div key={item.path} className="rounded-xl border bg-card p-5">
              <span className="inline-block rounded-full border bg-muted px-2.5 py-0.5 font-mono text-xs text-muted-foreground">
                {item.path}
              </span>
              <h3 className="mt-4 text-base font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Dependencies"
        title="One lockfile, one install."
        lede="pnpm workspaces and Turborepo hold the versions, and CI scaffolds ten flag combinations on every change to check that they still install, lint, build and boot. Give a chip a click."
      >
        <div className="mt-10 h-[20rem] sm:h-[26rem]">
          <LogoRain density={2} />
        </div>
      </Section>

      <Section
        id="flow"
        eyebrow="Request flow"
        title="One origin in development."
        lede="Two dev servers run, but the browser only sees one of them."
        tinted
      >
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {FLOW.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-sky-200 bg-card p-6 shadow-[0_10px_28px_-14px_oklch(0.5_0.12_245/0.35)] dark:border-sky-900"
            >
              <strong className="block text-lg leading-snug font-semibold text-sky-800 dark:text-sky-300">
                {item.title}
              </strong>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="builder"
        eyebrow="Command builder"
        title="Pick the stack, copy the command."
        lede="Every prompt the CLI asks is also a flag. Toggle the options and the tree shows the files create-newt-app writes for that answer set."
      >
        <div className="mt-10 rounded-xl border bg-card p-2 shadow-lg">
          {/* nuqs reads useSearchParams, which needs a boundary on a
              statically rendered page */}
          <Suspense>
            <InteractiveFileTree />
          </Suspense>
        </div>
      </Section>

      <Section
        eyebrow="About"
        title="A scaffolder, not a template repository."
        lede={
          <>
            A template repository has one shape. This one has an answer for each of nine questions,
            and the files change with them: <C>--nest off</C> writes no <C>apps/api</C> at all and
            moves the backend into Next.js route handlers, <C>--deployment spa</C> hands a static
            export to Nest to serve, and <C>--database postgres</C> swaps the Kysely dialect and the
            migration runner.
          </>
        }
      >
        <p className="mt-4 max-w-[62ch] text-lg text-muted-foreground">
          Combinations the CLI cannot honour are rejected before anything is written rather than
          scaffolded broken. The rest are checked in CI, which scaffolds them, installs, lints,
          builds, boots the result and probes its routes.
        </p>
      </Section>
    </>
  );
}
