export default {
  filename: "packages/ui/src/components/skeleton.tsx",
  template: `import { cn } from "@<%= projectName %>/ui/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
`,
};
