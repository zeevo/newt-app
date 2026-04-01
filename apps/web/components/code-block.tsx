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
    <div className="relative group">
      <pre className="overflow-x-auto border rounded bg-red-500 cursor-text">
        <code {...props}>{children}</code>
      </pre>
      <div className="absolute top-2 right-2 pointer-events-none">
        <CopyButton className="pointer-events-auto" value={textToCopy} />
      </div>
    </div>
  );
}
