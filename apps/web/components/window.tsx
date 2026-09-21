import { cn } from "@newt-app/ui/lib/utils";

export function Window({
  label,
  action,
  className,
  barClassName,
  children,
}: {
  label?: string;
  action?: React.ReactNode;
  className?: string;
  barClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border bg-code shadow-[0_18px_40px_-20px_oklch(0.24_0.018_55/0.35)] dark:shadow-[0_18px_40px_-20px_oklch(0_0_0/0.6)]",
        className,
      )}
    >
      <div
        className={cn(
          "flex shrink-0 items-center gap-1.5 border-b bg-foreground/[0.03] px-3.5 py-2.5",
          barClassName,
        )}
      >
        <span aria-hidden className="size-2.5 rounded-full bg-rose-400/80" />
        <span aria-hidden className="size-2.5 rounded-full bg-amber-400/80" />
        <span aria-hidden className="size-2.5 rounded-full bg-emerald-400/80" />
        {label && (
          <span className="ml-auto truncate pl-3 font-mono text-xs text-muted-foreground">
            {label}
          </span>
        )}
        {action && <span className={cn(label ? "pl-2" : "ml-auto pl-3")}>{action}</span>}
      </div>
      {children}
    </div>
  );
}
