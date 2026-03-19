'use client';

import { cn } from '@newt-app/ui/lib/utils';
import { Check, Clipboard } from 'lucide-react';
import { useRef, useState } from 'react';

export default function Pre({
  className,
  children,
  ...props
}: React.ComponentProps<'pre'>) {
  const [isCopied, setIsCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  const handleClickCopy = async () => {
    const code = preRef.current?.textContent;

    console.log(preRef);
    if (code) {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    }
  };
  return (
    <pre
      ref={preRef}
      className={cn(
        'no-scrollbar min-w-0 relative overflow-x-auto px-4 py-3.5 outline-none has-[[data-highlighted-line]]:px-0 has-[[data-line-numbers]]:px-0 has-[[data-slot=tabs]]:p-0',
        className,
      )}
      {...props}
    >
      <button
        disabled={isCopied}
        onClick={handleClickCopy}
        className="absolute right-4 size-6"
      >
        {isCopied ? <Check /> : <Clipboard />}
      </button>
      {children}
    </pre>
  );
}
