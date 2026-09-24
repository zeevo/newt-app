"use client";

import { useEffect, useRef, useState } from "react";
import { PauseIcon, PlayIcon } from "lucide-react";
import { cn } from "@newt-app/ui/lib/utils";
import { Window } from "@/components/window";

type Tone = "prompt" | "cmd" | "gray" | "green" | "magenta" | "blue";
type Segment = { text: string; tone?: Tone };
type Line = Segment[];
type Task = { title: string; done: string; ms: number };

const CMD = "npm create newt-app@latest my-app -- --shadcn --database postgres";

// the scaffolder's p.tasks() entries: clack spins the title, then replaces it
// with the result. The durations are a real run, compressed
const TASKS: readonly Task[] = [
  { title: "Scaffolding project", done: "Scaffolded", ms: 240 },
  { title: "Installing with pnpm", done: "Installed", ms: 3200 },
  { title: "Formatting", done: "Formatted", ms: 1000 },
  { title: "Initializing git", done: "Initialized git", ms: 320 },
];

const NEXT_STEPS = ["cd my-app", "pnpm dev"];

// clack's spinner: a new frame every 80ms, one more dot every 8 frames
const FRAMES = ["◒", "◐", "◓", "◑"];
const FRAME_MS = 80;

const CHAR_MS = 26;
const LOOP_MS = 4200;
const TICK_MS = 60;

const TONES = {
  prompt: "text-green-800 select-none dark:text-green-400",
  cmd: "font-semibold text-foreground",
  gray: "text-muted-foreground",
  green: "text-green-800 dark:text-green-400",
  magenta: "text-fuchsia-700 dark:text-fuchsia-400",
  blue: "text-sky-700 dark:text-sky-400",
} satisfies Record<Tone, string>;

const prompt = (typed = ""): Line => [
  { text: "$ ", tone: "prompt" },
  { text: typed, tone: "cmd" },
];
const bar: Line = [{ text: "│", tone: "gray" }];
const blank: Line = [{ text: " " }];
const step = (text: string): Line => [{ text: "◇", tone: "green" }, { text: `  ${text}` }];
const spinner = (title: string, tick: number): Line => [
  { text: FRAMES[tick % FRAMES.length] ?? "", tone: "magenta" },
  { text: `  ${title}${".".repeat(Math.floor((tick % 32) / 8))}` },
];

const INTRO: Line = [
  { text: "┌", tone: "gray" },
  { text: "  Create a " },
  { text: "newt", tone: "blue" },
  { text: " app." },
];

const OUTRO: Line[] = [
  bar,
  [{ text: "└", tone: "gray" }, { text: "  Done!" }],
  blank,
  [{ text: "Next steps:" }],
  blank,
  ...NEXT_STEPS.map((text): Line => [{ text: `  ${text}`, tone: "blue" }]),
  blank,
];

const TRANSCRIPT: Line[] = [
  prompt(CMD),
  INTRO,
  ...TASKS.flatMap((task) => [bar, step(task.done)]),
  ...OUTRO,
  prompt(),
];

// the shell cursor only shows at a prompt: clack hides it while the CLI runs
const atPrompt = (line: Line) => line[0]?.tone === "prompt";

function series<T>(items: readonly T[], run: (item: T) => Promise<void>) {
  return items.reduce<Promise<void>>(
    (previous, item) => previous.then(() => run(item)),
    Promise.resolve(),
  );
}

function Caret({ blink }: { blink: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "ml-px inline-block h-[1em] w-[0.55em] translate-y-[0.15em] bg-foreground/70",
        blink && "caret-blink",
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

    // once cancelled, the pending sleeps resolve at once and the rest of the
    // run drains through here without writing over the replacement's lines
    const push = (...next: Line[]) => {
      if (!cancelled) setLines((prev) => [...prev, ...next]);
    };
    const replaceLast = (line: Line) => {
      if (!cancelled) setLines((prev) => [...prev.slice(0, -1), line]);
    };

    const type = async (cmd: string) => {
      push(prompt());
      await series(
        [...cmd].map((_, i) => cmd.slice(0, i + 1)),
        async (typed) => {
          replaceLast(prompt(typed));
          await sleep(typed.endsWith(" ") ? CHAR_MS * 2 : CHAR_MS);
        },
      );
      await sleep(340);
    };

    const run = async (task: Task) => {
      push(bar, spinner(task.title, 0));
      await series(
        Array.from({ length: Math.round(task.ms / FRAME_MS) }, (_, tick) => tick),
        async (tick) => {
          replaceLast(spinner(task.title, tick));
          await sleep(FRAME_MS);
        },
      );
      replaceLast(step(task.done));
    };

    const play = async () => {
      while (!cancelled) {
        setLines([]);
        await type(CMD);
        // npm resolving the package before the CLI starts
        await sleep(400);
        push(INTRO);
        await series(TASKS, run);
        push(...OUTRO, prompt());
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
      className={className}
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
              {line.map((segment, j) => (
                <span key={j} className={segment.tone && TONES[segment.tone]}>
                  {segment.text}
                </span>
              ))}
              {i === lines.length - 1 && atPrompt(line) && <Caret blink={animated && !paused} />}
            </span>
          ))}
        </code>
      </pre>
    </Window>
  );
}
