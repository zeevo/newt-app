'use client';

import { useMemo, useState } from 'react';
import { FileTree } from '@/components/file-tree';
import { CopyButton } from '@/components/copy-button';
import { Toggle } from '@newt-app/ui/components/toggle';
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@newt-app/ui/components/toggle-group';
import {
  NativeSelect,
  NativeSelectOption,
} from '@newt-app/ui/components/native-select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@newt-app/ui/components/tooltip';
import { Info } from 'lucide-react';
import { cn } from '@newt-app/ui/lib/utils';

type Config = {
  shadcn: boolean;
  testing: 'jest' | 'vitest';
  database: 'sqlite' | 'postgres';
  linter: 'eslint' | 'oxc';
  deployment: 'none' | 'standalone' | 'custom-server' | 'spa';
  nestDiOnly: boolean;
};

const DEFAULT: Config = {
  shadcn: true,
  testing: 'vitest',
  database: 'postgres',
  linter: 'oxc',
  deployment: 'none',
  nestDiOnly: false,
};

const grow = 'animate-in fade-in slide-in-from-left-1 duration-300';

function Logo({ src, className }: { src: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn('size-4 shrink-0 bg-foreground', className)}
      style={{
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
      }}
    />
  );
}

function Row({
  label,
  hint,
  logo,
  children,
}: {
  label: string;
  hint?: string;
  logo?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="flex items-center gap-2 font-mono text-sm text-muted-foreground">
        {logo && <Logo src={logo} />}
        {label}
        {hint && (
          <Tooltip>
            <TooltipTrigger
              type="button"
              aria-label={`About ${label}`}
              className="text-muted-foreground/70 transition-colors hover:text-foreground"
            >
              <Info className="size-3.5" />
            </TooltipTrigger>
            <TooltipContent className="max-w-56">{hint}</TooltipContent>
          </Tooltip>
        )}
      </span>
      {children}
    </div>
  );
}

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
  logos,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
  logos?: Partial<Record<T, string>>;
}) {
  return (
    <Row label={label}>
      <ToggleGroup
        variant="outline"
        size="sm"
        value={[value]}
        onValueChange={(v) => {
          if (v[0]) onChange(v[0] as T);
        }}
      >
        {options.map((opt) => (
          <ToggleGroupItem
            key={opt}
            value={opt}
            className="gap-1.5 font-mono text-xs"
          >
            {logos?.[opt] && <Logo src={logos[opt]!} className="size-3.5" />}
            {opt}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </Row>
  );
}

function BoolToggle({
  label,
  hint,
  logo,
  pressed,
  onChange,
  disabled,
}: {
  label: string;
  hint?: string;
  logo?: string;
  pressed: boolean;
  onChange?: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <Row label={label} hint={hint} logo={logo}>
      <Toggle
        variant="outline"
        size="sm"
        className="min-w-14 font-mono text-xs"
        pressed={pressed}
        onPressedChange={onChange}
        disabled={disabled}
      >
        {pressed ? 'on' : 'off'}
      </Toggle>
    </Row>
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
  return flags.length
    ? `npm create newt-app my-app -- ${flags.join(' ')}`
    : 'npm create newt-app my-app';
}

export function InteractiveFileTree({ className }: { className?: string }) {
  const [c, setC] = useState<Config>(DEFAULT);
  const set = <K extends keyof Config>(key: K, value: Config[K]) =>
    setC((prev) => ({ ...prev, [key]: value }));

  const command = useMemo(() => buildCommand(c), [c]);

  return (
    <TooltipProvider>
      <div className={cn('flex flex-col gap-4', className)}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
          <div className="flex flex-col gap-3 rounded-lg border p-5 lg:w-[42%] lg:shrink-0">
            <BoolToggle
              label="Next.js"
              logo="/logos/nextjs.svg"
              pressed
              disabled
            />
            <BoolToggle
              label="NestJS"
              logo="/logos/nestjs.svg"
              pressed
              disabled
            />
            <BoolToggle
              label="Better Auth"
              logo="/logos/better-auth.svg"
              pressed
              disabled
            />
            <Segmented
              label="database"
              value={c.database}
              options={['sqlite', 'postgres'] as const}
              onChange={(v) => set('database', v)}
              logos={{
                sqlite: '/logos/sqlite.svg',
                postgres: '/logos/postgres.svg',
              }}
            />
            <Segmented
              label="testing"
              value={c.testing}
              options={['jest', 'vitest'] as const}
              onChange={(v) => set('testing', v)}
              logos={{ jest: '/logos/jest.svg', vitest: '/logos/vitest.svg' }}
            />
            <Segmented
              label="linter"
              value={c.linter}
              options={['eslint', 'oxc'] as const}
              onChange={(v) => set('linter', v)}
              logos={{ eslint: '/logos/eslint.svg', oxc: '/logos/oxc.svg' }}
            />
            <BoolToggle
              label="shadcn/ui"
              logo="/logos/shadcn.svg"
              pressed={c.shadcn}
              onChange={(v) => set('shadcn', v)}
            />
            <BoolToggle
              label="Nest DI-only"
              hint="Use NestJS only for dependency injection — Next.js route handlers call into Nest services instead of running a separate REST API."
              pressed={c.nestDiOnly}
              onChange={(v) => set('nestDiOnly', v)}
            />
            <Row label="extras">
              <NativeSelect
                size="sm"
                value={c.deployment}
                onChange={(e) =>
                  set('deployment', e.target.value as Config['deployment'])
                }
                className="font-mono text-xs"
              >
                <NativeSelectOption value="none">none</NativeSelectOption>
                <NativeSelectOption value="standalone">
                  standalone
                </NativeSelectOption>
                <NativeSelectOption value="custom-server">
                  custom-server
                </NativeSelectOption>
                <NativeSelectOption value="spa">spa</NativeSelectOption>
              </NativeSelect>
            </Row>
          </div>

          <div className="flex-1 rounded-lg border bg-code p-5">
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
                        annotation="todo example"
                      />
                    </FileTree.Folder>
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
                    <FileTree.Folder name="todos">
                      <FileTree.File name="todos.service.ts" />
                      {!c.nestDiOnly && (
                        <FileTree.File
                          name="todos.controller.ts"
                          className={grow}
                        />
                      )}
                    </FileTree.Folder>
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
                    c.shadcn
                      ? 'shadcn/ui + 40 components'
                      : 'minimal UI package'
                  }
                />
                <FileTree.Folder
                  name="auth"
                  annotation="Better Auth configuration"
                />
                <FileTree.Folder
                  name="db"
                  annotation={
                    c.database === 'postgres'
                      ? 'Kysely + Postgres'
                      : 'Kysely + SQLite'
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
          </div>
        </div>

        <div className="relative rounded-lg border bg-code p-4 pr-12">
          <code className="block font-mono text-sm break-all text-foreground">
            <span className="text-muted-foreground select-none">$ </span>
            {command}
          </code>
          <CopyButton value={command} className="top-3" />
        </div>
      </div>
    </TooltipProvider>
  );
}
