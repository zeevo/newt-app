import { cn } from "@newt-app/ui/lib/utils";

export function InlineCode({
  className,
  ...props
}: React.ComponentProps<"code">) {
  return (
    <code
      className={cn(
        "relative rounded-sm border border-cyan-600/25 bg-cyan-500/10 px-[0.3rem] py-[0.2rem] font-mono text-[0.8rem] break-words text-cyan-700 outline-none dark:border-cyan-400/25 dark:text-cyan-300",
        className,
      )}
      {...props}
    />
  );
}
