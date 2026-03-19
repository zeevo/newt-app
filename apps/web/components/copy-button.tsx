'use client';

import { Button } from '@newt-app/ui/components/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@newt-app/ui/components/tooltip';
import { cn } from '@newt-app/ui/lib/utils';
import { CheckIcon, ClipboardIcon } from 'lucide-react';
import * as React from 'react';

export function copyToClipboardWithMeta(value: string) {
  navigator.clipboard.writeText(value);
}

export function CopyButton({
  value,
  className,
  ...props
}: React.ComponentProps<typeof Button> & {
  value: string;
  src?: string;
}) {
  const [hasCopied, setHasCopied] = React.useState(false);

  return (
    <Tooltip open={hasCopied}>
      <TooltipTrigger asChild>
        <Button
          size={'icon'}
          variant={'ghost'}
          className={cn('cursor-pointer z-10', className)}
          onClick={() => {
            copyToClipboardWithMeta(value);
            setHasCopied(true);
            setTimeout(() => {
              setHasCopied(false);
            }, 2000);
          }}
          {...props}
        >
          <span className="sr-only">Copy</span>
          {hasCopied ? <CheckIcon /> : <ClipboardIcon />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>Copied</TooltipContent>
    </Tooltip>
  );
}
