import { CopyButton } from "@/components/copy-button";
import { InteractiveFileTree } from "@/components/interactive-file-tree";
import Image from "next/image";
import { Suspense } from "react";
import LogoRain from "@/components/logo-rain";
import { version as cliVersion } from "../../../packages/create-newt-app/package.json";

export default function Home() {
  return (
    <div>
      {/* the tank fills the screen below the header and grows past it when the
          builder needs the room, so the card sits on the tank rather than being
          pulled onto it by a negative margin */}
      <section className="relative flex min-h-[calc(100svh_-_var(--header-height))] items-start justify-center overflow-hidden border-b bg-background pt-12 pb-16 sm:pt-24">
        {/* the tank is exactly the screen below the header, never the section:
            the section grows to hold the builder, and letting the tank grow
            with it would drag its floor, and the chips resting on it, below the
            fold. The builder is meant to hang out of the tank's bottom edge. */}
        <div className="pointer-events-none absolute inset-x-5 top-5 z-0 h-[calc(100svh_-_var(--header-height)_-_2.5rem)] overflow-hidden border">
          <LogoRain />
        </div>
        {/* px-6 clears the tank's inset-5 walls, so the card lands on the tank
            rather than poking out past it on narrow screens */}
        <div className="pointer-events-none relative z-10 flex w-full max-w-[1200px] flex-col items-center gap-5 px-6">
          <a
            href="https://www.npmjs.com/package/create-newt-app"
            target="_blank"
            rel="noreferrer"
            className="pointer-events-auto font-mono text-sm text-muted-foreground transition-colors hover:text-foreground hover:underline"
          >
            create-newt-app v{cliVersion} on npm
          </a>
          {/* px-4 keeps the longest wrapped line clear of the inset-5 frame */}
          <h1 className="max-w-4xl px-4 text-center text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl lg:leading-[1.1] xl:text-7xl xl:tracking-tighter">
            A production-grade, <span className="whitespace-nowrap">monorepo-first</span> starter
            for{" "}
            <span className="inline-flex items-center -space-x-2.5 align-middle xl:-space-x-4">
              <span
                title="Next.js"
                className="z-[0] inline-flex size-10 items-center justify-center rounded-full border-2 border-background bg-foreground sm:size-12 xl:size-16"
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
                className="z-[1] inline-flex size-10 items-center justify-center rounded-full border-2 border-background bg-foreground sm:size-12 xl:size-16"
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
                className="z-[2] inline-flex size-10 items-center justify-center rounded-full border-2 border-background bg-foreground sm:size-12 xl:size-16"
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
                className="z-[3] inline-flex size-10 items-center justify-center rounded-full border-2 border-background bg-foreground sm:size-12 xl:size-16"
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
                className="z-[4] inline-flex size-10 items-center justify-center rounded-full border-2 border-background bg-foreground sm:size-12 xl:size-16"
              >
                <Image src="/logos/oxc.svg" alt="oxc" width={32} height={32} className="size-3/5" />
              </span>
            </span>
          </h1>
          <div className="pointer-events-auto flex h-11 items-center gap-2 rounded-none border bg-code pr-2 pl-4 text-sm whitespace-nowrap text-foreground">
            <span className="pointer-events-none shrink-0 text-muted-foreground select-none">
              $
            </span>
            <span className="font-mono">npm create newt-app</span>
            <CopyButton value={"npm create newt-app"} className="static shrink-0" />
          </div>
          {/* the column is pointer-events-none so the chips stay clickable
              through it; the builder has to opt back in */}
          <div className="pointer-events-auto mt-16 w-full rounded-lg border bg-background p-4 shadow-lg">
            <div className="p-4">
              {/* nuqs reads useSearchParams, which needs a boundary on a
                  statically rendered page */}
              <Suspense>
                <InteractiveFileTree />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
