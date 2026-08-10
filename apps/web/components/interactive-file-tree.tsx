'use client';

import { useMemo, useState } from 'react';
import { FileTree } from '@newt-app/file-tree';
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
import {
  buildCommand,
  DATABASE_HINT,
  deploymentHint,
  deploymentOptions,
  DI_ONLY_HINT,
  DI_ONLY_REJECTS,
  type Config,
} from '@/lib/build-command';
import { scaffoldTree, type TreeNode } from '@/lib/scaffold-tree';

const DEFAULT: Config = {
  shadcn: true,
  testing: 'vitest',
  database: 'postgres',
  linter: 'oxc',
  deployment: 'none',
  nestDiOnly: false,
};

const grow = 'animate-in fade-in slide-in-from-left-1 duration-300';

function renderNodes(nodes: TreeNode[]) {
  return nodes.map((node) => {
    const className = node.conditional ? grow : undefined;
    return node.kind === 'dir' ? (
      <FileTree.Folder
        key={node.path}
        name={node.name}
        annotation={node.annotation}
        className={className}
      >
        {node.children && renderNodes(node.children)}
      </FileTree.Folder>
    ) : (
      <FileTree.File
        key={node.path}
        annotation={node.annotation}
        className={className}
      >
        {node.name}
      </FileTree.File>
    );
  });
}

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
  // the controls are nowrap and won't shrink, so on a narrow screen they drop
  // to their own line rather than pushing past the panel
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
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
  hint,
  logo,
  value,
  options,
  onChange,
  logos,
}: {
  label: string;
  hint?: string;
  logo?: string;
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
  logos?: Partial<Record<T, string>>;
}) {
  return (
    <Row label={label} hint={hint} logo={logo}>
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

export function InteractiveFileTree({ className }: { className?: string }) {
  const [c, setC] = useState<Config>(DEFAULT);
  const set = <K extends keyof Config>(key: K, value: Config[K]) =>
    setC((prev) => ({ ...prev, [key]: value }));

  const command = useMemo(() => buildCommand(c), [c]);
  const hint = deploymentHint(c);

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
            <Segmented
              label="NestJS"
              logo="/logos/nestjs.svg"
              hint={DI_ONLY_HINT}
              value={c.nestDiOnly ? 'di-only' : 'on'}
              options={['on', 'di-only'] as const}
              onChange={(v) =>
                setC((prev) => {
                  const nestDiOnly = v === 'di-only';
                  return {
                    ...prev,
                    nestDiOnly,
                    deployment:
                      nestDiOnly && DI_ONLY_REJECTS.has(prev.deployment)
                        ? 'none'
                        : prev.deployment,
                  };
                })
              }
            />
            <BoolToggle
              label="Better Auth"
              logo="/logos/better-auth.svg"
              pressed
              disabled
            />
            <Segmented
              label="database"
              hint={DATABASE_HINT}
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
            <Row label="extras">
              <NativeSelect
                size="sm"
                value={c.deployment}
                onChange={(e) =>
                  set('deployment', e.target.value as Config['deployment'])
                }
                className="font-mono text-xs"
              >
                {deploymentOptions(c.nestDiOnly).map((option) => (
                  <NativeSelectOption key={option} value={option}>
                    {option}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </Row>
            {/* the extras options are not self-describing, and a hover tooltip
                cannot be read on a touch screen */}
            {hint && (
              <p
                aria-live="polite"
                className="text-xs leading-relaxed text-muted-foreground"
              >
                {hint}
              </p>
            )}
          </div>

          <div className="min-h-[684px] flex-1 rounded-lg border bg-code p-5">
            <FileTree
              name="my-app"
              className="my-0 bg-transparent p-0 dark:bg-transparent"
            >
              {renderNodes(scaffoldTree(c))}
            </FileTree>
          </div>
        </div>

        <div className="relative rounded-lg border bg-code p-4 pr-12">
          <code className="block overflow-x-auto font-mono text-sm whitespace-nowrap text-foreground">
            <span className="text-muted-foreground select-none">$ </span>
            {command}
          </code>
          <CopyButton value={command} className="top-3" />
        </div>
      </div>
    </TooltipProvider>
  );
}
