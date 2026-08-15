import { CodeShowcase } from "@/components/code-showcase";
import { CopyButton } from "@/components/copy-button";
import { FeatureSection } from "@/components/feature-section";
import { InlineCode } from "@/components/inline-code";
import { InteractiveFileTree } from "@/components/interactive-file-tree";
import Image from "next/image";
import { Suspense } from "react";
import LogoRain from "@/components/logo-rain";
import { version as cliVersion } from "../../../packages/create-newt-app/package.json";

const STACK = [
  {
    name: "Next.js",
    logo: "/logos/nextjs.svg",
    role: "handles the frontend. App Router, server components, file-based routing.",
  },
  {
    name: "NestJS",
    logo: "/logos/nestjs.svg",
    role: "handles the backend. Structured, testable, scales when you need it to.",
  },
  {
    name: "Better Auth",
    logo: "/logos/better-auth.svg",
    role: "handles authentication. One config in packages/auth, imported by both apps.",
  },
  {
    name: "Kysely",
    logo: "/logos/kysely.svg",
    role: "handles persistence. A typed query builder over SQLite or Postgres, shared by auth and your app.",
  },
  {
    name: "pnpm workspaces",
    logo: "/logos/pnpm.svg",
    role: "link the packages. apps/ for runnable apps, packages/ for shared code.",
  },
  {
    name: "Turborepo",
    logo: "/logos/turborepo.svg",
    role: "caches and parallelizes builds across the workspace.",
  },
];

// the marks are solid-black source files, so they are masked into the current
// foreground colour rather than drawn, which keeps them legible in both themes
function StackLogo({ src }: { src: string }) {
  return (
    <span
      aria-hidden
      className="size-4 shrink-0 bg-foreground transition-colors group-hover:bg-cyan-600 dark:group-hover:bg-cyan-400"
      style={{
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
  );
}

// L-marks at the tank's corners, so the frame reads as a HUD rather than a box
function HudCorners() {
  return (
    <>
      {[
        "top-0 left-0 border-t-2 border-l-2",
        "top-0 right-0 border-t-2 border-r-2",
        "bottom-0 left-0 border-b-2 border-l-2",
        "bottom-0 right-0 border-b-2 border-r-2",
      ].map((corner) => (
        <span
          key={corner}
          aria-hidden
          className={`absolute z-[2] size-6 border-cyan-600 dark:border-cyan-400 ${corner}`}
        />
      ))}
    </>
  );
}

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
        <div className="hero-scanlines pointer-events-none absolute inset-x-5 top-5 z-0 h-[calc(100svh_-_var(--header-height)_-_2.5rem)] overflow-hidden border border-cyan-600/30 dark:border-cyan-400/30">
          <LogoRain />
          <HudCorners />
        </div>
        {/* px-6 clears the tank's inset-5 walls, so the card lands on the tank
            rather than poking out past it on narrow screens */}
        <div className="pointer-events-none relative z-10 flex w-full max-w-[1200px] flex-col items-center gap-5 px-6">
          <a
            href="https://www.npmjs.com/package/create-newt-app"
            target="_blank"
            rel="noreferrer"
            className="group pointer-events-auto flex items-center gap-2.5 rounded-sm border border-cyan-600/40 bg-background/80 py-1.5 pr-3 pl-4 font-mono text-xs tracking-widest text-muted-foreground uppercase shadow-[0_0_24px_-8px_rgb(34_211_238/0.9)] backdrop-blur transition-colors hover:border-cyan-600/70 hover:text-foreground dark:border-cyan-400/40 dark:hover:border-cyan-400/70"
          >
            <span className="size-1.5 rounded-full bg-cyan-600 shadow-[0_0_7px_rgb(34_211_238)] dark:bg-cyan-400" />
            Latest update · v{cliVersion} released
            <span
              aria-hidden
              className="text-fuchsia-600 transition-transform group-hover:translate-x-0.5 dark:text-fuchsia-400"
            >
              →
            </span>
          </a>
          {/* px-4 keeps the longest wrapped line clear of the inset-5 frame */}
          <h1 className="max-w-4xl bg-linear-to-r from-foreground via-muted-foreground to-cyan-600 bg-clip-text px-4 text-center text-4xl font-semibold tracking-tight text-balance text-transparent sm:text-5xl lg:leading-[1.1] xl:text-7xl xl:tracking-tighter dark:to-cyan-400">
            A production-grade,{" "}
            <span className="whitespace-nowrap">monorepo-first</span> starter
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
          <div className="pointer-events-auto flex h-11 items-center gap-2 rounded-sm border border-cyan-600/40 bg-background pr-2 pl-4 text-sm whitespace-nowrap text-foreground shadow-[0_0_32px_-10px_rgb(34_211_238/0.9)] dark:border-cyan-400/40">
            <span className="pointer-events-none shrink-0 font-mono text-cyan-600 select-none dark:text-cyan-400">
              $
            </span>
            <span className="font-mono">npm create newt-app</span>
            <span
              aria-hidden
              className="terminal-cursor -ml-1 h-4 w-2 shrink-0 bg-fuchsia-600 dark:bg-fuchsia-400"
            />
            <CopyButton
              value={"npm create newt-app"}
              className="static shrink-0"
            />
          </div>
          {/* the column is pointer-events-none so the chips stay clickable
              through it; the builder has to opt back in */}
          <div className="pointer-events-auto mt-16 w-full rounded-md border border-cyan-600/25 bg-background p-4 shadow-[0_0_70px_-30px_rgb(34_211_238/0.9)] dark:border-cyan-400/25">
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
      <section className="border-t bg-background py-24">
        <div className="mx-auto max-w-[1200px] px-4">
          {/* gap-px over a border-coloured bed, so the cells share hairlines
              instead of each carrying its own outline. The cells' hover tint
              has to stay opaque or the bed shows through it. */}
          <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-md border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {STACK.map((item, index) => (
              <div
                key={item.name}
                className="group relative flex flex-col gap-2 bg-background p-5 transition-colors hover:bg-cyan-50 dark:hover:bg-cyan-950"
              >
                <span
                  aria-hidden
                  className="absolute inset-y-0 left-0 w-0.5 bg-cyan-600 opacity-0 transition-opacity group-hover:opacity-100 dark:bg-cyan-400"
                />
                <dt className="flex items-center gap-2.5 font-mono text-sm font-medium">
                  <span className="text-cyan-600 transition-colors group-hover:text-fuchsia-600 dark:text-cyan-400 dark:group-hover:text-fuchsia-400">
                    {String(index).padStart(2, "0")}
                  </span>
                  <StackLogo src={item.logo} />
                  {item.name}
                </dt>
                <dd className="text-sm leading-relaxed text-muted-foreground">
                  {item.role}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <section className="border-t bg-background py-24">
        <div className="mx-auto max-w-[1200px] px-4">
          <FeatureSection>
            <CodeShowcase
              filename="apps/web/app/dashboard/page.tsx"
              language="tsx"
              code={`import { Button } from '@my-app/ui/components/button';
import { cn } from '@my-app/ui/lib/utils';
import { auth } from '@my-app/auth';
import { headers } from 'next/headers';

export default async function Dashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <main className={cn('flex min-h-screen flex-col p-8')}>
      <h1>Welcome back, {session?.user.name}</h1>
      <Button variant="outline">Sign out</Button>
    </main>
  );
}`}
            />
            <div className="flex flex-col justify-center gap-4">
              <h2 className="text-3xl leading-[1.1] font-bold tracking-tight text-balance sm:text-4xl">
                Shared packages, imported by name.
              </h2>
              <p className="leading-relaxed text-muted-foreground">
                <InlineCode>@my-app/ui</InlineCode> and{" "}
                <InlineCode>@my-app/auth</InlineCode> resolve as workspace
                packages in both <InlineCode>apps/web</InlineCode> and{" "}
                <InlineCode>apps/api</InlineCode>.
              </p>
              <p className="leading-relaxed text-muted-foreground">
                No relative path climbing, no publishing to a registry, no
                manual workspace links.
              </p>
            </div>
          </FeatureSection>
        </div>
      </section>
      <section className="border-t bg-background py-24">
        <div className="mx-auto max-w-[1200px] px-4">
          <FeatureSection>
            <div className="flex flex-col justify-center gap-4">
              <h2 className="text-3xl leading-[1.1] font-bold tracking-tight text-balance sm:text-4xl">
                NestJS services in route handlers.
              </h2>
              <p className="leading-relaxed text-muted-foreground">
                In di-only mode, route handlers resolve providers through{" "}
                <InlineCode>inject()</InlineCode>, so business logic stays in
                NestJS modules and services instead of the route file.
              </p>
              <p className="leading-relaxed text-muted-foreground">
                The same modules run behind a standalone HTTP server if you
                scaffold without <InlineCode>--nest-di-only</InlineCode>.
              </p>
            </div>
            <CodeShowcase
              filename="apps/web/app/api/todos/route.ts"
              language="tsx"
              code={`import { NextResponse } from 'next/server';
import { inject } from '@/lib/nest';
import { TodosService } from '@my-app/api';

export async function GET() {
  const todos = await inject(TodosService);
  return NextResponse.json(todos.findAll());
}

export async function POST(req: Request) {
  const { title } = await req.json();
  const todos = await inject(TodosService);
  return NextResponse.json(todos.create(title), { status: 201 });
}`}
            />
          </FeatureSection>
        </div>
      </section>
      <section className="border-t bg-background py-24">
        <div className="mx-auto max-w-[1200px] px-4">
          <FeatureSection>
            <CodeShowcase
              filename="apps/api/src/users/users.controller.ts"
              language="ts"
              code={`import { Session, UserSession, AllowAnonymous } from '@thallesp/nestjs-better-auth';

@Controller('users')
export class UserController {
  @Get('me')
  getProfile(@Session() session: UserSession) {
    return { user: session.user };
  }

  @Get('public')
  @AllowAnonymous()
  getPublic() {
    return { message: 'Public route' };
  }
}`}
            />
            <div className="flex flex-col justify-center gap-4">
              <h2 className="text-3xl leading-[1.1] font-bold tracking-tight text-balance sm:text-4xl">
                One auth config, both apps.
              </h2>
              <p className="leading-relaxed text-muted-foreground">
                Better Auth is configured once in{" "}
                <InlineCode>packages/auth</InlineCode> and imported by{" "}
                <InlineCode>apps/web</InlineCode> and{" "}
                <InlineCode>apps/api</InlineCode>. NestJS routes are guarded by
                default; opt out per route with{" "}
                <InlineCode>@AllowAnonymous</InlineCode> or{" "}
                <InlineCode>@OptionalAuth</InlineCode>.
              </p>
              <p className="leading-relaxed text-muted-foreground">
                Sessions, sign-up, and sign-in run on the same Kysely connection
                as your own tables, in <InlineCode>packages/db</InlineCode>.
              </p>
            </div>
          </FeatureSection>
        </div>
      </section>
    </div>
  );
}
