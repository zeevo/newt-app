export default {
  filename: "packages/ui/src/button.tsx",
  template: `"use client";

import { ReactNode } from "react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { colors, fonts, radii } from "./tokens.stylex";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  style?: StyleXStyles;
}

export const Button = ({ children, onClick, type = "button", disabled, style }: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      {...stylex.props(styles.base, disabled && styles.disabled, style)}
    >
      {children}
    </button>
  );
};

const styles = stylex.create({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 36,
    paddingBlock: 0,
    paddingInline: 16,
    fontFamily: fonts.sans,
    fontSize: 14,
    fontWeight: 500,
    whiteSpace: "nowrap",
    color: colors.accentForeground,
    backgroundColor: {
      default: colors.accent,
      ":hover": "oklch(0.922 0 0)",
    },
    borderStyle: "none",
    borderRadius: radii.sm,
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
    cursor: "pointer",
    transitionProperty: "background-color",
    transitionDuration: "150ms",
    outlineColor: "rgba(255, 255, 255, 0.5)",
    outlineOffset: 2,
    outlineStyle: {
      default: "none",
      ":focus-visible": "solid",
    },
    outlineWidth: 2,
  },
  disabled: {
    opacity: 0.5,
    pointerEvents: "none",
  },
});
`,
};
