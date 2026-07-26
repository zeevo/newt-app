import { CodeShowcase } from '@/components/code-showcase';
import { CopyButton } from '@/components/copy-button';
import { FeatureSection } from '@/components/feature-section';
import { InlineCode } from '@/components/inline-code';
import { InteractiveFileTree } from '@/components/interactive-file-tree';
import Image from 'next/image';
import LogoRain from '@/components/logo-rain';
import { SiteFooter } from '@/components/site-footer';
import { version as cliVersion } from '../../../packages/create-newt-app/package.json';

export default function Home() {
  return (
    <div>
      <section className="relative flex h-[775px] items-start justify-center overflow-hidden border-b bg-background pt-12 sm:pt-24">
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            maskImage: [
              'linear-gradient(to bottom, transparent 0%, black 12%)',
              'linear-gradient(to left, transparent 0%, black 10%)',
              'linear-gradient(to top, transparent 0%, black 10%)',
            ].join(', '),
            WebkitMaskImage: [
              'linear-gradient(to bottom, transparent 0%, black 12%)',
              'linear-gradient(to left, transparent 0%, black 10%)',
              'linear-gradient(to top, transparent 0%, black 10%)',
            ].join(', '),
          }}
        >
          <LogoRain />
        </div>
        <div className="pointer-events-none relative z-10 flex flex-col items-center gap-5 px-4">
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
          <h1 className="max-w-4xl bg-linear-to-r from-foreground to-muted-foreground bg-clip-text text-center text-4xl font-semibold tracking-tight text-balance text-transparent sm:text-5xl lg:leading-[1.1] xl:text-7xl xl:tracking-tighter">
            A production-grade, <span className="whitespace-nowrap">monorepo-first</span> starter for{' '}
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
                <Image src="/logos/nestjs.svg" alt="NestJS" width={32} height={32} className="size-3/5" />
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
          <p className="max-w-lg text-center text-lg text-balance text-muted-foreground lg:max-w-xl lg:text-xl">
            newt-app gives you a Next.js frontend and a real NestJS backend,
            with auth and a database, curated so you&apos;re not deleting half
            of it on day one.
          </p>
          <div className="pointer-events-auto flex h-11 items-center gap-2 rounded-full border bg-background pr-2 pl-5 text-sm whitespace-nowrap text-foreground shadow-sm">
            <span className="pointer-events-none shrink-0 text-muted-foreground select-none">
              $
            </span>
            <span className="font-mono">npm create newt-app</span>
            <CopyButton
              value={'npm create newt-app'}
              className="static shrink-0"
            />
          </div>
        </div>
      </section >
      <section className="bg-code pb-16">
        <div className="relative mx-4 -mt-20 max-w-[1200px] rounded-lg border bg-background p-4 shadow-lg xl:mx-auto">
          <div className="p-4">
            <InteractiveFileTree />
          </div>
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
                Share code between apps, not copy it.
              </h2>
              <p className="leading-relaxed text-muted-foreground">
                <InlineCode>@my-app/ui</InlineCode> and{' '}
                <InlineCode>@my-app/auth</InlineCode> are importable by name
                from day one, in both <InlineCode>apps/web</InlineCode> and{' '}
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
                A structure that can scale.
              </h2>
              <p className="leading-relaxed text-muted-foreground">
                Inject NestJS services directly inside Next.js route handlers.
                Keep your business logic separate from your frontend, organized
                into modules and providers from day one.
              </p>
              <p className="leading-relaxed text-muted-foreground">
                Add services, swap implementations, or move to a standalone API
                when you&apos;re ready.
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
      <div className="bg-background">
        <SiteFooter />
      </div>
    </div >
  );
}
