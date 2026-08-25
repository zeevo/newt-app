import { cn } from "@newt-app/ui/lib/utils";

// Every band on the page is a row of one ruled sheet: the vertical rails run
// edge to edge down the whole document, so sections read as a continuous spec
// rather than a stack of separate cards. The band itself stays transparent so
// the drafting grid shows in the margins outside the rails.
export function Section({
  index,
  label,
  children,
  className,
}: {
  index: string;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className="border-b">
      <div
        className={cn(
          "mx-auto max-w-[1200px] border-x bg-background px-6 py-16 sm:px-10 sm:py-20",
          className,
        )}
      >
        <div className="mb-10 flex items-center gap-3 font-mono text-xs tracking-[0.2em] uppercase">
          <span className="text-brand">{index}</span>
          <span className="text-muted-foreground">{label}</span>
          <span className="h-px flex-1 bg-border" />
        </div>
        {children}
      </div>
    </section>
  );
}
