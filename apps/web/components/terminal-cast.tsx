"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@newt-app/ui/lib/utils";
import { Window } from "@/components/window";

type Tone = "prompt" | "cmd" | "gray" | "green" | "magenta" | "blue" | "cyan" | "dim" | "inverse";
type Segment = { text: string; tone?: Tone };
// `hang` indents a soft-wrapped help row under its description column
type Line = Segment[] & { hang?: boolean };
type Task = { title: string; done: string; ms: number };
type Option = { label: string; hint?: string };
// one repaint: drop the last `drop` lines, append `add`, then hold for `ms`
type Frame = { drop: number; add: Line[]; ms: number };
type Scene = { label: string; frames: Frame[] };

// the scaffolder's p.tasks() entries: clack spins the title, then replaces it
// with the result. The durations are a real run, compressed
const TASKS: readonly Task[] = [
  { title: "Scaffolding project", done: "Scaffolded", ms: 240 },
  { title: "Installing with pnpm", done: "Installed", ms: 3200 },
  { title: "Formatting", done: "Formatted", ms: 1000 },
  { title: "Initializing git", done: "Initialized git", ms: 320 },
];

// commander's output in a narrow terminal, where it stops wrapping itself
const HELP = `Usage: create-newt-app [options] [name]

Create a new newt-app monorepo

Options:
  -V, --version            output the version number
  -ni, --no-install        Skip pnpm install
  -ng, --no-git            Skip git initialization
  --shadcn                 Include shadcn/ui (default: false)
  --stylex                 Use StyleX instead of Tailwind (default: false)
  --testing <framework>    Testing framework: vitest or jest (default: "jest")
  --database <database>    Database: sqlite or postgres (default: "sqlite")
  --linter <linter>        Linter: eslint or oxc (default: "eslint")
  --deployment <strategy>  Deployment: none, standalone, or spa (default: "none")
  --nest <mode>            NestJS: on, off, or di-only (default: "on")
  --include-example        Include the todo example (default: false)
  --extras <list>          Extras, comma-separated: anti-slop (default: "")
  -h, --help               display help for command`;

// clack's spinner: a new frame every 80ms, one more dot every 8 frames
const FRAMES = ["◒", "◐", "◓", "◑"];
const FRAME_MS = 80;

const CHAR_MS = 26;
const READ_MS = 700;
const KEY_MS = 380;
const LOOP_MS = 4200;

const TONES = {
  prompt: "text-green-800 select-none dark:text-green-400",
  cmd: "font-semibold text-foreground",
  gray: "text-muted-foreground",
  green: "text-green-800 dark:text-green-400",
  magenta: "text-fuchsia-700 dark:text-fuchsia-400",
  blue: "text-sky-700 dark:text-sky-400",
  cyan: "text-cyan-700 dark:text-cyan-400",
  dim: "text-muted-foreground",
  inverse: "bg-foreground text-background",
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

const outro = (nextSteps: string[]): Line[] => [
  bar,
  [{ text: "└", tone: "gray" }, { text: "  Done!" }],
  blank,
  [{ text: "Next steps:" }],
  blank,
  ...nextSteps.map((text): Line => [{ text: `  ${text}`, tone: "blue" }]),
  blank,
];

const show = (add: Line[], ms = 0): Frame => ({ drop: 0, add, ms });

const typed = (cmd: string): Frame[] => [
  show([prompt()]),
  ...[...cmd].map((_, i) => ({
    drop: 1,
    add: [prompt(cmd.slice(0, i + 1))],
    ms: cmd[i] === " " ? CHAR_MS * 2 : CHAR_MS,
  })),
  // the pause before Enter, then npm resolving the package
  { drop: 0, add: [], ms: 740 },
];

const spin = (task: Task): Frame[] => [
  show([bar, spinner(task.title, 0)], FRAME_MS),
  ...Array.from({ length: Math.round(task.ms / FRAME_MS) }, (_, tick) => ({
    drop: 1,
    add: [spinner(task.title, tick + 1)],
    ms: FRAME_MS,
  })),
  { drop: 1, add: [step(task.done)], ms: 0 },
];

// a clack prompt while it waits: cyan rail, then the answer collapses to one dim line
const active = (question: string, body: Line): Line[] => [
  [{ text: "◆", tone: "cyan" }, { text: `  ${question}` }],
  [{ text: "│  ", tone: "cyan" }, ...body],
  [{ text: "└", tone: "cyan" }],
];
const activeList = (question: string, rows: Line[]): Line[] => [
  [{ text: "◆", tone: "cyan" }, { text: `  ${question}` }],
  ...rows.map((row): Line => [{ text: "│  ", tone: "cyan" }, ...row]),
  [{ text: "└", tone: "cyan" }],
];
const answered = (question: string, answer: string): Line[] => [
  [{ text: "◇", tone: "green" }, { text: `  ${question}` }],
  [
    { text: "│", tone: "gray" },
    { text: `  ${answer}`, tone: "dim" },
  ],
];

// each state repaints the prompt in place; the last one is submitted
const ask = (states: Line[][], question: string, answer: string): Frame[] =>
  states
    .map(
      (lines, i): Frame => ({
        drop: i === 0 ? 0 : (states[i - 1]?.length ?? 0),
        add: i === 0 ? [bar, ...lines] : lines,
        ms: i === 0 ? READ_MS : KEY_MS,
      }),
    )
    .concat({
      drop: states.at(-1)?.length ?? 0,
      add: answered(question, answer),
      ms: 0,
    });

const text = (question: string, placeholder: string, value: string): Frame[] =>
  ask(
    [
      active(question, [
        { text: placeholder[0] ?? "", tone: "inverse" },
        { text: placeholder.slice(1), tone: "dim" },
      ]),
      ...[...value].map((_, i) => active(question, [{ text: `${value.slice(0, i + 1)}█` }])),
    ],
    question,
    value,
  );

const confirm = (question: string): Frame[] =>
  ask(
    [
      active(question, [
        { text: "●", tone: "green" },
        { text: " Yes " },
        { text: "/ ○ No", tone: "dim" },
      ]),
    ],
    question,
    "Yes",
  );

// `path` is every row the cursor rests on; the last one is picked
const select = (question: string, options: Option[], path: number[]): Frame[] =>
  ask(
    path.map((cursor) =>
      activeList(
        question,
        options.map(
          (option, i): Line =>
            i === cursor
              ? [
                  { text: "●", tone: "green" },
                  { text: ` ${option.label}` },
                  ...(option.hint ? [{ text: ` (${option.hint})`, tone: "dim" as const }] : []),
                ]
              : [{ text: `○ ${option.label}`, tone: "dim" }],
        ),
      ),
    ),
    question,
    options[path.at(-1) ?? 0]?.label ?? "",
  );

const toggle = (question: string, option: Required<Option>): Frame[] =>
  ask(
    [
      { mark: "◻", tone: "cyan" as const },
      { mark: "◼", tone: "green" as const },
    ].map(({ mark, tone }) =>
      active(question, [
        { text: mark, tone },
        { text: ` ${option.label}` },
        { text: ` (${option.hint})`, tone: "dim" },
      ]),
    ),
    question,
    option.label,
  );

const finish = (nextSteps: string[]): Frame[] => [
  ...TASKS.flatMap(spin),
  show([...outro(nextSteps), prompt()]),
];

// prompts, hints and glyphs are a pty capture of the real CLI
const SCENES: Scene[] = [
  {
    label: "wizard",
    frames: [
      ...typed("npm create newt-app@latest"),
      show([INTRO]),
      ...text("What is your project name?", "my-newt-app", "my-app"),
      ...confirm("Use shadcn/ui?"),
      ...select(
        "NestJS?",
        [
          { label: "On", hint: "apps/api on port 3001" },
          {
            label: "DI only",
            hint: "no HTTP server; Next.js route handlers inject its services",
          },
          { label: "Off", hint: "no apps/api; Next.js owns the backend" },
        ],
        [0, 1, 2, 1, 0],
      ),
      ...select("Testing framework?", [{ label: "Jest" }, { label: "Vitest" }], [0, 1]),
      ...select("Database?", [{ label: "SQLite" }, { label: "Postgres" }], [0, 1]),
      ...select(
        "Linter and formatter?",
        [{ label: "ESLint + Prettier" }, { label: "oxlint + oxfmt" }],
        [0, 1],
      ),
      ...toggle("Extras?", {
        label: "anti-slop",
        hint: "oxlint rules that reject low-evidence TypeScript",
      }),
      ...confirm("Include the todo example?"),
      ...select(
        "Deployment?",
        [
          { label: "None", hint: "skip" },
          {
            label: "Standalone + Dockerfile",
            hint: "Dockerfiles + docker-compose.yml",
          },
          { label: "SPA Mode" },
        ],
        [0, 1],
      ),
      ...finish(["cd my-app", "pnpm dev"]),
    ],
  },
  {
    label: "flags",
    frames: [
      ...typed("npm create newt-app@latest my-app -- --shadcn --database postgres"),
      show([INTRO]),
      ...finish(["cd my-app", "pnpm dev"]),
    ],
  },
  {
    label: "--help",
    frames: [
      ...typed("npm create newt-app@latest -- --help"),
      show([
        ...HELP.split("\n").map(
          (row): Line =>
            Object.assign([{ text: row || " " }], {
              hang: row.startsWith("  -"),
            }),
        ),
        prompt(),
      ]),
    ],
  },
];

const paint = (lines: Line[], frame: Frame) => [
  ...lines.slice(0, lines.length - frame.drop),
  ...frame.add,
];

const framesOf = (scene: number) => SCENES[scene]?.frames ?? [];

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
  const [scene, setScene] = useState(0);
  // null until mounted: the server renders the whole session, so the
  // transcript is real content without JavaScript or with reduced motion
  const [lines, setLines] = useState<Line[] | null>(null);
  const viewRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const play = async () => {
      setLines([]);
      await series(framesOf(scene), async (frame) => {
        if (cancelled) return;
        setLines((prev) => paint(prev ?? [], frame));
        if (frame.ms) await sleep(frame.ms);
      });
      await sleep(LOOP_MS);
      if (!cancelled) setScene((scene + 1) % SCENES.length);
    };

    void play();
    return () => {
      cancelled = true;
    };
  }, [scene]);

  const shown = lines ?? framesOf(scene).reduce<Line[]>(paint, []);

  useEffect(() => {
    const view = viewRef.current;
    if (view) view.scrollTop = view.scrollHeight;
  }, [shown]);

  return (
    <Window
      className={className}
      title={
        <div className="ml-2.5 flex gap-1 font-mono text-[0.68rem]">
          {SCENES.map((s, i) => (
            <button
              key={s.label}
              type="button"
              aria-pressed={i === scene}
              onClick={() => setScene(i)}
              className="rounded-md px-2 py-0.5 text-muted-foreground transition-colors hover:text-foreground aria-pressed:bg-foreground/[0.07] aria-pressed:text-foreground"
            >
              {s.label}
            </button>
          ))}
        </div>
      }
      barClassName="py-1.5"
    >
      <pre
        ref={viewRef}
        aria-live="off"
        className="h-[15rem] overflow-auto px-3.5 [scrollbar-width:none] py-2.5 font-mono text-[0.68rem] leading-relaxed whitespace-pre-wrap sm:h-[24rem] sm:text-[0.72rem]"
      >
        <code>
          {shown.map((line, i) => (
            <span key={i} className={cn("block", line.hang && "sm:pl-[27ch] sm:-indent-[27ch]")}>
              {line.map((segment, j) => (
                <span key={j} className={segment.tone && TONES[segment.tone]}>
                  {segment.text}
                </span>
              ))}
              {i === shown.length - 1 && atPrompt(line) && <Caret blink={lines !== null} />}
            </span>
          ))}
        </code>
      </pre>
    </Window>
  );
}
