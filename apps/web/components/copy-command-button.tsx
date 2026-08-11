'use client';

import * as React from 'react';
import { Button } from '@newt-app/ui/components/button';
import { copyToClipboardWithMeta } from '@/components/copy-button';

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
      className="h-auto min-w-28 shrink-0 px-5 shadow-[0_0_18px_-4px_rgba(236,72,153,0.5),0_0_32px_-10px_rgba(168,85,247,0.45)] transition-shadow duration-300 hover:shadow-[0_0_24px_-2px_rgba(236,72,153,0.65),0_0_44px_-8px_rgba(168,85,247,0.55)] motion-reduce:transition-none"
      onClick={async () => {
        if (await copyToClipboardWithMeta(value)) setHasCopied(true);
      }}
    >
      <span aria-live="polite">{hasCopied ? 'Copied' : 'Copy'}</span>
    </Button>
  );
}
