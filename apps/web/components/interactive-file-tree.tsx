'use client';

import { useMemo, useState } from 'react';
import { FileTree } from '@/components/file-tree';
import { CopyButton } from '@/components/copy-button';
import { Toggle } from '@newt-app/ui/components/toggle';
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@newt-app/ui/components/toggle-group';
import { cn } from '@newt-app/ui/lib/utils';

type Config = {
  shadcn: boolean;
  testing: 'jest' | 'vitest';
  database: 'sqlite' | 'postgres';
  linter: 'eslint' | 'oxc';
  deployment: 'none' | 'standalone' | 'custom-server' | 'spa';
  nestDiOnly: boolean;
  bare: boolean;
};

const DEFAULT: Config = {
  shadcn: true,
  testing: 'vitest',
  database: 'postgres',
  linter: 'oxc',
  deployment: 'none',
  nestDiOnly: false,
  bare: false,
};

// newly-mounted conditional subtrees slide in when a flag is toggled on
const grow = 'animate-in fade-in slide-in-from-left-1 duration-300';

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-20 shrink-0 font-mono text-xs text-muted-foreground">
        {label}
      </span>
      <ToggleGroup
        variant="outline"
        size="sm"
        value={[value]}
        onValueChange={(v) => {
          if (v[0]) onChange(v[0] as T);
        }}
      >
        {options.map((opt) => (
          <ToggleGroupItem key={opt} value={opt} className="font-mono text-xs">
            {opt}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}

function buildCommand(c: Config): string {
  const flags: string[] = [];
  if (c.shadcn) flags.push('--shadcn');
  if (c.testing !== 'jest') flags.push('--testing vitest');
  if (c.database !== 'sqlite') flags.push('--database postgres');
  if (c.linter !== 'eslint') flags.push('--linter oxc');
  if (c.deployment !== 'none') flags.push(`--deployment ${c.deployment}`);
  if (c.nestDiOnly) flags.push('--nest-di-only');
  if (c.bare) flags.push('--bare');
  return flags.length
    ? `npm create newt-app my-app -- ${flags.join(' ')}`
    : 'npm create newt-app my-app';
}

export function InteractiveFileTree({ className }: { className?: string }) {
  const [c, setC] = useState<Config>(DEFAULT);
  const set = <K extends keyof Config>(key: K, value: Config[K]) =>
    setC((prev) => ({ ...prev, [key]: value }));

  const command = useMemo(() => buildCommand(c), [c]);
  const showExample = !c.bare;

  return (
    <div className={cn('flex flex-col gap-5', className)}>
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          <Toggle
            variant="outline"
            size="sm"
            className="font-mono text-xs"
            pressed={c.shadcn}
            onPressedChange={(p) => set('shadcn', p)}
          >
            shadcn/ui
          </Toggle>
          <Toggle
            variant="outline"
            size="sm"
            className="font-mono text-xs"
            pressed={c.nestDiOnly}
            onPressedChange={(p) => set('nestDiOnly', p)}
          >
            Nest DI-only
          </Toggle>
          <Toggle
            variant="outline"
            size="sm"
            className="font-mono text-xs"
            pressed={c.bare}
            onPressedChange={(p) => set('bare', p)}
          >
            bare
          </Toggle>
        </div>
        <Segmented
          label="database"
          value={c.database}
          options={['sqlite', 'postgres'] as const}
          onChange={(v) => set('database', v)}
        />
        <Segmented
          label="testing"
          value={c.testing}
          options={['jest', 'vitest'] as const}
          onChange={(v) => set('testing', v)}
        />
        <Segmented
          label="linter"
          value={c.linter}
          options={['eslint', 'oxc'] as const}
          onChange={(v) => set('linter', v)}
        />
        <Segmented
          label="extras"
          value={c.deployment}
          options={['none', 'standalone', 'custom-server', 'spa'] as const}
          onChange={(v) => set('deployment', v)}
        />
      </div>

      <FileTree
        name="my-app"
        className="my-0 bg-transparent p-0 dark:bg-transparent"
      >
        <FileTree.Folder name="apps">
          <FileTree.Folder name="web" annotation="Next.js frontend">
            <FileTree.Folder name="app">
              {showExample && (
                <FileTree.Folder name="dashboard" className={grow}>
                  <FileTree.File name="page.tsx" annotation="todo example" />
                </FileTree.Folder>
              )}
              <FileTree.File name="layout.tsx" />
              <FileTree.File name="page.tsx" annotation="home route" />
            </FileTree.Folder>
            {c.deployment === 'custom-server' && (
              <FileTree.File
                name="server.ts"
                annotation="Next + Nest, one process"
                className={grow}
              />
            )}
            <FileTree.File
              name="next.config.ts"
              annotation={
                c.deployment === 'spa'
                  ? 'static export'
                  : c.deployment === 'standalone'
                    ? 'standalone output'
                    : undefined
              }
            />
          </FileTree.Folder>
          <FileTree.Folder name="api" annotation="NestJS backend">
            <FileTree.Folder name="src">
              {showExample && (
                <FileTree.Folder name="todos" className={grow}>
                  <FileTree.File name="todos.service.ts" />
                  {!c.nestDiOnly && (
                    <FileTree.File
                      name="todos.controller.ts"
                      className={grow}
                    />
                  )}
                </FileTree.Folder>
              )}
              <FileTree.File name="app.module.ts" />
              <FileTree.File
                name="main.ts"
                annotation={c.nestDiOnly ? 'DI context only' : undefined}
              />
            </FileTree.Folder>
          </FileTree.Folder>
        </FileTree.Folder>
        <FileTree.Folder name="packages">
          <FileTree.Folder
            name="ui"
            annotation={
              c.shadcn ? 'shadcn/ui + 40 components' : 'minimal UI package'
            }
          />
          <FileTree.Folder name="auth" annotation="Better Auth configuration" />
          <FileTree.Folder
            name="db"
            annotation={
              c.database === 'postgres' ? 'Kysely + Postgres' : 'Kysely + SQLite'
            }
          />
          <FileTree.Folder
            name={c.linter === 'oxc' ? 'oxlint-config' : 'eslint-config'}
            annotation={
              c.linter === 'oxc' ? 'oxlint + oxfmt' : 'ESLint + Prettier'
            }
          />
          <FileTree.Folder
            name="typescript-config"
            annotation="Shared TypeScript config"
          />
        </FileTree.Folder>
      </FileTree>

      <div className="relative rounded-md border bg-code p-3 pr-10">
        <code className="block font-mono text-xs break-all text-foreground">
          <span className="text-muted-foreground select-none">$ </span>
          {command}
        </code>
        <CopyButton value={command} className="top-2" />
      </div>
    </div>
  );
}
