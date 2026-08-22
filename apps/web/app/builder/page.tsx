import { Suspense } from "react";
import type { Metadata } from "next";
import { InteractiveFileTree } from "@/components/interactive-file-tree";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: `Command builder — ${siteConfig.title}`,
  description: "Pick the options and copy the create-newt-app command.",
};

export default function BuilderPage() {
  return (
    <div className="container flex flex-1 flex-col py-10">
      {/* nuqs reads useSearchParams, which needs a boundary on a statically
          rendered page */}
      <Suspense>
        <InteractiveFileTree fullscreen className="flex-1" />
      </Suspense>
    </div>
  );
}
