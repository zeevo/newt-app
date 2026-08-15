import { cn } from "@newt-app/ui/lib/utils";

export function InlineCode({
  className,
  ...props
}: React.ComponentProps<"code">) {
  return (
    <code
      className={cn(
        "relative rounded-md bg-muted px-[0.3rem] py-[0.2rem] font-mono text-[0.8rem] break-words text-foreground outline-none",
        className,
      )}
      {...props}
    />
  );
}
