import { CodeShowcase } from '@/components/code-showcase';
import { CopyButton } from '@/components/copy-button';
import { FeatureSection } from '@/components/feature-section';
import { FileTree } from '@/components/file-tree';
import { InlineCode } from '@/components/inline-code';
import Image from 'next/image';
import LogoRain from '@/components/logo-rain';
import { SiteFooter } from '@/components/site-footer';
import { version as cliVersion } from '../../../packages/create-newt-app/package.json';

export default function Home() {
  return (
    <div>
      <section className="relative flex items-start justify-center pt-24 sm:pt-34 h-[775px] overflow-hidden border-b bg-background">
        <div
          className="absolute inset-0 pointer-events-none z-0"
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
        <div className="relative z-10 flex flex-col items-center gap-5 px-4">
          <a
            href="https://www.npmjs.com/package/create-newt-app"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-full border bg-background/80 py-1.5 pr-3 pl-4 text-sm text-muted-foreground shadow-sm backdrop-blur transition-colors hover:text-foreground"
          >
            <span className="size-2 rounded-full bg-green-500" />
            Latest update — v{cliVersion} released
            <span aria-hidden>→</span>
          </a>
          <h1 className="max-w-5xl pb-1 text-center text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:leading-[1.1] xl:text-7xl xl:tracking-tighter bg-linear-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            A production-grade, <span className="whitespace-nowrap">monorepo-first</span> starter for{' '}
            <span className="inline-flex translate-y-1 items-center -space-x-2.5 align-baseline xl:-space-x-4 xl:translate-y-2">
              <span
                title="Next.js"
                className="inline-flex size-10 items-center justify-center rounded-full border border-1 ring-muted z-[0] sm:size-12 xl:size-16"
              >
                <Image src="/logos/nextjs.svg" alt="Next.js" width={32} height={32} className="size-1/2" />
              </span>
              <span
                title="NestJS"
                className="inline-flex size-10 items-center justify-center rounded-full border border-1 ring-muted z-[1] sm:size-12 xl:size-16"
              >
                <Image src="/logos/nestjs.svg" alt="NestJS" width={32} height={32} className="size-1/2" />
              </span>
              <span
                title="Better Auth"
                className="inline-flex size-10 items-center justify-center rounded-full border border-1 ring-muted z-[2] sm:size-12 xl:size-16"
              >
                <Image src="/logos/better-auth.svg" alt="Better Auth" width={32} height={32} className="size-1/2" />
              </span>
              <span
                title="shadcn/ui"
                className="inline-flex size-10 items-center justify-center rounded-full border border-1 ring-muted z-[3] sm:size-12 xl:size-16"
              >
                <Image src="/logos/shadcn.svg" alt="shadcn/ui" width={32} height={32} className="size-1/2 brightness-0" />
              </span>
              <span
                title="Tailwind CSS"
                className="text-red-500 inline-flex size-10 items-center justify-center rounded-full border border-1 ring-muted z-[4] sm:size-12 xl:size-16"
              >
                <Image src="/logos/tailwind.svg" alt="Tailwind CSS" width={32} height={32} className="size-1/2 brightness-0" />
              </span>
            </span>
          </h1>
          <p className="text-center max-w-2xl lg:max-w-3xl text-lg lg:text-xl text-muted-foreground text-balance">
            newt-app scaffolds everything you want and nothing you don&apos;t —
            Next.js, NestJS, Better Auth, and shadcn/ui, wired together in one
            TypeScript monorepo.
          </p>
          <div className="mt-1 flex h-11 items-center gap-2 whitespace-nowrap rounded-full border bg-background pr-2 pl-5 text-foreground text-sm shadow-sm">
            <span className="pointer-events-none shrink-0 select-none text-muted-foreground">
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
      <section className="bg-code">
        <div className="relative border rounded-lg -mt-40 shadow-lg max-w-[1200px] mx-4 xl:mx-auto bg-background p-4">
          <div className="flex flex-col sm:flex-row justify-between p-4">
            <div className="flex-1">
              <FileTree
                name="my-app"
                className="my-0 bg-transparent p-0 dark:bg-transparent"
              >
                <FileTree.Folder name="apps">
                  <FileTree.Folder name="web" annotation="Next.js frontend">
                    <FileTree.Folder name="app">
                      <FileTree.Folder name="dashboard">
                        <FileTree.File
                          name="page.tsx"
                          annotation="dashboard route"
                        />
                      </FileTree.Folder>
                      <FileTree.File name="layout.tsx" />
                      <FileTree.File name="page.tsx" annotation="home route" />
                    </FileTree.Folder>
                  </FileTree.Folder>
                  <FileTree.Folder name="api" annotation="NestJS backend">
                    <FileTree.Folder name="src">
                      <FileTree.Folder name="hello">
                        <FileTree.File name="hello.controller.ts" />
                        <FileTree.File name="hello.module.ts" />
                      </FileTree.Folder>
                      <FileTree.File name="app.module.ts" />
                      <FileTree.File name="main.ts" />
                    </FileTree.Folder>
                  </FileTree.Folder>
                </FileTree.Folder>
                <FileTree.Folder name="packages">
                  <FileTree.Folder
                    name="ui"
                    annotation="Shared component library"
                  />
                  <FileTree.Folder
                    name="auth"
                    annotation="Better Auth configuration"
                  />
                  <FileTree.Folder
                    name="eslint-config"
                    annotation="Shared ESLint config"
                  />
                  <FileTree.Folder
                    name="typescript-config"
                    annotation="Shared TypeScript config"
                  />
                </FileTree.Folder>
              </FileTree>
            </div>
            <div className="flex-1 p-4 gap-8 flex flex-col">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-[1.1] text-balance">
                A Project Structure for modern TypeScript
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                newt-app scaffolds a monorepo with a Next.js frontend, a NestJS
                API, and a shared UI package, all wired together from day one.
                No manual tsconfig paths, no copy-pasted ESLint configs, no
                guessing how packages reference each other.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Shared components live in <InlineCode>packages/ui</InlineCode>,
                auth config in <InlineCode>packages/auth</InlineCode>, and each
                app imports them by package name.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-24 border-t bg-background">
        <div className="max-w-[1200px] mx-auto px-4">
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
            <div className="flex flex-col gap-4 justify-center">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-[1.1] text-balance">
                Share code between apps, not copy it.
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                <InlineCode>@my-app/ui</InlineCode> and{' '}
                <InlineCode>@my-app/auth</InlineCode> are importable by name
                from day one, in both <InlineCode>apps/web</InlineCode> and{' '}
                <InlineCode>apps/api</InlineCode>.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                No relative path climbing, no publishing to a registry, no
                manual workspace links.
              </p>
            </div>
          </FeatureSection>
        </div>
      </section>
      <section className="py-24 border-t bg-background">
        <div className="max-w-[1200px] mx-auto px-4">
          <FeatureSection>
            <div className="flex flex-col gap-4 justify-center">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-[1.1] text-balance">
                A structure that can scale.
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Inject NestJS services directly inside Next.js route handlers.
                Keep your business logic separate from your frontend, organized
                into modules and providers from day one.
              </p>
              <p className="text-muted-foreground leading-relaxed">
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
