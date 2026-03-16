export default {
  filename: "packages/ui/src/link.tsx",
  template: `"use client";

import { AnchorHTMLAttributes } from "react";

export function Link({ children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      className="hover:underline underline-offset-2 hover:text-gray-900 transition-colors"
      {...props}
    >
      {children}
    </a>
  );
}`,
};
