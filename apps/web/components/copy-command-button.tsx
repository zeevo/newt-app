"use client";

import * as React from "react";
import { Button } from "@newt-app/ui/components/button";
import { cn } from "@newt-app/ui/lib/utils";
import { copyToClipboardWithMeta } from "@/components/copy-button";

// Written out in full rather than interpolated: Tailwind scans source text, so
// a variant built with a template literal never reaches the generated CSS.
// Wide and soft at rest, tightening to a brighter core on hover. The press
// flash is over in a frame, so the copied state holds it for the full two
// seconds.
const GLOW = [
  "shadow-[0_0_30px_-2px_rgba(253,146,62,0.55),0_0_58px_-10px_rgba(217,98,30,0.5)]",
  "hover:shadow-[0_0_20px_-3px_rgba(253,146,62,0.7),0_0_36px_-10px_rgba(217,98,30,0.55)]",
  "active:shadow-[0_0_34px_0px_rgba(253,146,62,0.95),0_0_64px_-4px_rgba(217,98,30,0.8)]",
  "data-[copied=true]:shadow-[0_0_34px_0px_rgba(253,146,62,0.95),0_0_64px_-4px_rgba(217,98,30,0.8)]",
].join(" ");

export function CopyCommandButton({ value }: { value: string }) {
  const [hasCopied, setHasCopied] = React.useState(false);

  React.useEffect(() => {
    if (!hasCopied) return;
    const timer = setTimeout(() => setHasCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [hasCopied]);

  return (
    <Button
      data-slot="copy-command-button"
      data-copied={hasCopied}
      className={cn(
        "h-auto min-w-28 shrink-0 px-5 transition-shadow duration-300 motion-reduce:transition-none",
        GLOW,
      )}
      onClick={async () => {
        if (await copyToClipboardWithMeta(value)) setHasCopied(true);
      }}
    >
      <span aria-live="polite">{hasCopied ? "Copied" : "Copy"}</span>
    </Button>
  );
}
