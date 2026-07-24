'use client';

import { useEffect, useRef, useState } from 'react';
import { FileTree } from '@/components/file-tree';
import { cn } from '@newt-app/ui/lib/utils';

export function RevealFileTree({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rows = Array.from(el.querySelectorAll<HTMLElement>('.h-7'));

    if (reduce) {
      rows.forEach((r) => (r.style.transition = 'none'));
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          observer.disconnect();
          // stagger each row line as the tree comes into view
          rows.forEach((r, i) => (r.style.transitionDelay = `${i * 45}ms`));
          setRevealed(true);
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        '[&_.h-7]:transition-all [&_.h-7]:duration-300 [&_.h-7]:ease-out',
        revealed
          ? '[&_.h-7]:translate-y-0 [&_.h-7]:opacity-100'
          : '[&_.h-7]:translate-y-1.5 [&_.h-7]:opacity-0',
        className,
      )}
    >
      <div className="mb-3 flex items-center gap-2 font-mono text-sm whitespace-nowrap">
        <span className="text-muted-foreground select-none">$</span>
        <span className="text-foreground">npm create newt-app</span>
        <span className="inline-block h-4 w-[7px] animate-pulse bg-foreground align-middle" />
      </div>

      <FileTree
        name="my-app"
        className="my-0 bg-transparent p-0 dark:bg-transparent"
      >
        <FileTree.Folder name="apps">
          <FileTree.Folder name="web" annotation="Next.js frontend">
            <FileTree.Folder name="app">
              <FileTree.Folder name="dashboard">
                <FileTree.File name="page.tsx" annotation="dashboard route" />
              </FileTree.Folder>
              <FileTree.File name="layout.tsx" />
              <FileTree.File name="page.tsx" annotation="home route" />
            </FileTree.Folder>
          </FileTree.Folder>
          <FileTree.Folder name="api" annotation="NestJS backend">
            <FileTree.Folder name="src">
              <FileTree.Folder name="hello">
                <FileTree.File name="hello.controller.ts" />
                <FileTree.File name="hello.module.ts" />
              </FileTree.Folder>
              <FileTree.File name="app.module.ts" />
              <FileTree.File name="main.ts" />
            </FileTree.Folder>
          </FileTree.Folder>
        </FileTree.Folder>
        <FileTree.Folder name="packages">
          <FileTree.Folder name="ui" annotation="Shared component library" />
          <FileTree.Folder name="auth" annotation="Better Auth configuration" />
          <FileTree.Folder name="db" annotation="Kysely client + migrations" />
          <FileTree.Folder name="eslint-config" annotation="Shared ESLint config" />
          <FileTree.Folder
            name="typescript-config"
            annotation="Shared TypeScript config"
          />
        </FileTree.Folder>
      </FileTree>
    </div>
  );
}
