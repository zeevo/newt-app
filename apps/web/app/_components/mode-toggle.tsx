"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { cn } from "@newt-app/ui/lib/utils";

export function ModeToggle({ className }: { className?: string }) {
  const { setTheme, resolvedTheme } = useTheme();

  const toggleTheme = React.useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  // the label names the scheme you switch to. Both are rendered and CSS picks
  // one off the html class, so the server markup never depends on the theme
  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={toggleTheme}
      className={cn("cursor-pointer", className)}
    >
      <span className="hidden [html.dark_&]:inline">light</span>
      <span className="hidden [html.light_&]:inline">dark</span>
    </button>
  );
}
