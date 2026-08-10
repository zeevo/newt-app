'use client';

import { Button } from '@newt-app/ui/components/button';
import { cn } from '@newt-app/ui/lib/utils';
import { CheckIcon, ClipboardIcon } from 'lucide-react';
import * as React from 'react';

function legacyCopyToClipboard(value: string) {
  const textArea = document.createElement('textarea');
  textArea.value = value;
  textArea.setAttribute('readonly', '');
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  textArea.style.pointerEvents = 'none';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  textArea.setSelectionRange(0, value.length);
  let hasCopied = false;
  try {
    hasCopied = document.execCommand('copy');
  } catch {
    hasCopied = false;
  }
  document.body.removeChild(textArea);
  return hasCopied;
}

export async function copyToClipboardWithMeta(value: string) {
  if (typeof window === 'undefined' || !value) return false;
  let hasCopied = false;
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      hasCopied = true;
    } catch {
      hasCopied = legacyCopyToClipboard(value);
    }
  } else {
    hasCopied = legacyCopyToClipboard(value);
  }
  return hasCopied;
}

export function CopyButton({
  value,
  className,
  variant = 'ghost',
  label,
  ...props
}: React.ComponentProps<typeof Button> & {
  value: string;
  src?: string;
  label?: string;
}) {
  const [hasCopied, setHasCopied] = React.useState(false);

  React.useEffect(() => {
    if (hasCopied) {
      const timer = setTimeout(() => setHasCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [hasCopied]);

  return (
    <Button
      data-slot="copy-button"
      data-copied={hasCopied}
      size={label ? 'sm' : 'icon-sm'}
      variant={variant}
      className={cn(
        'absolute top-3 right-2 z-10 bg-code hover:opacity-100 focus-visible:opacity-100',
        className,
      )}
      onClick={async () => {
        const copied = await copyToClipboardWithMeta(value);
        if (copied) setHasCopied(true);
      }}
      {...props}
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
      {label ? (
        <span className="font-mono text-xs">
          {hasCopied ? 'copied' : label}
        </span>
      ) : (
        <span className="sr-only">Copy</span>
      )}
    </Button>
  );
}
