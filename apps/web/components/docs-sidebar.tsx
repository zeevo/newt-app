'use client';

import { SidebarSection } from '@/app/_components/sidebar-section';
import { Sidebar, SidebarContent } from '@newt-app/ui/components/sidebar';
import { Brush, Download, Hexagon, Omega, Syringe, Vect } from 'lucide-react';
import Link from 'next/link';
import { ReactElement } from 'react';

export type Item = {
  title: string;
  url: string;
  icon?: React.ReactNode;
};

const gettingStarted: Item[] = [
  {
    title: 'Installation',
    url: '/docs/installation',
  },
  {
    title: 'Philosophy',
    url: '/docs/philosophy',
  },
];

const modules: Item[] = [
  {
    title: 'trpc',
    url: '/docs/trpc',
  },
  {
    title: 'types',
    url: '/docs/types',
  },
  {
    title: 'inversify',
    url: '/docs/inversify',
  },
  {
    title: 'shadcn-ui',
    url: '/docs/shadcn-ui',
  },
];

const urlToIconMap: Record<string, ReactElement> = {
  '/docs/trpc': <Hexagon />,
  '/docs/installation': <Download />,
  '/docs/inversify': <Syringe />,
  '/docs/philosophy': <Omega />,
  '/docs/shadcn-ui': <Brush />,
  '/docs/types': (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-vector-square-icon lucide-vector-square"
    >
      <path d="M19.5 7a24 24 0 0 1 0 10" />
      <path d="M4.5 7a24 24 0 0 0 0 10" />
      <path d="M7 19.5a24 24 0 0 0 10 0" />
      <path d="M7 4.5a24 24 0 0 1 10 0" />
      <rect x="17" y="17" width="5" height="5" rx="1" />
      <rect x="17" y="2" width="5" height="5" rx="1" />
      <rect x="2" y="17" width="5" height="5" rx="1" />
      <rect x="2" y="2" width="5" height="5" rx="1" />
    </svg>
  ),
};

export function DocsSidebar() {
  return (
    <Sidebar
      className="sticky top-[calc(var(--header-height)+1px)] z-30 hidden h-[calc(100svh-var(--header-height)-var(--footer-height))] bg-transparent lg:flex"
      collapsible="none"
    >
      <SidebarContent className="no-scrollbar">
        <div className="h-(--top-spacing) shrink-0" />
        <SidebarSection title={'Getting Started'} items={gettingStarted}>
          {(item) => (
            <Link href={item.url}>
              {urlToIconMap[item.url]}
              <span>{item.title}</span>
            </Link>
          )}
        </SidebarSection>
        <SidebarSection title={'Modules'} items={modules}>
          {(item) => (
            <Link href={item.url}>
              {urlToIconMap[item.url]}
              <span>{item.title}</span>
            </Link>
          )}
        </SidebarSection>
      </SidebarContent>
    </Sidebar>
  );
}
