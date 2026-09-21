import Link from "next/link";
import { Suspense } from "react";
import { CopyButton } from "@/components/copy-button";
import { Icons } from "@/components/icons";
import { InteractiveFileTree } from "@/components/interactive-file-tree";
import { TerminalCast } from "@/components/terminal-cast";
import { siteConfig } from "@/lib/config";
import { version as cliVersion } from "../../../packages/create-newt-app/package.json";

const INSTALL = "npm create newt-app";

const PILL =
  "inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors";

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
              <span className="size-2 rounded-full bg-green-500" />v{cliVersion} on npm
              <span aria-hidden>→</span>
            </a>
            <h1 className="mt-6 text-4xl leading-[1.12] font-semibold tracking-tight text-balance sm:text-5xl xl:text-[2.85rem]">
              One command.{" "}
              <span className="text-sky-700 dark:text-sky-400">
                Next.js on :3000, NestJS on :3001.
              </span>
            </h1>
            <p className="mt-5 max-w-[56ch] text-base leading-relaxed text-muted-foreground lg:text-lg">
              A pnpm workspace with Next.js, NestJS, Better Auth and Kysely, wired together.
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
                GitHub
              </a>
            </div>
          </div>
          <TerminalCast className="min-w-0" />
        </div>
      </section>

      <section id="builder" className="scroll-mt-(--header-height) border-b">
        <div className="container py-14 sm:py-20">
          <p className="mb-3 font-mono text-xs font-semibold tracking-[0.18em] text-sky-700 uppercase dark:text-sky-400">
            Builder
          </p>
          <h2 className="max-w-[30ch] text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Pick the stack.
          </h2>
          <p className="mt-4 max-w-[62ch] text-lg text-muted-foreground">
            Every prompt is also a flag. The tree shows what gets written.
          </p>
          <div className="mt-10 rounded-xl border bg-card p-2 shadow-lg">
            {/* nuqs reads useSearchParams, which needs a boundary on a
                statically rendered page */}
            <Suspense>
              <InteractiveFileTree />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
}
