import { cn } from "@newt-app/ui/lib/utils";

export function Band({
  id,
  index,
  eyebrow,
  title,
  lede,
  className,
  children,
}: {
  id?: string;
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("scroll-mt-(--header-height) border-b", className)}>
      <div className="container py-14 sm:py-20">
        <div className="flex items-baseline gap-3 border-b border-dashed pb-3">
          <span className="font-mono text-xs text-muted-foreground/70 tabular-nums">{index}</span>
          <p className="font-mono text-xs font-semibold tracking-[0.18em] text-amber-700 uppercase dark:text-amber-400">
            {eyebrow}
          </p>
        </div>
        <h2 className="mt-7 max-w-[30ch] text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {title}
        </h2>
        {lede && <p className="mt-4 max-w-[64ch] text-lg text-muted-foreground">{lede}</p>}
        {children}
      </div>
    </section>
  );
}
