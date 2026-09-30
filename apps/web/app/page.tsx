import Image from "next/image";
import Link from "next/link";
import { Button } from "@newt-app/ui/components/button";
import { CopyButton } from "@/components/copy-button";
import { Icons } from "@/components/icons";
import LogoRain from "@/components/logo-rain";
import { TerminalCast } from "@/components/terminal-cast";
import { siteConfig } from "@/lib/config";
import { version as cliVersion } from "../../../packages/create-newt-app/package.json";

const INSTALL = "npm create newt-app";

export default function Home() {
  return (
    <>
      <section className="relative flex min-h-[calc(100svh-var(--header-height))] items-center overflow-hidden">
        <div aria-hidden className="hero-wash pointer-events-none absolute inset-0 -z-10" />
        {/* the tank's own canvas opts pointer events back in, so the chips stay
            clickable wherever the content leaves them uncovered */}
        <div className="pointer-events-none absolute inset-0">
          <LogoRain border={false} occluder="[data-eclipse]" />
        </div>
        <div className="pointer-events-none relative container grid w-full items-center gap-8 py-10 lg:grid-cols-[1fr_1.12fr] lg:gap-12 lg:py-12 *:pointer-events-auto">
          <div data-eclipse>
            <a
              href={siteConfig.links.npm}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border bg-background/80 py-1 pr-2.5 pl-3.5 text-xs text-muted-foreground shadow-sm backdrop-blur transition-colors hover:text-foreground"
            >
              <span className="size-1.5 rounded-full bg-green-500" />v{cliVersion} on npm
              <span aria-hidden>→</span>
            </a>
            <h1 className="mt-5 text-3xl leading-[1.12] font-semibold tracking-tight text-balance sm:text-4xl">
              The TypeScript project scaffolder for{" "}
              <span className="inline-flex items-center -space-x-1.5 align-middle sm:-space-x-2">
                <span
                  title="Next.js"
                  className="z-[0] inline-flex size-6 items-center justify-center rounded-full border-2 border-background bg-foreground sm:size-8"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    role="img"
                    aria-label="Next.js"
                    className="size-3/5 text-background"
                  >
                    <path d="M18.665 21.978C16.758 23.255 14.465 24 12 24 5.377 24 0 18.623 0 12S5.377 0 12 0s12 5.377 12 12c0 3.583-1.574 6.801-4.067 9.001L9.219 7.2H7.2v9.596h1.615V9.251l9.85 12.727Zm-3.332-8.533 1.6 2.061V7.2h-1.6v6.245Z" />
                  </svg>
                </span>
                <span
                  title="NestJS"
                  className="z-[1] inline-flex size-6 items-center justify-center rounded-full border-2 border-background bg-foreground sm:size-8"
                >
                  <Image
                    src="/logos/nestjs.svg"
                    alt="NestJS"
                    width={32}
                    height={32}
                    className="size-3/5"
                  />
                </span>
                <span
                  title="Better Auth"
                  className="z-[2] inline-flex size-6 items-center justify-center rounded-full border-2 border-background bg-foreground sm:size-8"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    role="img"
                    aria-label="Better Auth"
                    className="size-3/5 text-background"
                  >
                    <path d="M0 3.39v17.22h5.783V15.06h6.434V8.939H5.783V3.39ZM12.217 8.94h5.638v6.122h-5.638v5.548H24V3.391H12.217Z" />
                  </svg>
                </span>
                <span
                  title="shadcn/ui"
                  className="z-[3] inline-flex size-6 items-center justify-center rounded-full border-2 border-background bg-foreground sm:size-8"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    role="img"
                    aria-label="shadcn/ui"
                    className="size-3/5 text-background"
                  >
                    <path d="M22.219 11.784 11.784 22.219c-.407.407-.407 1.068 0 1.476.407.407 1.068.407 1.476 0L23.695 13.26c.407-.408.407-1.069 0-1.476-.408-.407-1.069-.407-1.476 0ZM20.132.305.305 20.132c-.407.407-.407 1.068 0 1.476.408.407 1.069.407 1.476 0L21.608 1.781c.407-.407.407-1.068 0-1.476-.408-.407-1.069-.407-1.476 0Z" />
                  </svg>
                </span>
                <span
                  title="oxc"
                  className="z-[4] inline-flex size-6 items-center justify-center rounded-full border-2 border-background bg-foreground sm:size-8"
                >
                  <Image
                    src="/logos/oxc.svg"
                    alt="oxc"
                    width={32}
                    height={32}
                    className="size-3/5"
                  />
                </span>
              </span>
            </h1>
            <p className="mt-4 max-w-[56ch] text-sm leading-relaxed text-muted-foreground lg:text-base">
              A pnpm workspace with Next.js, NestJS, Better Auth and Kysely, wired together.
            </p>
            <div className="mt-6 flex h-9 w-fit items-center gap-2 rounded-full border bg-background pr-1.5 pl-4 text-sm whitespace-nowrap shadow-sm">
              <span className="shrink-0 text-muted-foreground select-none">$</span>
              <span className="font-mono">{INSTALL}</span>
              <CopyButton value={INSTALL} className="static shrink-0" />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2.5">
              <Button
                size="lg"
                className="h-9 rounded-full px-4"
                nativeButton={false}
                render={<Link href="/builder" />}
              >
                Build a command
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-9 rounded-full px-4"
                nativeButton={false}
                render={<Link href={siteConfig.links.github} target="_blank" rel="noreferrer" />}
              >
                <Icons.gitHub />
                GitHub
              </Button>
            </div>
          </div>
          <TerminalCast className="min-w-0" />
        </div>
      </section>
    </>
  );
}
