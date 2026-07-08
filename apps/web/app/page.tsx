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
      <section className="relative flex h-[775px] items-start justify-center overflow-hidden border-b bg-background pt-24 sm:pt-34">
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
          <h1 className="max-w-5xl bg-linear-to-r from-foreground to-muted-foreground bg-clip-text text-center text-4xl font-semibold tracking-tight text-balance text-transparent sm:text-5xl lg:leading-[1.1] xl:text-7xl xl:tracking-tighter">
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
                title="Tailwind CSS"
                className="z-[4] inline-flex size-10 items-center justify-center rounded-full border-2 border-background bg-foreground sm:size-12 xl:size-16"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  role="img"
                  aria-label="Tailwind CSS"
                  className="size-3/5 text-[#38bdf8]"
                >
                  <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624C10.337,13.382,8.976,12,6.001,12z" />
                </svg>
              </span>
            </span>
          </h1>
          <p className="max-w-2xl text-center text-lg text-balance text-muted-foreground lg:max-w-3xl lg:text-xl">
            newt-app scaffolds everything you want and nothing you don&apos;t —
            Next.js, NestJS, Better Auth, and shadcn/ui, wired together in one
            TypeScript monorepo.
          </p>
          <div className="flex h-11 items-center gap-2 rounded-full border bg-background pr-2 pl-5 text-sm whitespace-nowrap text-foreground shadow-sm">
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
      <section className="bg-code">
        <div className="relative mx-4 -mt-40 max-w-[1200px] rounded-lg border bg-background p-4 shadow-lg xl:mx-auto">
          <div className="flex flex-col justify-between p-4 sm:flex-row">
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
            <div className="flex flex-1 flex-col gap-8 p-4">
              <h2 className="text-3xl leading-[1.1] font-bold tracking-tight text-balance sm:text-4xl">
                A Project Structure for modern TypeScript
              </h2>
              <p className="leading-relaxed text-muted-foreground">
                newt-app scaffolds a monorepo with a Next.js frontend, a NestJS
                API, and a shared UI package, all wired together from day one.
                No manual tsconfig paths, no copy-pasted ESLint configs, no
                guessing how packages reference each other.
              </p>
              <p className="leading-relaxed text-muted-foreground">
                Shared components live in <InlineCode>packages/ui</InlineCode>,
                auth config in <InlineCode>packages/auth</InlineCode>, and each
                app imports them by package name.
              </p>
            </div>
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
