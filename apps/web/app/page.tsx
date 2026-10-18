import Image from "next/image";
import Link from "next/link";
import { CopyButton } from "@/components/copy-button";
import LogoRain from "@/components/logo-rain";
import { TerminalCast } from "@/components/terminal-cast";
import { siteConfig } from "@/lib/config";
import { version as cliVersion } from "../../../packages/create-newt-app/package.json";

const INSTALL = "npm create newt-app";

const FLAGS = [
  { flag: "--database", values: "sqlite · postgres" },
  { flag: "--linter", values: "oxc · eslint" },
  { flag: "--testing", values: "jest · vitest" },
  { flag: "--deployment", values: "none · standalone · spa" },
];

export default function Home() {
  return (
    <>
      <section className="relative flex flex-1 items-center overflow-hidden">
        <div aria-hidden className="hero-wash pointer-events-none absolute inset-0 -z-10" />
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-50">
          <LogoRain border={false} chipScale={0.55} />
        </div>
        <div className="relative grid w-full items-center gap-10 px-4 py-14 lg:grid-cols-[1fr_1.05fr] lg:gap-12 lg:px-8 lg:py-20">
          <div>
            <p className="flex items-center gap-3.5 text-xs tracking-[0.3em] text-primary uppercase">
              <span aria-hidden className="h-px w-10 bg-primary" />
              create-newt-app
            </p>
            <h1 className="mt-6 text-4xl leading-[1.02] font-bold tracking-tight text-balance sm:text-5xl xl:text-6xl">
              The TypeScript project scaffolder for{" "}
              <span className="inline-flex items-center -space-x-1.5 align-middle sm:-space-x-2">
                <span
                  title="Next.js"
                  className="z-[0] inline-flex size-8 items-center justify-center rounded-full border-2 border-background bg-foreground sm:size-11"
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
                  className="z-[1] inline-flex size-8 items-center justify-center rounded-full border-2 border-background bg-foreground sm:size-11"
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
                  className="z-[2] inline-flex size-8 items-center justify-center rounded-full border-2 border-background bg-foreground sm:size-11"
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
                  className="z-[3] inline-flex size-8 items-center justify-center rounded-full border-2 border-background bg-foreground sm:size-11"
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
                  className="z-[4] inline-flex size-8 items-center justify-center rounded-full border-2 border-background bg-foreground sm:size-11"
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
            <p className="mt-6 max-w-[50ch] leading-relaxed text-muted-foreground">
              {siteConfig.description}
            </p>
            <div className="mt-8 flex w-fit max-w-full items-stretch border bg-background/80 text-sm backdrop-blur-sm">
              <code className="flex items-center px-4 py-3 whitespace-nowrap">
                <span className="mr-2.5 text-primary select-none">$</span>
                {INSTALL}
              </code>
              <div className="flex items-center border-l px-1.5">
                <CopyButton value={INSTALL} className="static rounded-none bg-transparent" />
              </div>
            </div>
            <p className="mt-4 text-xs tracking-wide text-muted-foreground">
              <a
                href={siteConfig.links.npm}
                target="_blank"
                rel="noreferrer"
                className="hover:text-foreground"
              >
                v{cliVersion} on npm
              </a>{" "}
              · MIT ·{" "}
              <Link href="/builder" className="text-primary hover:underline">
                pick flags in the builder →
              </Link>
            </p>
          </div>
          <TerminalCast className="min-w-0 rounded-none" />
        </div>
      </section>
      <div className="grid grid-cols-2 border-t lg:grid-cols-4">
        {FLAGS.map(({ flag, values }) => (
          <Link
            key={flag}
            href="/builder"
            className="border-b px-4 py-6 transition-colors odd:border-r hover:bg-primary/5 lg:border-r lg:border-b-0 lg:px-8 lg:last:border-r-0"
          >
            <span className="block text-base font-bold tracking-tight sm:text-xl">{values}</span>
            <span className="mt-2 block text-xs tracking-wide text-muted-foreground">{flag}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
