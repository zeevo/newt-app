import { cn } from "@newt-app/ui/lib/utils";

export function InlineCode({ className, ...props }: React.ComponentProps<"code">) {
  return (
    <code
      className={cn("font-mono text-[0.85em] break-words text-brand outline-none", className)}
      {...props}
    />
  );
}
