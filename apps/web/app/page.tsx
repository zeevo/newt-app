import { CodeShowcase } from "@/components/code-showcase";
import { CopyButton } from "@/components/copy-button";
import { FeatureSection } from "@/components/feature-section";
import { InlineCode } from "@/components/inline-code";
import { InteractiveFileTree } from "@/components/interactive-file-tree";
import { Section } from "@/components/section";
import Image from "next/image";
import { Suspense } from "react";
import LogoRain from "@/components/logo-rain";
import { ScaffolderCompass } from "@/components/scaffolder-compass";
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
    role: "handles the backend.",
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
      className="size-4 shrink-0 bg-foreground"
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
            className="pointer-events-auto flex items-center gap-2 rounded-full border bg-background/80 py-1.5 pr-3 pl-4 text-sm text-muted-foreground shadow-sm backdrop-blur transition-colors hover:text-foreground"
          >
            <span className="size-2 rounded-full bg-green-500" />
            Latest update · v{cliVersion} released
            <span aria-hidden>→</span>
          </a>
          {/* px-4 keeps the longest wrapped line clear of the inset-5 frame */}
          <h1 className="max-w-4xl bg-linear-to-r from-foreground to-muted-foreground bg-clip-text px-4 text-center text-4xl font-semibold tracking-tight text-balance text-transparent sm:text-5xl lg:leading-[1.1] xl:text-7xl xl:tracking-tighter">
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
          <div className="pointer-events-auto flex h-11 items-center gap-2 rounded-full border bg-background pr-2 pl-5 text-sm whitespace-nowrap text-foreground shadow-sm">
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
      <Section>
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STACK.map((item) => (
            <div key={item.name} className="flex flex-col gap-1.5 rounded-lg border p-5">
              <dt className="flex items-center gap-2 font-mono text-sm font-medium">
                <StackLogo src={item.logo} />
                {item.name}
              </dt>
              <dd className="text-sm leading-relaxed text-muted-foreground">{item.role}</dd>
            </div>
          ))}
        </dl>
      </Section>
      <Section>
        <FeatureSection wide="start">
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
              <InlineCode>@my-app/ui</InlineCode> and <InlineCode>@my-app/auth</InlineCode> resolve
              as workspace packages in both <InlineCode>apps/web</InlineCode> and{" "}
              <InlineCode>apps/api</InlineCode>.
            </p>
          </div>
        </FeatureSection>
      </Section>
      <Section>
        <FeatureSection wide="end">
          <div className="flex flex-col justify-center gap-4">
            <h2 className="text-3xl leading-[1.1] font-bold tracking-tight text-balance sm:text-4xl">
              NestJS services in route handlers.
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              With <InlineCode>--nest-di-only</InlineCode>, route handlers resolve providers through{" "}
              <InlineCode>inject()</InlineCode>, so logic stays in NestJS services.
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
      </Section>
      <Section>
        <FeatureSection wide="start">
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
              Better Auth is configured once in <InlineCode>packages/auth</InlineCode> and imported
              by <InlineCode>apps/web</InlineCode> and <InlineCode>apps/api</InlineCode>. NestJS
              routes are guarded by default; opt out per route with{" "}
              <InlineCode>@AllowAnonymous</InlineCode> or <InlineCode>@OptionalAuth</InlineCode>.
            </p>
          </div>
        </FeatureSection>
      </Section>
      <Section>
        <FeatureSection split="lg">
          <ScaffolderCompass />
          <div className="flex flex-col justify-center gap-4">
            <h2 className="text-3xl leading-[1.1] font-bold tracking-tight text-balance sm:text-4xl">
              Where newt-app sits.
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              Two questions decide whether a starter is worth adopting: is the architecture this
              generation&apos;s, and how much do you have to understand to change it?
            </p>
            <p className="leading-relaxed text-muted-foreground">
              newt-app tracks the current majors: TypeScript 6, Next 16, NestJS 11. Business logic
              lives in controllers and services, persistence is SQL through{" "}
              <InlineCode>packages/db</InlineCode>, and there is no codegen step or inference chain
              between the two.
            </p>
          </div>
        </FeatureSection>
      </Section>
    </div>
  );
}
