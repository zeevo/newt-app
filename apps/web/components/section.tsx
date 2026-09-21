import { cn } from "@newt-app/ui/lib/utils";

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 font-mono text-xs font-semibold tracking-[0.18em] text-sky-700 uppercase dark:text-sky-400">
      {children}
    </p>
  );
}

export function Section({
  id,
  eyebrow,
  title,
  lede,
  tinted,
  className,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  tinted?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-(--header-height) border-b",
        tinted && "bg-sky-50/70 dark:bg-sky-950/25",
        className,
      )}
    >
      <div className="container py-14 sm:py-20">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="max-w-[30ch] text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {title}
        </h2>
        {lede && <p className="mt-4 max-w-[62ch] text-lg text-muted-foreground">{lede}</p>}
        {children}
      </div>
    </section>
  );
}
