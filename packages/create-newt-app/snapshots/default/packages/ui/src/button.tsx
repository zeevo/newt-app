"use client";

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
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all",
        "h-9 px-4 py-2",
        "bg-white text-gray-900 shadow-xs hover:bg-gray-100",
        "disabled:pointer-events-none disabled:opacity-50",
        "outline-none focus-visible:ring-2 focus-visible:ring-white/50",
        className
      )}
    >
      {children}
    </button>
  );
};