'use client';

import { cn } from '@newt-app/ui/lib/utils';
import { Link } from 'lucide-react';
import { toast } from 'sonner';

interface HeadingWithAnchorProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  id: string;
  children: React.ReactNode;
  className?: string;
}

export function HeadingWithAnchor({
  level,
  id,
  children,
  className,
}: HeadingWithAnchorProps) {
  const copyToClipboard = async () => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const renderHeading = () => {
    const baseClasses = 'scroll-mt-20';

    switch (level) {
      case 1:
        return (
          <h1
            id={id}
            className={cn(
              'scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance',
              className,
            )}
          >
            {children}
          </h1>
        );
      case 2:
        return (
          <h2
            id={id}
            className={cn(
              'mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors',
              className,
            )}
          >
            {children}
          </h2>
        );
      case 3:
        return (
          <h3
            id={id}
            className={cn(
              'scroll-m-20 text-2xl font-semibold tracking-tight',
              className,
            )}
          >
            {children}
          </h3>
        );
      case 4:
        return (
          <h4
            id={id}
            className={cn(
              'scroll-m-20 text-xl font-semibold tracking-tight',
              className,
            )}
          >
            {children}
          </h4>
        );
      case 5:
        return (
          <h5 id={id} className={cn(baseClasses, className)}>
            {children}
          </h5>
        );
      case 6:
        return (
          <h6 id={id} className={cn(baseClasses, className)}>
            {children}
          </h6>
        );
      default:
        return (
          <h2 id={id} className={cn(baseClasses, className)}>
            {children}
          </h2>
        );
    }
  };

  return (
    <div className={cn('group relative', className)}>
      {renderHeading()}
      <button
        onClick={copyToClipboard}
        className={cn(
          'absolute -left-6 top-1/2 -translate-y-3/4 opacity-0 group-hover:opacity-100 transition-opacity duration-200',
          'p-1 rounded-md hover:bg-accent hover:text-accent-foreground',
          'focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        )}
        aria-label={`Copy link to ${children}`}
        title={`Copy link to ${children}`}
      >
        <Link className="h-4 w-4" />
      </button>
    </div>
  );
}
