export default {
  filename: "packages/ui/src/code.tsx",
  template: `import { type JSX } from "react";

export function Code({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}): JSX.Element {
  return <code className={className}>{children}</code>;
}`,
};
