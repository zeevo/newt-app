import { siteConfig } from "@/lib/config";
import { Icons } from "./icons";
import { CopyButton } from "./copy-button";
import { version as cliVersion } from "../../../packages/create-newt-app/package.json";

// the band keeps the dark theme's navy in both schemes, so the spec sheet ends
// on a rule rather than fading out into the page background
const BAND = "bg-[oklch(0.19_0.03_262)] text-[oklch(0.95_0.012_85)]";

export function SiteFooter() {
  return (
    <footer className={BAND}>
      <div className="container flex flex-col gap-6 py-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          <Icons.logo className="size-5 opacity-90" />
          <span className="text-base font-semibold tracking-wide">{siteConfig.title}</span>
          <span className="flex h-9 items-center gap-2 rounded-lg border border-white/15 pr-1 pl-4 font-mono text-sm">
            <span className="opacity-50 select-none">$</span>
            npm create newt-app
            <CopyButton
              value="npm create newt-app"
              className="static size-7 bg-transparent hover:bg-white/10"
            />
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
            MIT
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
          <span className="text-xs opacity-55">
            © {new Date().getFullYear()} Shane O&apos;Neill
          </span>
        </nav>
      </div>
    </footer>
  );
}
