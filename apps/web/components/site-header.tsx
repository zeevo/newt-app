import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { Icons } from "./icons";
import { ModeToggle } from "@/app/_components/mode-toggle";

const navLink = "text-sm text-muted-foreground transition-colors hover:text-foreground";

export function SiteHeader() {
  return (
    <header className="w-full border-b bg-background">
      <div className="container">
        <div className="flex h-(--header-height) items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Icons.logo className="size-5" />
            <span className="text-lg leading-none font-medium">{siteConfig.title}</span>
          </Link>
          <nav className="flex items-center gap-5">
            <a href={siteConfig.links.github} target="_blank" rel="noreferrer" className={navLink}>
              github
            </a>
            <a href={siteConfig.links.npm} target="_blank" rel="noreferrer" className={navLink}>
              npm
            </a>
            <ModeToggle className={navLink} />
          </nav>
        </div>
      </div>
    </header>
  );
}
