"use client";

import { useEffect, useRef, useState } from "react";
import { PauseIcon, PlayIcon } from "lucide-react";
import { cn } from "@newt-app/ui/lib/utils";
import { Window } from "@/components/window";

type Line = { kind: "cmd" | "out"; text: string };

type Step = { cmd: string; out: readonly string[] };

const STEPS: readonly Step[] = [
  {
    cmd: "npm create newt-app@latest my-app -- --shadcn --database postgres",
    out: [
      "│  Scaffolding project",
      "│  Scaffolded.",
      "│  Installing with pnpm",
      "│  Installed.",
      "│  Formatting",
      "│  Formatted.",
      "│  Initializing git",
      "│  Initialized git.",
      "└  Done!",
    ],
  },
  {
    cmd: "cd my-app && pnpm dev",
    out: [
      "web:dev: ▲ Next.js ready on http://localhost:3000",
      "api:dev: [Nest] LOG [RoutesResolver] AppController {/api}:",
      "api:dev: [Nest] LOG [NestApplication] successfully started",
    ],
  },
  {
    cmd: "curl -s localhost:3000/api/hello",
    out: ['{"message":"Hello from Nest"}'],
  },
];

const TRANSCRIPT: Line[] = STEPS.flatMap((step) => [
  { kind: "cmd" as const, text: step.cmd },
  ...step.out.map((text) => ({ kind: "out" as const, text })),
]);

const CHAR_MS = 26;
const LINE_MS = 95;
const STEP_MS = 700;
const LOOP_MS = 4200;
const TICK_MS = 60;

function series<T>(items: readonly T[], run: (item: T) => Promise<void>) {
  return items.reduce<Promise<void>>(
    (previous, item) => previous.then(() => run(item)),
    Promise.resolve(),
  );
}

function Caret({ paused }: { paused: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "ml-px inline-block h-[1em] w-[0.55em] translate-y-[0.15em] bg-foreground/70",
        !paused && "caret-blink",
      )}
    />
  );
}

export function TerminalCast({ className }: { className?: string }) {
  // the server renders the whole session, so the transcript is real content
  // without JavaScript; the cast clears it on mount and replays it
  const [lines, setLines] = useState<Line[]>(TRANSCRIPT);
  const [animated, setAnimated] = useState(false);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const viewRef = useRef<HTMLPreElement>(null);

  pausedRef.current = paused;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setAnimated(true);

    let cancelled = false;

    // the clock only advances while playing, so Pause holds the caret where it
    // is instead of queueing the backlog up and flushing it on resume
    const sleep = async (ms: number) => {
      let left = ms;
      while (left > 0 && !cancelled) {
        await new Promise((resolve) => setTimeout(resolve, Math.min(left, TICK_MS)));
        if (!pausedRef.current) left -= TICK_MS;
      }
    };

    const type = async (cmd: string) => {
      setLines((prev) => [...prev, { kind: "cmd", text: "" }]);
      await series([...cmd], async (char) => {
        setLines((prev) =>
          prev.map((line, i) =>
            i === prev.length - 1 ? { ...line, text: line.text + char } : line,
          ),
        );
        await sleep(char === " " ? CHAR_MS * 2 : CHAR_MS);
      });
      await sleep(340);
    };

    const play = async () => {
      while (!cancelled) {
        setLines([]);
        await series(STEPS, async (step) => {
          if (cancelled) return;
          await type(step.cmd);
          await series(step.out, async (text) => {
            if (cancelled) return;
            setLines((prev) => [...prev, { kind: "out", text }]);
            await sleep(LINE_MS);
          });
          await sleep(STEP_MS);
        });
        await sleep(LOOP_MS);
      }
    };

    void play();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const view = viewRef.current;
    if (view) view.scrollTop = view.scrollHeight;
  }, [lines]);

  return (
    <Window
      label="my-app"
      className={cn("terminal-surface", className)}
      action={
        animated && (
          <button
            type="button"
            onClick={() => setPaused((value) => !value)}
            aria-label={paused ? "Resume the terminal session" : "Pause the terminal session"}
            className="flex items-center gap-1 rounded border border-border/70 px-1.5 py-0.5 font-mono text-[0.7rem] text-muted-foreground transition-colors hover:border-border hover:text-foreground"
          >
            {paused ? <PlayIcon className="size-3" /> : <PauseIcon className="size-3" />}
            {paused ? "play" : "pause"}
          </button>
        )
      }
    >
      <pre
        ref={viewRef}
        aria-live="off"
        className="h-[22rem] overflow-auto px-4 py-3.5 font-mono text-[0.78rem] leading-relaxed whitespace-pre-wrap sm:h-[26rem] sm:text-[0.82rem]"
      >
        <code>
          {lines.map((line, i) => (
            <span key={i} className="block">
              {line.kind === "cmd" ? (
                <>
                  <span className="text-emerald-400 select-none">$ </span>
                  <span className="font-semibold text-foreground">{line.text}</span>
                </>
              ) : (
                <span className="text-muted-foreground">{line.text || " "}</span>
              )}
              {animated && i === lines.length - 1 && <Caret paused={paused} />}
            </span>
          ))}
          {animated && lines.length === 0 && (
            <span className="block">
              <span className="text-emerald-400 select-none">$ </span>
              <Caret paused={paused} />
            </span>
          )}
        </code>
      </pre>
    </Window>
  );
}
