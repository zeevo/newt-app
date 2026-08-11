'use client';

import * as React from 'react';
import { CheckIcon, ClipboardIcon } from 'lucide-react';
import { Button } from '@newt-app/ui/components/button';
import { cn } from '@newt-app/ui/lib/utils';
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
      size="sm"
      variant="outline"
      // fixed width so the copied swap cannot resize the flexing code block
      className="min-w-24 shrink-0"
      onClick={async () => {
        if (await copyToClipboardWithMeta(value)) setHasCopied(true);
      }}
    >
      {/* both icons are stacked so the swap can cross-fade rather than pop */}
      <span className="relative inline-block size-3.5 shrink-0">
        <ClipboardIcon
          className={cn(
            'absolute inset-0 size-3.5 transition-all duration-200 motion-reduce:transition-none',
            hasCopied && 'scale-50 opacity-0',
          )}
        />
        <CheckIcon
          className={cn(
            'absolute inset-0 size-3.5 scale-50 text-emerald-500 opacity-0 transition-all duration-200 motion-reduce:transition-none',
            hasCopied && 'scale-100 opacity-100',
          )}
        />
      </span>
      <span className="font-mono text-xs">{hasCopied ? 'copied' : 'copy'}</span>
    </Button>
  );
}
