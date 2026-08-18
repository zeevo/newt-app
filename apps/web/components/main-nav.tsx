"use client";

import { Button } from "@newt-app/ui/components/button";
import { cn } from "@newt-app/ui/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function MainNav({
  items,
  className,
  ...props
}: React.ComponentProps<"nav"> & {
  items: { href: string; label: string }[];
}) {
  const pathname = usePathname();

  return (
    <nav className={cn("items-center gap-0.5", className)} {...props}>
      {items.map((item) => (
        <Button
          key={item.href}
          variant="ghost"
          size="sm"
          nativeButton={false}
          render={
            <Link href={item.href} className={cn(pathname === item.href && "text-primary")} />
          }
        >
          {item.label}
        </Button>
      ))}
    </nav>
  );
}
