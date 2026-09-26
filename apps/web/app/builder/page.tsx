import { Suspense } from "react";
import type { Metadata } from "next";
import { InteractiveFileTree } from "@/components/interactive-file-tree";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: `Command builder — ${siteConfig.title}`,
  description: "Pick the options and copy the create-newt-app command.",
};

export default function BuilderPage() {
  // the footer's tank is tall enough to eat into min-h-svh, so the builder
  // claims the screen below the header and pushes the footer past it
  return (
    <div className="relative flex min-h-[calc(100svh-var(--header-height))] flex-1 flex-col overflow-hidden">
      <div aria-hidden className="hero-wash pointer-events-none absolute inset-0 -z-10" />
      <div className="container flex flex-1 flex-col py-10">
        {/* nuqs reads useSearchParams, which needs a boundary on a statically
            rendered page */}
        <Suspense>
          <InteractiveFileTree fullscreen className="flex-1" />
        </Suspense>
      </div>
    </div>
  );
}
