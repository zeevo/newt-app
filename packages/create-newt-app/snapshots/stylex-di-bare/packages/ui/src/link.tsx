import NextLink, { type LinkProps } from "next/link";
import { type PropsWithChildren } from "react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { colors } from "./tokens.stylex";

export function Link({
  href,
  children,
  style,
  ...rest
}: PropsWithChildren<LinkProps & { style?: StyleXStyles }>) {
  return (
    <NextLink href={href} {...rest} {...stylex.props(styles.link, style)}>
      {children}
    </NextLink>
  );
}

const styles = stylex.create({
  link: {
    color: "inherit",
    textDecorationLine: "underline",
    textDecorationColor: {
      default: colors.mutedForeground,
      ":hover": colors.foreground,
    },
    transitionProperty: "text-decoration-color",
    transitionDuration: "150ms",
  },
});
