'use client';

import { cn } from '@newt-app/ui/lib/utils';
import { useEffect, useMemo, useState } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

function useActiveItem(ids: string[]) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries
          .filter((entry) => entry.isIntersecting)
          .forEach((entry) => setActiveId(entry.target.id));
      },
      { rootMargin: '0% 0% -80% 0%' },
    );

    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el) => el !== null);

    els.forEach((el) => observer.observe(el));

    return () => els.forEach((el) => observer.unobserve(el));
  }, [ids]);

  return activeId;
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<TocItem[]>([]);

  useEffect(() => {
    const article = document.querySelector('article');
    if (!article) return;

    const els = article.querySelectorAll('h2, h3, h4, h5, h6');
    const items: TocItem[] = [];

    els.forEach((el) => {
      const id =
        el.id ||
        el.textContent
          ?.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '') ||
        '';
      if (!el.id) el.id = id;
      items.push({ id, text: el.textContent || '', level: parseInt(el.tagName.charAt(1)) });
    });

    setHeadings(items);
  }, []);

  const ids = useMemo(() => headings.map((h) => h.id), [headings]);
  const activeId = useActiveItem(ids);

  if (headings.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 p-4 pt-0 text-sm">
      <p className="sticky top-0 h-6 bg-background text-xs font-medium text-muted-foreground">
        On This Page
      </p>
      {headings.map((heading) => (
        <a
          key={heading.id}
          href={`#${heading.id}`}
          data-active={activeId === heading.id}
          data-depth={heading.level}
          className={cn(
            'text-[0.8rem] text-muted-foreground no-underline transition-colors hover:text-foreground',
            'data-[active=true]:font-medium data-[active=true]:text-foreground',
            'data-[depth=3]:pl-4 data-[depth=4]:pl-6 data-[depth=5]:pl-8 data-[depth=6]:pl-10',
          )}
        >
          {heading.text}
        </a>
      ))}
    </div>
  );
}
