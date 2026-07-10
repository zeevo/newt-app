'use client';

import { cn } from '@newt-app/ui/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { CopyButton } from './copy-button';

export default function Pre({
  className,
  children,
  ...props
}: React.ComponentProps<'pre'>) {
  const preRef = useRef<HTMLPreElement>(null);
  const [text, setText] = useState('');

  useEffect(() => {
    if (preRef.current) setText(preRef.current.textContent ?? '');
  }, [children]);

  return (
    <pre
      ref={preRef}
      className={cn(
        'no-scrollbar relative min-w-0 overflow-x-auto px-4 py-3.5 outline-none has-[[data-highlighted-line]]:px-0 has-[[data-line-numbers]]:px-0 has-[[data-slot=tabs]]:p-0',
        className,
      )}
      {...props}
    >
      <CopyButton value={text} />
      {children}
    </pre>
  );
}
