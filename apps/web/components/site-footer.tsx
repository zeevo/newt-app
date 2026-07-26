import { siteConfig } from '@/lib/config';
import Link from 'next/link';
import { Icons } from './icons';
import { version as cliVersion } from '../../../packages/create-newt-app/package.json';

const docsLinks = [
  { label: 'Introduction', href: '/docs/introduction' },
  { label: 'Installation', href: '/docs/installation' },
  { label: 'CLI reference', href: '/docs/cli' },
  { label: 'Deployment', href: '/docs/deployment' },
];

const stackLinks = [
  { label: 'Next.js', href: '/docs/nextjs' },
  { label: 'NestJS', href: '/docs/nestjs' },
  { label: 'Better Auth', href: '/docs/better-auth' },
];

const projectLinks = [
  { label: 'GitHub', href: siteConfig.links.github },
  { label: 'npm', href: siteConfig.links.npm },
  { label: 'Releases', href: siteConfig.links.releases },
  { label: 'Issues', href: siteConfig.links.issues },
  { label: 'MIT License', href: siteConfig.links.license },
];

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
        {title}
      </h2>
      <ul className="flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              {...(link.href.startsWith('http')
                ? { target: '_blank', rel: 'noreferrer' }
                : {})}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="container mx-auto grid gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-3">
          <Icons.logo className="size-5" />
          <p className="max-w-[26ch] text-sm text-muted-foreground">
            A production-grade, monorepo-first starter for Next.js and NestJS.
          </p>
        </div>
        <FooterColumn title="Documentation" links={docsLinks} />
        <FooterColumn title="Stack" links={stackLinks} />
        <FooterColumn title="Project" links={projectLinks} />
      </div>
      <div className="container mx-auto flex flex-col gap-3 border-t border-border/60 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} zeevo · MIT
        </p>
        <div className="flex items-center gap-4">
          <a
            href={siteConfig.links.npm}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="size-1.5 rounded-full bg-green-500" />v{cliVersion}
          </a>
          <a
            href={siteConfig.links.twitter}
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Icons.twitter className="size-3.5 fill-current" />
            <span className="sr-only">Twitter</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
