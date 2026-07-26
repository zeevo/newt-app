import { siteConfig } from '@/lib/config';
import Link from 'next/link';
import { Icons } from './icons';
import { version as cliVersion } from '../../../packages/create-newt-app/package.json';

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="container mx-auto flex flex-col gap-4 px-4 py-6 sm:h-(--footer-height) sm:flex-row sm:items-center sm:justify-between sm:py-0">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <Icons.logo className="size-4" />
          <span>
            © {new Date().getFullYear()} zeevo ·{' '}
            <a
              href={siteConfig.links.license}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-foreground"
            >
              MIT
            </a>
          </span>
        </div>
        <nav className="flex items-center gap-5 text-sm text-muted-foreground">
          <Link
            href="/docs/introduction"
            className="transition-colors hover:text-foreground"
          >
            Docs
          </Link>
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-foreground"
          >
            GitHub
          </a>
          <a
            href={siteConfig.links.npm}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 font-mono text-xs transition-colors hover:text-foreground"
          >
            <span className="size-1.5 rounded-full bg-green-500" />v{cliVersion}
          </a>
          <a
            href={siteConfig.links.twitter}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-foreground"
          >
            <Icons.twitter className="size-3.5 fill-current" />
            <span className="sr-only">Twitter</span>
          </a>
        </nav>
      </div>
    </footer>
  );
}
