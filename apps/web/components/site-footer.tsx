import { siteConfig } from "@/lib/config";

export function SiteFooter() {
  return (
    <footer className="container mx-auto mt-16">
      <div className="flex h-(--footer-height) items-center justify-between">
        <div className="w-full px-1 text-center text-xs leading-loose text-muted-foreground sm:text-sm">
          Built by{" "}
          <a
            href={siteConfig.links.twitter}
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            zeevo
          </a>{" "}
          . The source code is available on{" "}
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            GitHub
          </a>
          .
        </div>
      </div>
    </footer>
  );
}
