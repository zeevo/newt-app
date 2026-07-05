import { CodeShowcase } from '@/components/code-showcase';
import { CopyButton } from '@/components/copy-button';
import { FeatureSection } from '@/components/feature-section';
import { FileTree } from '@/components/file-tree';
import { InlineCode } from '@/components/inline-code';
import LogoRain from '@/components/logo-rain';
import { SiteFooter } from '@/components/site-footer';

export default function Home() {
  return (
    <div>
      <section className="relative flex items-start justify-center pt-34 h-[775px] overflow-hidden border-b bg-background">
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
        <div className="relative z-10 flex flex-col items-center gap-2">
          <h1 className="pb-1 text-6xl font-semibold tracking-tight text-balance lg:leading-[1.1] xl:text-8xl xl:tracking-tighter bg-linear-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            newt-app
          </h1>
          <p className="text-center max-w-2xl lg:max-w-4xl text-lg lg:text-2xl text-muted-foreground text-balance">
            Everything you want. Nothing you don&apos;t need. The monorepo-first
            way to build full-stack TypeScript apps.
          </p>
          <div className="mt-2 flex h-10 items-center gap-2 whitespace-nowrap rounded-md border bg-background pr-2 pl-4 text-foreground text-sm shadow-sm">
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
      </section>
      <section className="bg-code h-[500px]">
        <div className="border rounded-lg -translate-y-40 shadow-lg max-w-[1200px] mx-auto bg-background p-4">
          <div className="flex flex-col sm:flex-row justify-between p-4">
            <div className="flex-1">
              <FileTree
                name="my-app"
                className="my-0 bg-transparent p-0 dark:bg-transparent"
              >
                <FileTree.Folder name="apps">
                  <FileTree.Folder name="web" annotation="Next.js frontend">
                    <FileTree.Folder name="app">
                      <FileTree.File name="layout.tsx" />
                      <FileTree.File name="page.tsx" annotation="home route" />
                      <FileTree.File name="auth-form.tsx" />
                      <FileTree.File name="todo-list.tsx" />
                    </FileTree.Folder>
                    <FileTree.Folder name="lib">
                      <FileTree.File
                        name="auth-client.ts"
                        annotation="Better Auth client"
                      />
                    </FileTree.Folder>
                  </FileTree.Folder>
                  <FileTree.Folder name="api" annotation="NestJS backend">
                    <FileTree.Folder name="src">
                      <FileTree.Folder name="todos">
                        <FileTree.File name="todos.controller.ts" />
                        <FileTree.File name="todos.module.ts" />
                        <FileTree.File
                          name="todos.service.ts"
                          annotation="business logic"
                        />
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
              filename="apps/web/app/page.tsx"
              language="tsx"
              code={`'use client';

import { authClient } from '@/lib/auth-client';
import { AuthForm } from '@/app/auth-form';
import { TodoList } from '@/app/todo-list';
import { Logo } from '@my-app/ui/logo';

export default function Home() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) return <p>Loading…</p>;

  return (
    <main className="mx-auto max-w-lg space-y-4">
      <Logo className="w-10 text-foreground" />
      {session ? <TodoList session={session} /> : <AuthForm />}
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
                Run the NestJS API as a standalone server, or opt in to
                injecting its services directly inside Next.js route handlers.
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
    </div>
  );
}
