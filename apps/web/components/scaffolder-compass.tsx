"use client";

import { useState } from "react";
import { Badge } from "@newt-app/ui/components/badge";
import { Separator } from "@newt-app/ui/components/separator";
import { cn } from "@newt-app/ui/lib/utils";

type Tool = {
  id: string;
  name: string;
  x: number;
  y: number;
  stalled: boolean;
  commits: number | null;
  note: string;
  dx: number;
  dy: number;
  anchor: "start" | "middle" | "end";
};

const TOOLS: Tool[] = [
  {
    id: "newt-app",
    name: "newt-app",
    x: -3,
    y: 8.8,
    stalled: false,
    commits: 100,
    note: "TypeScript 6, Next 16.3, Node 24, Nest 11. Controllers and services, SQL through Kysely, no codegen step.",
    dx: 0,
    dy: -17,
    anchor: "middle",
  },
  {
    id: "redwoodsdk",
    name: "RedwoodSDK",
    x: 2.5,
    y: 8.6,
    stalled: false,
    commits: 100,
    note: "Server-first React on Cloudflare. The newest bet here, complicated because little of what you know transfers.",
    dx: 11,
    dy: 4,
    anchor: "start",
  },
  {
    id: "better-t-stack",
    name: "Better-T-Stack",
    x: 0.5,
    y: 7.8,
    stalled: false,
    commits: 99,
    note: "Bun, Cloudflare Workers, TanStack Start. Eight frontends and six backends is a decision tree before it is a codebase.",
    dx: 0,
    dy: 21,
    anchor: "middle",
  },
  {
    id: "create-vite",
    name: "create-vite",
    x: -9,
    y: 7.2,
    stalled: false,
    commits: 100,
    note: "An app shell and a dev server. Nothing to learn, and nothing handed over.",
    dx: 11,
    dy: 4,
    anchor: "start",
  },
  {
    id: "create-next-app",
    name: "create-next-app",
    x: -7.3,
    y: 6.4,
    stalled: false,
    commits: 100,
    note: "One notch more convention: App Router layout, routing and metadata patterns to absorb first.",
    dx: 11,
    dy: 4,
    anchor: "start",
  },
  {
    id: "create-turbo",
    name: "create-turbo",
    x: -5.5,
    y: 5.5,
    stalled: false,
    commits: 100,
    note: "Two apps and a shared UI package on Next 16.3. No backend, no auth, no database.",
    dx: 11,
    dy: 4,
    anchor: "start",
  },
  {
    id: "nx",
    name: "Nx",
    x: 7,
    y: 4.5,
    stalled: false,
    commits: 100,
    note: "Plugins, generators, executors, a daemon and a cache server, all load-bearing concepts.",
    dx: -11,
    dy: 4,
    anchor: "end",
  },
  {
    id: "next-forge",
    name: "next-forge",
    x: 9.5,
    y: 5.2,
    stalled: true,
    commits: 1,
    note: "Next 16.1.6 and React 19.2.4, behind 21 packages and eight paid services. One workflow file: release.yml.",
    dx: -11,
    dy: -13,
    anchor: "end",
  },
  {
    id: "epic-stack",
    name: "epic-stack",
    x: 6,
    y: -3,
    stalled: true,
    commits: 4,
    note: "Recent pins, previous-generation architecture: React Router loaders and actions, Prisma codegen, Express.",
    dx: -11,
    dy: 4,
    anchor: "end",
  },
  {
    id: "create-t3-app",
    name: "create-t3-app",
    x: -3,
    y: -5.5,
    stalled: true,
    commits: 0,
    note: "Light, but 28 Pages Router template files still ship. Last release November 2025, 130 open issues.",
    dx: 11,
    dy: 4,
    anchor: "start",
  },
  {
    id: "create-remix",
    name: "create-remix",
    x: -6,
    y: -7.5,
    stalled: true,
    commits: null,
    note: "Superseded by React Router 7. The installs it still gets are migration traffic, not new projects.",
    dx: -11,
    dy: 4,
    anchor: "end",
  },
  {
    id: "blitz",
    name: "Blitz",
    x: 3,
    y: -7.5,
    stalled: true,
    commits: 0,
    note: "Its own RPC conventions layered over Next.js, explicitly in maintenance mode since November 2025.",
    dx: 11,
    dy: 4,
    anchor: "start",
  },
];

const SIZE = 700;
const PAD = 60;
const CENTER = SIZE / 2;
const UNIT = (CENTER - PAD) / 10;
const TICKS = [-8, -6, -4, -2, 2, 4, 6, 8];

const px = (v: number) => CENTER + v * UNIT;
const py = (v: number) => CENTER - v * UNIT;

type Quadrant = `${"modern" | "outdated"} · ${"simple" | "complicated"}`;

const QUADRANT_COST = {
  "modern · simple": "Current bets, assembled from parts you already understand.",
  "modern · complicated": "Current technology, wrapped in a lot of structure you inherit.",
  "outdated · simple": "Previous-generation ideas, but little to inherit if you leave.",
  "outdated · complicated": "Previous-generation ideas, and a lot of them to maintain.",
} satisfies Record<Quadrant, string>;

function quadrant(tool: Tool): Quadrant {
  const age = tool.y >= 0 ? "modern" : "outdated";
  const load = tool.x >= 0 ? "complicated" : "simple";
  return `${age} · ${load}`;
}

export function ScaffolderCompass() {
  const [activeId, setActiveId] = useState("newt-app");
  const active = TOOLS.find((tool) => tool.id === activeId) ?? TOOLS[0]!;

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="grid lg:grid-cols-[1fr_20rem]">
        <div className="overflow-x-auto p-4 sm:p-6">
          <svg
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            role="group"
            aria-label="Full-stack TypeScript scaffolders plotted by how modern the architecture is and how complicated the result is to work in"
            className="h-auto w-full min-w-[36rem]"
          >
            <rect
              x={CENTER}
              y={CENTER}
              width={CENTER - PAD}
              height={CENTER - PAD}
              className="fill-destructive/5"
            />

            {TICKS.map((tick) => (
              <line
                key={`v${tick}`}
                x1={px(tick)}
                y1={PAD}
                x2={px(tick)}
                y2={SIZE - PAD}
                className="stroke-border"
                strokeWidth={1}
              />
            ))}
            {TICKS.map((tick) => (
              <line
                key={`h${tick}`}
                x1={PAD}
                y1={py(tick)}
                x2={SIZE - PAD}
                y2={py(tick)}
                className="stroke-border"
                strokeWidth={1}
              />
            ))}

            <rect
              x={PAD}
              y={PAD}
              width={SIZE - PAD * 2}
              height={SIZE - PAD * 2}
              fill="none"
              className="stroke-border"
              strokeWidth={1.5}
            />
            <line
              x1={CENTER}
              y1={PAD}
              x2={CENTER}
              y2={SIZE - PAD}
              className="stroke-muted-foreground/40"
              strokeWidth={1.5}
            />
            <line
              x1={PAD}
              y1={CENTER}
              x2={SIZE - PAD}
              y2={CENTER}
              className="stroke-muted-foreground/40"
              strokeWidth={1.5}
            />

            <g className="fill-muted-foreground font-mono text-[11px] tracking-[0.16em]">
              <text x={CENTER} y={PAD - 20} textAnchor="middle">
                MODERN
              </text>
              <text x={CENTER} y={SIZE - PAD + 30} textAnchor="middle">
                OUTDATED
              </text>
              <text x={26} y={CENTER} textAnchor="middle" transform={`rotate(-90 26 ${CENTER})`}>
                SIMPLE
              </text>
              <text
                x={SIZE - 26}
                y={CENTER}
                textAnchor="middle"
                transform={`rotate(90 ${SIZE - 26} ${CENTER})`}
              >
                COMPLICATED
              </text>
            </g>

            {/* the halo lets the corner captions sit over the grid without a
                backing rect, which would need text metrics to size */}
            <g
              className="fill-muted-foreground/70 stroke-card font-mono text-[9px] tracking-[0.12em]"
              strokeWidth={4}
              style={{ paintOrder: "stroke" }}
            >
              <text x={PAD + 12} y={PAD + 20}>
                MODERN · SIMPLE
              </text>
              <text x={SIZE - PAD - 12} y={PAD + 20} textAnchor="end">
                MODERN · COMPLICATED
              </text>
              <text x={PAD + 12} y={SIZE - PAD - 12}>
                OUTDATED · SIMPLE
              </text>
              <text x={SIZE - PAD - 12} y={SIZE - PAD - 12} textAnchor="end">
                OUTDATED · COMPLICATED
              </text>
            </g>

            {TOOLS.map((tool) => {
              const isActive = tool.id === active.id;
              const isSelf = tool.id === "newt-app";
              const cx = px(tool.x);
              const cy = py(tool.y);

              return (
                <g
                  key={tool.id}
                  tabIndex={0}
                  role="button"
                  aria-label={`${tool.name}, ${quadrant(tool)}`}
                  onMouseEnter={() => setActiveId(tool.id)}
                  onFocus={() => setActiveId(tool.id)}
                  onClick={() => setActiveId(tool.id)}
                  className="cursor-pointer outline-none"
                >
                  <circle cx={cx} cy={cy} r={18} fill="transparent" />
                  {isSelf && (
                    <>
                      <circle
                        cx={cx}
                        cy={cy}
                        r={16}
                        fill="none"
                        className="stroke-foreground/20"
                        strokeWidth={1}
                      />
                      <circle
                        cx={cx}
                        cy={cy}
                        r={11}
                        fill="none"
                        className="stroke-foreground/45"
                        strokeWidth={1.5}
                      />
                    </>
                  )}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelf ? 7 : 5}
                    className={cn(
                      "transition-all",
                      isSelf && "fill-foreground",
                      !isSelf && tool.stalled && "fill-card stroke-foreground/55",
                      !isSelf && tool.stalled && isActive && "stroke-foreground",
                      !isSelf && !tool.stalled && !isActive && "fill-foreground/55",
                      !isSelf && !tool.stalled && isActive && "fill-foreground",
                    )}
                    strokeWidth={1.8}
                  />
                  <text
                    x={cx + tool.dx}
                    y={cy + tool.dy}
                    textAnchor={tool.anchor}
                    strokeWidth={4}
                    style={{ paintOrder: "stroke" }}
                    className={cn(
                      "stroke-card font-mono text-[11px] transition-colors",
                      isSelf && "fill-foreground font-semibold",
                      !isSelf && isActive && "fill-foreground",
                      !isSelf && !isActive && "fill-muted-foreground",
                    )}
                  >
                    {tool.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="flex flex-col gap-4 border-t p-6 lg:border-t-0 lg:border-l">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-sm font-semibold">{active.name}</span>
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="outline" className="font-mono">
                {quadrant(active)}
              </Badge>
              <Badge variant={active.stalled ? "destructive" : "secondary"} className="font-mono">
                {active.stalled ? "stopped moving" : "active"}
              </Badge>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground">{active.note}</p>

          {active.commits !== null && (
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-2xl font-semibold tabular-nums">
                {active.commits}
              </span>
              <span className="text-xs text-muted-foreground">commits in 90 days</span>
            </div>
          )}

          <Separator />

          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-[0.7rem] tracking-wider text-muted-foreground uppercase">
              What this corner costs
            </span>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {QUADRANT_COST[quadrant(active)]}
            </p>
          </div>

          <Separator className="mt-auto" />

          <dl className="flex flex-col gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="size-2.5 shrink-0 rounded-full bg-foreground" />
              <span>10 or more commits in 90 days</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-2.5 shrink-0 rounded-full border-[1.5px] border-foreground" />
              <span>under 5 commits in 90 days</span>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
