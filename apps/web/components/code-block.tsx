"use client";

import { useState } from "react";
import { CopyButton } from "./copy-button";

export function CodeBlock({ children, ...props }: any) {
  const [copied, setCopied] = useState(false);
  const getTextContent = (node: any): string => {
    if (typeof node === "string") return node;
    if (Array.isArray(node)) return node.map(getTextContent).join("");
    if (node?.props?.children) return getTextContent(node.props.children);
    return "";
  };

  const textToCopy = getTextContent(children).trim();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

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
