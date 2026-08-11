'use client';

import * as React from 'react';
import { Button } from '@newt-app/ui/components/button';
import { cn } from '@newt-app/ui/lib/utils';
import { copyToClipboardWithMeta } from '@/components/copy-button';

export function CopyCommandButton({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
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
        'h-auto shrink-0 bg-linear-to-b from-primary to-primary/85 px-5 shadow-sm transition-all duration-200 hover:to-primary active:scale-[0.98] motion-reduce:transition-none',
        className,
      )}
      onClick={async () => {
        if (await copyToClipboardWithMeta(value)) setHasCopied(true);
      }}
    >
      <span className="font-mono text-xs">copy</span>
      <span className="sr-only" aria-live="polite">
        {hasCopied ? 'Copied' : ''}
      </span>
    </Button>
  );
}
