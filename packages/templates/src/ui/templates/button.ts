export default {
  filename: "packages/ui/src/button.tsx",
  template: `"use client";

import { ReactNode } from "react";
import { cn } from "./utils";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
}

export const Button = ({ children, onClick, type = "button", disabled, className }: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn("bg-white text-gray-900 rounded px-4 py-2 text-sm font-medium hover:bg-gray-100 disabled:opacity-40", className)}
    >
      {children}
    </button>
  );
};`,
};
