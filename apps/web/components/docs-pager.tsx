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
    <div className="flex items-center justify-between mt-12 pt-6 border-t border-border">
      {prev ? (
        <Link
          href={`/docs/${prev.slug}`}
          className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
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
          className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors text-right"
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
