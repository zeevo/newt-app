import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PagerItem {
  slug: string;
  title: string;
}

interface DocsPagerProps {
  prev?: PagerItem | null;
  next?: PagerItem | null;
}

export function DocsPager({ prev, next }: DocsPagerProps) {
  if (!prev && !next) return null;

  return (
    <div className="mt-12 flex items-center justify-between gap-6 border-t border-border pt-6">
      {prev ? (
        <Link
          href={`/docs/${prev.slug}`}
          className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-4 shrink-0 transition-transform group-hover:-translate-x-0.5" />
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground/60">Previous</span>
            <span>{prev.title}</span>
          </div>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={`/docs/${next.slug}`}
          className="group flex items-center gap-2 text-right text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground/60">Next</span>
            <span>{next.title}</span>
          </div>
          <ChevronRight className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
