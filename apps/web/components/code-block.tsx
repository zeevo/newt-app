"use client";

import { CopyButton } from "./copy-button";

function getTextContent(node: React.ReactNode): string {
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(getTextContent).join("");
  if (node && typeof node === "object" && "props" in node) {
    const el = node as React.ReactElement<{ children?: React.ReactNode }>;
    return getTextContent(el.props.children);
  }
  return "";
}

export function CodeBlock({ children, ...props }: React.ComponentProps<"div">) {
  const textToCopy = getTextContent(children).trim();

  return (
    <div className="group relative">
      <pre className="cursor-text overflow-x-auto rounded-lg border border-border bg-code">
        <code {...props}>{children}</code>
      </pre>
      <CopyButton value={textToCopy} />
    </div>
  );
}
