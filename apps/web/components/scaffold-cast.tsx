'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { cn } from '@newt-app/ui/lib/utils';

type Line =
  | { kind: 'prompt'; label: string; answer: string }
  | { kind: 'task'; text: string }
  | { kind: 'done'; text: string }
  | { kind: 'hint'; text: string };

const COMMAND = 'npm create newt-app';

const LINES: Line[] = [
  { kind: 'prompt', label: 'Project name:', answer: 'my-app' },
  { kind: 'prompt', label: 'Include shadcn/ui?', answer: 'Yes' },
  { kind: 'prompt', label: 'Testing framework?', answer: 'Vitest' },
  { kind: 'prompt', label: 'Database?', answer: 'SQLite' },
  { kind: 'task', text: 'Scaffolded' },
  { kind: 'task', text: 'Installed' },
  { kind: 'done', text: 'Done!' },
  { kind: 'hint', text: 'cd my-app' },
  { kind: 'hint', text: 'pnpm dev' },
];

export function ScaffoldCast({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [typed, setTyped] = useState(0);
  const [shown, setShown] = useState(0);

  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const play = useCallback(() => {
    clear();
    setTyped(0);
    setShown(0);

    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (reduce) {
      setTyped(COMMAND.length);
      setShown(LINES.length);
      return;
    }

    for (let i = 1; i <= COMMAND.length; i++) {
      timers.current.push(setTimeout(() => setTyped(i), 45 * i));
    }
    const start = 45 * COMMAND.length + 400;
    for (let i = 1; i <= LINES.length; i++) {
      timers.current.push(setTimeout(() => setShown(i), start + 430 * i));
    }
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          observer.disconnect();
          play();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      clear();
    };
  }, [play]);

  const typingDone = typed >= COMMAND.length;
  const finished = shown >= LINES.length;

  return (
    <div
      ref={ref}
      className={cn(
        'overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 shadow-lg',
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-zinc-800 bg-zinc-900 px-4 py-2.5">
        <span className="size-3 rounded-full bg-red-500" />
        <span className="size-3 rounded-full bg-yellow-500" />
        <span className="size-3 rounded-full bg-green-500" />
        <span className="ml-2 font-mono text-xs text-zinc-500">
          my-app — zsh
        </span>
        {finished && (
          <button
            type="button"
            onClick={play}
            className="ml-auto flex items-center gap-1 rounded px-1.5 py-0.5 font-mono text-xs text-zinc-400 transition-colors hover:text-zinc-100"
            aria-label="Replay"
          >
            <RotateCcw className="size-3" />
            replay
          </button>
        )}
      </div>

      <div className="min-h-[320px] space-y-1 p-4 font-mono text-sm leading-6">
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span className="text-emerald-400 select-none">$</span>
          <span className="text-zinc-100">{COMMAND.slice(0, typed)}</span>
          {!typingDone && (
            <span className="inline-block h-4 w-[7px] animate-pulse bg-zinc-100 align-middle" />
          )}
        </div>

        {typingDone &&
          LINES.slice(0, shown).map((line, i) => (
            <div
              key={i}
              className="animate-in duration-300 fade-in slide-in-from-bottom-1"
            >
              {line.kind === 'prompt' && (
                <span className="whitespace-nowrap">
                  <span className="text-cyan-400">◆</span>{' '}
                  <span className="text-zinc-400">{line.label}</span>{' '}
                  <span className="text-zinc-500">›</span>{' '}
                  <span className="text-zinc-100">{line.answer}</span>
                </span>
              )}
              {line.kind === 'task' && (
                <span>
                  <span className="text-emerald-400">◇</span>{' '}
                  <span className="text-zinc-400">{line.text}</span>
                </span>
              )}
              {line.kind === 'done' && (
                <span className="mt-1 block text-emerald-400">
                  ✓ {line.text}
                </span>
              )}
              {line.kind === 'hint' && (
                <span className="block pl-4 text-cyan-400">{line.text}</span>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
