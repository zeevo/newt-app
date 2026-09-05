import NextLink, { type LinkProps } from "next/link";
import { type PropsWithChildren } from "react";
import { cn } from "./utils";

export function Link({
  href,
  children,
  className,
  ...rest
}: PropsWithChildren<LinkProps & { className?: string }>) {
  return (
    <NextLink
      href={href}
      {...rest}
      className={cn(
        "underline decoration-muted-foreground hover:decoration-foreground transition-colors",
        className
      )}
    >
      {children}
    </NextLink>
  );
}