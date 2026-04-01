'use client';

import { SidebarSection } from '@/app/_components/sidebar-section';
import { Sidebar, SidebarContent } from '@newt-app/ui/components/sidebar';
import { BookOpen, Download, Server, Shield, Triangle } from 'lucide-react';
import Link from 'next/link';
import { ReactElement } from 'react';

export type Item = {
  title: string;
  url: string;
  icon?: React.ReactNode;
};

const gettingStarted: Item[] = [
  {
    title: 'Introduction',
    url: '/docs/introduction',
  },
  {
    title: 'Installation',
    url: '/docs/installation',
  },
];

const modules: Item[] = [
  {
    title: 'Next.js',
    url: '/docs/nextjs',
  },
  {
    title: 'NestJS',
    url: '/docs/nestjs',
  },
  {
    title: 'Better Auth',
    url: '/docs/better-auth',
  },
];

const urlToIconMap: Record<string, ReactElement> = {
  '/docs/introduction': <BookOpen />,
  '/docs/installation': <Download />,
  '/docs/nextjs': <Triangle />,
  '/docs/nestjs': <Server />,
  '/docs/better-auth': <Shield />,
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
