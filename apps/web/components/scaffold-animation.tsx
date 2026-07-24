'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@newt-app/ui/lib/utils';

type Node = { name: string; annotation?: string; children?: Node[] };

const tree: Node = {
  name: 'my-app',
  children: [
    {
      name: 'apps',
      children: [
        {
          name: 'web',
          annotation: 'Next.js frontend',
          children: [
            {
              name: 'app',
              children: [
                {
                  name: 'dashboard',
                  children: [{ name: 'page.tsx', annotation: 'dashboard route' }],
                },
                { name: 'layout.tsx' },
                { name: 'page.tsx', annotation: 'home route' },
              ],
            },
          ],
        },
        {
          name: 'api',
          annotation: 'NestJS backend',
          children: [
            {
              name: 'src',
              children: [
                {
                  name: 'hello',
                  children: [
                    { name: 'hello.controller.ts' },
                    { name: 'hello.module.ts' },
                  ],
                },
                { name: 'app.module.ts' },
                { name: 'main.ts' },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'packages',
      children: [
        { name: 'ui', annotation: 'Shared component library' },
        { name: 'auth', annotation: 'Better Auth configuration' },
        { name: 'db', annotation: 'Kysely client + migrations' },
        { name: 'eslint-config', annotation: 'Shared ESLint config' },
        { name: 'typescript-config', annotation: 'Shared TypeScript config' },
      ],
    },
  ],
};

type Row = { prefix: string; name: string; annotation?: string; isDir: boolean };

function flatten(node: Node): Row[] {
  const rows: Row[] = [{ prefix: '', name: node.name, isDir: true }];
  const walk = (nodes: Node[], pipes: string) => {
    nodes.forEach((n, i) => {
      const last = i === nodes.length - 1;
      rows.push({
        prefix: pipes + (last ? '└─ ' : '├─ '),
        name: n.name,
        annotation: n.annotation,
        isDir: !!n.children,
      });
      if (n.children) walk(n.children, pipes + (last ? '   ' : '│  '));
    });
  };
  if (node.children) walk(node.children, '');
  return rows;
}

const ROWS = flatten(tree);
const COMMAND = 'npm create newt-app';

export function ScaffoldAnimation({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [typed, setTyped] = useState(0);
  const [revealed, setRevealed] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setTyped(COMMAND.length);
      setRevealed(ROWS.length);
      setDone(true);
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    const run = () => {
      // type the command
      for (let i = 1; i <= COMMAND.length; i++) {
        timers.push(setTimeout(() => setTyped(i), 40 * i));
      }
      const afterType = 40 * COMMAND.length + 350;
      // reveal the tree row by row
      for (let i = 1; i <= ROWS.length; i++) {
        timers.push(setTimeout(() => setRevealed(i), afterType + 85 * i));
      }
      timers.push(
        setTimeout(() => setDone(true), afterType + 85 * ROWS.length + 250),
      );
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          observer.disconnect();
          run();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  const typingDone = typed >= COMMAND.length;

  return (
    <div
      ref={ref}
      className={cn('font-mono text-sm leading-7', className)}
      aria-hidden="true"
    >
      <div className="flex items-center gap-2 whitespace-nowrap">
        <span className="text-muted-foreground select-none">$</span>
        <span className="text-foreground">{COMMAND.slice(0, typed)}</span>
        {!done && (
          <span className="inline-block h-4 w-[7px] animate-pulse bg-foreground align-middle" />
        )}
      </div>

      {typingDone && (
        <div className="mt-2 flex items-center gap-2 text-muted-foreground">
          {done ? (
            <span className="text-emerald-500">✓</span>
          ) : (
            <span className="inline-block animate-spin text-foreground">◐</span>
          )}
          <span>{done ? 'Scaffolded' : 'Scaffolding project…'}</span>
        </div>
      )}

      {typingDone && (
        <div className="mt-3">
          {ROWS.map((row, i) => (
            <div
              key={i}
              className={cn(
                'flex whitespace-pre transition-all duration-300 ease-out',
                i < revealed ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0',
              )}
            >
              <span className="text-muted-foreground select-none">{row.prefix}</span>
              <span className="text-foreground">
                {row.name}
                {row.isDir ? '/' : ''}
              </span>
              {row.annotation && (
                <span className="ml-3 text-xs text-muted-foreground">{row.annotation}</span>
              )}
            </div>
          ))}
        </div>
      )}

      {done && (
        <div className="mt-3 text-emerald-500">✓ Done in 1.2s</div>
      )}
    </div>
  );
}
