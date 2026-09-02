"use client";

import * as React from "react";
import { Button } from "@newt-app/ui/components/button";
import { copyToClipboardWithMeta } from "@/components/copy-button";

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
      className="h-auto min-w-24 shrink-0 rounded-none px-5"
      onClick={async () => {
        if (await copyToClipboardWithMeta(value)) setHasCopied(true);
      }}
    >
      <span aria-live="polite">{hasCopied ? "Copied" : "Copy"}</span>
    </Button>
  );
}
