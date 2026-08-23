import { cn } from "@newt-app/ui/lib/utils";

// A dense visual needs a wider column than a code block does, so the split
// point is per-section rather than fixed.
export function FeatureSection({
  children,
  split = "md",
}: {
  children: React.ReactNode;
  split?: "md" | "lg";
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 items-center gap-12",
        split === "lg" ? "lg:grid-cols-2" : "md:grid-cols-2",
      )}
    >
      {children}
    </div>
  );
}
