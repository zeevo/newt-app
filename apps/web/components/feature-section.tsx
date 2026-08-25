import { cn } from "@newt-app/ui/lib/utils";

// A dense visual needs a wider column than a code block does, so the split
// point is per-section rather than fixed. `wide` names the side that takes two
// thirds of the row, for the sections where the code is the subject and the
// prose beside it is the caption. The two thirds wait until xl: a third of a
// tablet is around 200px, which shreds a heading into ragged lines.
function columns(split: "md" | "lg", wide?: "start" | "end") {
  if (wide === "start") return "md:grid-cols-2 xl:grid-cols-[2fr_1fr]";
  if (wide === "end") return "md:grid-cols-2 xl:grid-cols-[1fr_2fr]";
  if (split === "lg") return "lg:grid-cols-2";
  return "md:grid-cols-2";
}

export function FeatureSection({
  children,
  split = "md",
  wide,
}: {
  children: React.ReactNode;
  split?: "md" | "lg";
  wide?: "start" | "end";
}) {
  return (
    <div className={cn("grid grid-cols-1 items-center gap-12", columns(split, wide))}>
      {children}
    </div>
  );
}
