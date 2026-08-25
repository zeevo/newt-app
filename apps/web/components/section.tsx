import { cn } from "@newt-app/ui/lib/utils";

// The rails run the full height of every band, so the sections read as rows of
// one continuous sheet rather than as separately stacked blocks. The vertical
// padding sits inside the rails rather than on the section, or the rails would
// break at every boundary.
export function Section({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className="border-t bg-background">
      <div className="mx-auto max-w-[1200px] px-4">
        <div className={cn("border-x px-6 py-24 sm:px-10", className)}>{children}</div>
      </div>
    </section>
  );
}
