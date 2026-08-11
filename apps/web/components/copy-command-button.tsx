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
      className="h-auto shrink-0 px-5"
      onClick={async () => {
        if (await copyToClipboardWithMeta(value)) setHasCopied(true);
      }}
    >
      Copy
      <span className="sr-only" aria-live="polite">
        {hasCopied ? 'Copied' : ''}
      </span>
    </Button>
  );
}
