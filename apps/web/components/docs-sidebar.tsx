'use client';

import { SidebarSection } from '@/app/_components/sidebar-section';
import { Sidebar, SidebarContent } from '@newt-app/ui/components/sidebar';
import { BookOpen, Download, Server, Shield, Terminal, Triangle } from 'lucide-react';
import Link from 'next/link';
import { ReactElement } from 'react';

export type Item = {
  title: string;
  url: string;
  icon?: React.ReactNode;
};

function KyselyIcon() {
  return (
    <svg viewBox="0 0 132 132" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18 2h96a16 16 0 0 1 16 16v96a16 16 0 0 1-16 16H18a16 16 0 0 1-16-16V18A16 16 0 0 1 18 2ZM41.2983 109V23.9091H46.4918V73.31H47.0735L91.9457 23.9091H98.8427L61.9062 64.1694L98.5103 109H92.0288L58.5824 67.9087L46.4918 81.2873V109H41.2983Z"
      />
    </svg>
  );
}

export const gettingStarted: Item[] = [
  {
    title: 'Introduction',
    url: '/docs/introduction',
  },
  {
    title: 'Installation',
    url: '/docs/installation',
  },
];

export const modules: Item[] = [
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
  {
    title: 'Kysely',
    url: '/docs/kysely',
  },
];

export const cli: Item[] = [
  {
    title: 'create-newt-app',
    url: '/docs/cli',
  },
];

export const deployment: Item[] = [
  {
    title: 'Standalone + Dockerfile',
    url: '/docs/deployment-standalone',
  },
  {
    title: 'Single Docker Image',
    url: '/docs/deployment-single-image',
  },
  {
    title: 'Custom Server',
    url: '/docs/deployment-custom-server',
  },
  {
    title: 'SPA Mode',
    url: '/docs/deployment-spa',
  },
  {
    title: 'Vercel',
    url: '/docs/deployment-vercel',
  },
];

const urlToIconMap: Record<string, ReactElement> = {
  '/docs/introduction': <BookOpen />,
  '/docs/installation': <Download />,
  '/docs/nextjs': <Triangle />,
  '/docs/nestjs': <Server />,
  '/docs/better-auth': <Shield />,
  '/docs/kysely': <KyselyIcon />,
  '/docs/cli': <Terminal />,
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
        <SidebarSection title={'CLI'} items={cli}>
          {(item) => (
            <Link href={item.url}>
              {urlToIconMap[item.url]}
              <span>{item.title}</span>
            </Link>
          )}
        </SidebarSection>
        <SidebarSection title={'Deployment'} items={deployment}>
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
