'use client';

import { useState } from 'react';
import { FileTree } from '@/components/file-tree';
import { cn } from '@newt-app/ui/lib/utils';

type Flags = {
  shadcn: boolean;
  postgres: boolean;
  oxc: boolean;
  bare: boolean;
};

function Toggle({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'rounded-full border px-3 py-1 font-mono text-xs transition-colors',
        active
          ? 'border-foreground bg-foreground text-background'
          : 'border-border text-muted-foreground hover:text-foreground',
      )}
    >
      {children}
    </button>
  );
}

export function InteractiveFileTree({ className }: { className?: string }) {
  const [flags, setFlags] = useState<Flags>({
    shadcn: true,
    postgres: false,
    oxc: false,
    bare: false,
  });

  const toggle = (key: keyof Flags) =>
    setFlags((f) => ({ ...f, [key]: !f[key] }));

  return (
    <div className={className}>
      <div className="mb-4 flex flex-wrap gap-2">
        <Toggle active={flags.shadcn} onClick={() => toggle('shadcn')}>
          {flags.shadcn ? '✓ shadcn' : 'shadcn'}
        </Toggle>
        <Toggle active={flags.postgres} onClick={() => toggle('postgres')}>
          {flags.postgres ? 'postgres' : 'sqlite'}
        </Toggle>
        <Toggle active={flags.oxc} onClick={() => toggle('oxc')}>
          {flags.oxc ? 'oxlint' : 'eslint'}
        </Toggle>
        <Toggle active={flags.bare} onClick={() => toggle('bare')}>
          {flags.bare ? '✓ bare' : 'bare'}
        </Toggle>
      </div>

      <FileTree
        name="my-app"
        className="my-0 bg-transparent p-0 dark:bg-transparent"
      >
        <FileTree.Folder name="apps">
          <FileTree.Folder name="web" annotation="Next.js frontend">
            <FileTree.Folder name="app">
              {!flags.bare && (
                <FileTree.Folder name="dashboard">
                  <FileTree.File name="page.tsx" annotation="todo example" />
                </FileTree.Folder>
              )}
              <FileTree.File name="layout.tsx" />
              <FileTree.File name="page.tsx" annotation="home route" />
            </FileTree.Folder>
          </FileTree.Folder>
          <FileTree.Folder name="api" annotation="NestJS backend">
            <FileTree.Folder name="src">
              {!flags.bare && (
                <FileTree.Folder name="todos">
                  <FileTree.File name="todos.controller.ts" />
                  <FileTree.File name="todos.service.ts" />
                </FileTree.Folder>
              )}
              <FileTree.File name="app.module.ts" />
              <FileTree.File name="main.ts" />
            </FileTree.Folder>
          </FileTree.Folder>
        </FileTree.Folder>
        <FileTree.Folder name="packages">
          <FileTree.Folder
            name="ui"
            annotation={
              flags.shadcn ? 'shadcn/ui + 40 components' : 'minimal UI package'
            }
          />
          <FileTree.Folder
            name="auth"
            annotation="Better Auth configuration"
          />
          <FileTree.Folder
            name="db"
            annotation={
              flags.postgres ? 'Kysely + Postgres' : 'Kysely + SQLite'
            }
          />
          <FileTree.Folder
            name={flags.oxc ? 'oxlint-config' : 'eslint-config'}
            annotation={flags.oxc ? 'oxlint + oxfmt' : 'ESLint + Prettier'}
          />
          <FileTree.Folder
            name="typescript-config"
            annotation="Shared TypeScript config"
          />
        </FileTree.Folder>
      </FileTree>
    </div>
  );
}
