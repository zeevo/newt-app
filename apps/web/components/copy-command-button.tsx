'use client';

import * as React from 'react';
import { Button } from '@newt-app/ui/components/button';
import { cn } from '@newt-app/ui/lib/utils';
import { copyToClipboardWithMeta } from '@/components/copy-button';

// written out in full rather than interpolated: Tailwind scans source text, so
// a variant built with a template literal never reaches the generated CSS.
// The press flash is over in a frame, so the copied state holds the same
// brighter glow for the full two seconds.
const GLOW = [
  'shadow-[0_0_18px_-4px_rgba(236,72,153,0.5),0_0_32px_-10px_rgba(168,85,247,0.45)]',
  'hover:shadow-[0_0_24px_-2px_rgba(236,72,153,0.65),0_0_44px_-8px_rgba(168,85,247,0.55)]',
  'active:shadow-[0_0_30px_0px_rgba(236,72,153,0.9),0_0_56px_-4px_rgba(168,85,247,0.75)]',
  'data-[copied=true]:shadow-[0_0_30px_0px_rgba(236,72,153,0.9),0_0_56px_-4px_rgba(168,85,247,0.75)]',
].join(' ');

type Glare = {
  n: number;
  duration: number;
  x: number;
  glints: { left: number; top: number; size: number; delay: number }[];
};

function makeGlare(n: number): Glare {
  const duration = 0.9 + Math.random() * 0.6;
  const x = 30 + Math.random() * 40;
  const glints = Array.from(
    { length: 2 + Math.floor(Math.random() * 3) },
    () => {
      const left = 12 + Math.random() * 74;
      return {
        left,
        top: 20 + Math.random() * 58,
        size: 4 + Math.random() * 4,
        // fire as the bloom reaches this x rather than on a fixed beat
        delay: duration * (0.2 + (left / 100) * 0.5),
      };
    },
  );
  return { n, duration, x, glints };
}

export function CopyCommandButton({ value }: { value: string }) {
  const [hasCopied, setHasCopied] = React.useState(false);
  // null until the client schedules one: randomising during render would not
  // survive hydration. Remounting on `n` restarts the one-shot animations.
  const [glare, setGlare] = React.useState<Glare | null>(null);

  React.useEffect(() => {
    if (!hasCopied) return;
    const timer = setTimeout(() => setHasCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [hasCopied]);

  React.useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let timer: ReturnType<typeof setTimeout>;
    const schedule = (first = false) => {
      timer = setTimeout(
        () => {
          setGlare((prev) => makeGlare((prev?.n ?? 0) + 1));
          schedule();
        },
        first ? 900 : 5000 + Math.random() * 7000,
      );
    };
    schedule(true);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Button
      data-slot="copy-command-button"
      data-copied={hasCopied}
      className={cn(
        'relative h-auto min-w-28 shrink-0 px-5 transition-shadow duration-300 motion-reduce:transition-none',
        GLOW,
      )}
      onClick={async () => {
        if (await copyToClipboardWithMeta(value)) setHasCopied(true);
      }}
    >
      {glare && (
        <span key={glare.n} aria-hidden>
          <span
            className="copy-glare"
            style={
              {
                '--glare-duration': `${glare.duration}s`,
                '--glare-x': `${glare.x}%`,
              } as React.CSSProperties
            }
          />
          {glare.glints.map((glint, i) => (
            <span
              key={i}
              className="copy-glint"
              style={
                {
                  left: `${glint.left}%`,
                  top: `${glint.top}%`,
                  width: `${glint.size}px`,
                  height: `${glint.size}px`,
                  '--glint-delay': `${glint.delay}s`,
                } as React.CSSProperties
              }
            />
          ))}
        </span>
      )}
      <span className="relative" aria-live="polite">
        {hasCopied ? 'Copied' : 'Copy'}
      </span>
    </Button>
  );
}
