'use client';

import { cn } from '@newt-app/ui/lib/utils';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Extract headings from the page
    const article = document.querySelector('article');
    if (!article) return;

    const headingElements = article.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const tocItems: TocItem[] = [];

    headingElements.forEach((heading) => {
      const id =
        heading.id ||
        heading.textContent
          ?.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '') ||
        '';
      if (!heading.id) {
        heading.id = id;
      }

      tocItems.push({
        id,
        text: heading.textContent || '',
        level: parseInt(heading.tagName.charAt(1)),
      });
    });

    setHeadings(tocItems);

    // Set up intersection observer for scroll highlighting
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -80% 0px',
        threshold: 0,
      },
    );

    headingElements.forEach((heading) => {
      observer.observe(heading);
    });

    return () => {
      headingElements.forEach((heading) => {
        observer.unobserve(heading);
      });
    };
  }, []);

  if (headings.length === 0) {
    return <div>No headings found in this article.</div>;
  }

  return (
    <nav className="space-y-4">
      <h4 className="text-muted-foreground mb-4">On this page</h4>
      <ul className="space-y-1">
        {headings.map((heading) => (
          <li key={heading.id}>
            <Link
              href={`#${heading.id}`}
              className={cn(
                // "text-left w-full px-3 py-2 text-sm rounded-md transition-all duration-200",
                // "hover:bg-accent hover:text-accent-foreground",
                // "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                activeId === heading.id
                  ? 'text-foreground'
                  : 'text-muted-foreground',
                heading.level === 1 && '',
                heading.level === 2 && 'ml-4',
                heading.level === 3 && 'ml-6',
                heading.level === 4 && 'ml-8',
                heading.level === 5 && 'ml-10',
                heading.level === 6 && 'ml-12',
                'hover:text-foreground',
              )}
            >
              {heading.text}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
