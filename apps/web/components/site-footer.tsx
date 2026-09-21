import { siteConfig } from "@/lib/config";
import { Icons } from "./icons";
import { version as cliVersion } from "../../../packages/create-newt-app/package.json";

// the band keeps the dark theme's navy in both schemes, so the page ends on a
// rule rather than fading into the light background
const BAND = "bg-[oklch(0.19_0.03_262)] text-[oklch(0.95_0.012_85)]";

export function SiteFooter() {
  return (
    <footer className={`${BAND} mt-0`}>
      <div className="container flex flex-col gap-5 py-7 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <Icons.logo className="size-5 opacity-90" />
          <span className="text-base font-semibold tracking-wide">{siteConfig.title}</span>
          <span className="pl-2 text-xs opacity-60">
            © {new Date().getFullYear()} Shane O&apos;Neill
          </span>
        </div>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
            className="opacity-75 transition-opacity hover:opacity-100"
          >
            GitHub
          </a>
          <a
            href={siteConfig.links.npm}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 font-mono text-xs opacity-75 transition-opacity hover:opacity-100"
          >
            <span className="size-1.5 rounded-full bg-green-500" />v{cliVersion}
          </a>
          <a
            href={siteConfig.links.license}
            target="_blank"
            rel="noreferrer"
            className="opacity-75 transition-opacity hover:opacity-100"
          >
            MIT License
          </a>
          <a
            href={siteConfig.links.twitter}
            target="_blank"
            rel="noreferrer"
            className="opacity-75 transition-opacity hover:opacity-100"
          >
            <Icons.twitter className="size-3.5 fill-current" />
            <span className="sr-only">Twitter</span>
          </a>
        </nav>
      </div>
    </footer>
  );
}
