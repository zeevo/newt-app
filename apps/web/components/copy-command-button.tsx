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

export function CopyCommandButton({ value }: { value: string }) {
  const [hasCopied, setHasCopied] = React.useState(false);

  React.useEffect(() => {
    if (!hasCopied) return;
    const timer = setTimeout(() => setHasCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [hasCopied]);

  return (
    <Button
      data-slot="copy-command-button"
      data-copied={hasCopied}
      className={cn(
        'relative h-auto min-w-28 shrink-0 overflow-hidden px-5 transition-shadow duration-300 motion-reduce:transition-none',
        GLOW,
      )}
      onClick={async () => {
        if (await copyToClipboardWithMeta(value)) setHasCopied(true);
      }}
    >
      <span aria-hidden className="copy-sheen" />
      <span className="relative" aria-live="polite">
        {hasCopied ? 'Copied' : 'Copy'}
      </span>
    </Button>
  );
}
