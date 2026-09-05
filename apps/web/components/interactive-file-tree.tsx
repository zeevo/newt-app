"use client";

import { useMemo } from "react";
import { useQueryStates } from "nuqs";
import { FileTree, fileIcon } from "@newt-app/file-tree";
import Link from "next/link";
import { CopyCommandButton } from "@/components/copy-command-button";
import { Toggle } from "@newt-app/ui/components/toggle";
import { ToggleGroup, ToggleGroupItem } from "@newt-app/ui/components/toggle-group";
import { Button } from "@newt-app/ui/components/button";
import { Input } from "@newt-app/ui/components/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@newt-app/ui/components/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@newt-app/ui/components/tooltip";
import { ChevronDown, Info } from "lucide-react";
import { cn } from "@newt-app/ui/lib/utils";
import {
  antiSlopAvailable,
  buildCommand,
  DEFAULT_NAME,
  deploymentOptions,
  DI_ONLY_HINT,
  DI_ONLY_REJECTS,
  extrasHints,
  type Config,
} from "@/lib/build-command";
import { scaffoldTree, type TreeNode } from "@/lib/scaffold-tree";
import { builderHref, configParsers, configUrlKeys, sanitizeConfig } from "@/lib/config-params";

const grow = "animate-in fade-in slide-in-from-left-1 duration-300";

function renderNodes(nodes: TreeNode[]) {
  return nodes.map((node) => {
    const className = node.conditional ? grow : undefined;
    return node.kind === "dir" ? (
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
        icon={fileIcon(node.name)}
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
      className={cn("size-4 shrink-0 bg-foreground", className)}
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
              className="text-muted-foreground/70 transition-colors hover:text-foreground pointer-coarse:hidden"
            >
              <Info className="size-3.5" />
            </TooltipTrigger>
            <TooltipContent className="max-w-56">{hint}</TooltipContent>
          </Tooltip>
        )}
      </span>
      {/* a tooltip never opens without hover, so on touch the trigger is dead
          weight and the hint is shown outright instead */}
      {hint && (
        <p className="hidden basis-full text-xs text-muted-foreground pointer-coarse:block">
          {hint}
        </p>
      )}
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
          const picked = options.find((option) => option === v[0]);
          if (picked) onChange(picked);
        }}
      >
        {options.map((opt) => (
          <ToggleGroupItem
            key={opt}
            value={opt}
            className="gap-1.5 font-mono text-xs text-muted-foreground aria-pressed:border-ring aria-pressed:text-foreground"
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
        className="min-w-14 font-mono text-xs text-muted-foreground aria-pressed:border-ring aria-pressed:text-foreground"
        pressed={pressed}
        onPressedChange={onChange}
        disabled={disabled}
      >
        {pressed ? "on" : "off"}
      </Toggle>
    </Row>
  );
}

export function InteractiveFileTree({
  className,
  fullscreen,
}: {
  className?: string;
  fullscreen?: boolean;
}) {
  const [raw, setC] = useQueryStates(configParsers, { urlKeys: configUrlKeys });
  const c = sanitizeConfig(raw);
  const set = <K extends keyof Config>(key: K, value: Config[K]) => setC({ [key]: value });

  const command = useMemo(() => buildCommand(c), [c]);
  const hints = extrasHints(c);
  const selected = [
    c.deployment === "none" ? null : c.deployment,
    c.todoExample ? "example app" : null,
    c.antiSlop ? "anti-slop" : null,
  ].filter((extra) => extra !== null);

  return (
    <TooltipProvider>
      <div className={cn("flex flex-col gap-2", className)}>
        <div
          className={cn(
            "flex flex-col gap-2 lg:flex-row",
            fullscreen ? "lg:min-h-0 lg:flex-1" : "lg:items-start",
          )}
        >
          <div className="flex flex-col gap-2 lg:w-[42%] lg:shrink-0">
            <div className="flex flex-1 flex-col gap-2.5 rounded-lg border p-3">
              <Row label="name">
                <Input
                  value={c.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder={DEFAULT_NAME}
                  aria-label="Project name"
                  className="w-44 font-mono text-xs"
                />
              </Row>
              <BoolToggle label="Next.js" logo="/logos/nextjs.svg" pressed disabled />
              <Segmented
                label="NestJS"
                logo="/logos/nestjs.svg"
                hint={c.nestDiOnly ? DI_ONLY_HINT : undefined}
                value={c.nestDiOnly ? "di-only" : "on"}
                options={["on", "di-only"] as const}
                onChange={(v) =>
                  setC((prev) => {
                    const nestDiOnly = v === "di-only";
                    return {
                      ...prev,
                      nestDiOnly,
                      deployment:
                        nestDiOnly && DI_ONLY_REJECTS.has(prev.deployment)
                          ? "none"
                          : prev.deployment,
                    };
                  })
                }
              />
              <BoolToggle label="Better Auth" logo="/logos/better-auth.svg" pressed disabled />
              <Segmented
                label="database"
                value={c.database}
                options={["sqlite", "postgres"] as const}
                onChange={(v) => set("database", v)}
                logos={{
                  sqlite: "/logos/sqlite.svg",
                  postgres: "/logos/postgres.svg",
                }}
              />
              <Segmented
                label="testing"
                value={c.testing}
                options={["jest", "vitest"] as const}
                onChange={(v) => set("testing", v)}
                logos={{ jest: "/logos/jest.svg", vitest: "/logos/vitest.svg" }}
              />
              <Segmented
                label="linter"
                value={c.linter}
                options={["eslint", "oxc"] as const}
                onChange={(v) =>
                  setC((prev) => ({
                    ...prev,
                    linter: v,
                    antiSlop: v === "oxc" && prev.antiSlop,
                  }))
                }
                logos={{ eslint: "/logos/eslint.svg", oxc: "/logos/oxc.svg" }}
              />
              <BoolToggle
                label="shadcn/ui"
                logo="/logos/shadcn.svg"
                pressed={c.shadcn}
                onChange={(v) => setC((prev) => ({ ...prev, shadcn: v, stylex: v ? false : prev.stylex }))}
              />
              <BoolToggle
                label="stylex"
                pressed={c.stylex}
                onChange={(v) => setC((prev) => ({ ...prev, stylex: v, shadcn: v ? false : prev.shadcn }))}
              />
              <Row label="extras">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button variant="outline" size="sm" className="min-w-32 font-mono text-xs" />
                    }
                  >
                    <span className="max-w-48 truncate">
                      {selected.length ? selected.join(", ") : "none"}
                    </span>
                    <ChevronDown />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuRadioGroup
                      value={c.deployment}
                      onValueChange={(v) => {
                        const picked = deploymentOptions(c.nestDiOnly).find(
                          (option) => option === v,
                        );
                        if (picked) set("deployment", picked);
                      }}
                    >
                      <DropdownMenuLabel>Deployment Add-ons</DropdownMenuLabel>
                      {deploymentOptions(c.nestDiOnly).map((option) => (
                        <DropdownMenuRadioItem
                          key={option}
                          value={option}
                          className="font-mono text-xs"
                        >
                          {option}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>Include</DropdownMenuLabel>
                      <DropdownMenuCheckboxItem
                        checked={c.todoExample}
                        onCheckedChange={(v) => set("todoExample", v)}
                        className="font-mono text-xs"
                      >
                        example app
                      </DropdownMenuCheckboxItem>
                      {antiSlopAvailable(c.linter) && (
                        <DropdownMenuCheckboxItem
                          checked={c.antiSlop}
                          onCheckedChange={(v) => set("antiSlop", v)}
                          className="font-mono text-xs"
                        >
                          anti-slop
                        </DropdownMenuCheckboxItem>
                      )}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </Row>
              {/* the extras options are not self-describing, and a hover tooltip
                cannot be read on a touch screen */}
              {hints.map((text) => (
                <p
                  key={text}
                  aria-live="polite"
                  className="text-xs leading-relaxed text-muted-foreground"
                >
                  {text}
                </p>
              ))}
            </div>
            {!fullscreen && (
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-mono text-xs text-muted-foreground"
                  nativeButton={false}
                  render={<Link href={builderHref("/builder", c)} role="link" />}
                >
                  builder
                </Button>
              </div>
            )}
          </div>

          <div className="min-h-[684px] flex-1 rounded-lg border bg-code p-3">
            <FileTree
              name={c.name.trim() || DEFAULT_NAME}
              className="my-0 bg-transparent p-0 dark:bg-transparent"
            >
              {renderNodes(scaffoldTree(c))}
            </FileTree>
          </div>
        </div>

        <div className="flex items-stretch gap-2">
          {/* min-w-0 lets the code scroll inside its own block instead of
              growing the row and squeezing the button */}
          <div className="min-w-0 flex-1 rounded-lg border bg-code px-3 py-2">
            <code className="block overflow-x-auto font-mono text-sm whitespace-nowrap text-foreground">
              <span className="text-muted-foreground select-none">$ </span>
              {command}
            </code>
          </div>
          <CopyCommandButton value={command} />
        </div>
      </div>
    </TooltipProvider>
  );
}
