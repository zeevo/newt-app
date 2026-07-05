import Link from 'next/link';
import { MobileNav } from './mobile-nav';
import { Button } from '@newt-app/ui/components/button';
import { siteConfig } from '@/lib/config';
import { Icons } from './icons';
import { MainNav } from './main-nav';
import { ModeToggle } from '@/app/_components/mode-toggle';

export function SiteHeader() {
  return (
    <header className="bg-background sticky top-0 z-50 w-full border-b">
      <div className="container">
        <div className="flex h-(--header-height) items-center gap-2 **:data-[slot=separator]:!h-4">
          <MobileNav items={siteConfig.navItems} className="flex lg:hidden" />
          <Button
            variant="ghost"
            size="icon"
            className="hidden size-8 lg:flex"
            nativeButton={false}
            render={<Link href="/" />}
          >
            <Icons.logo className="size-5" />
            <span className="sr-only">{siteConfig.name}</span>
          </Button>
          <MainNav items={siteConfig.navItems} className="hidden lg:flex" />
          <div className="ml-auto flex items-center gap-2 md:flex-1 md:justify-end">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 shadow-none"
              nativeButton={false}
              render={
                <Link
                  href={siteConfig.links.github}
                  target="_blank"
                  rel="noreferrer"
                />
              }
            >
              <Icons.gitHub />
            </Button>
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
