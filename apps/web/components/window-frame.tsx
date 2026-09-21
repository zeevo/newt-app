import { cn } from "@newt-app/ui/lib/utils";

export function WindowFrame({
  label,
  tag,
  lights,
  className,
  bodyClassName,
  children,
}: {
  label: string;
  tag?: string;
  lights?: boolean;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col overflow-hidden rounded-lg border bg-card", className)}>
      <div className="flex shrink-0 items-center gap-2 border-b border-dashed px-3.5 py-2.5">
        {lights && (
          <span aria-hidden className="mr-1.5 flex gap-1.5">
            <span className="size-2.5 rounded-full bg-rose-400/80" />
            <span className="size-2.5 rounded-full bg-amber-400/80" />
            <span className="size-2.5 rounded-full bg-emerald-400/80" />
          </span>
        )}
        <span className="truncate font-mono text-xs text-muted-foreground">{label}</span>
        {tag && (
          <span className="ml-auto pl-3 font-mono text-[0.7rem] tracking-[0.14em] text-amber-700 uppercase dark:text-amber-400">
            {tag}
          </span>
        )}
      </div>
      <div className={cn("min-h-0 flex-1", bodyClassName)}>{children}</div>
    </div>
  );
}
