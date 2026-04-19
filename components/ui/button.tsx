import * as React from "react";

import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush-300 disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" &&
          "bg-gradient-to-r from-blush-500 to-blush-700 px-5 text-white shadow-glow hover:-translate-y-0.5",
        variant === "secondary" &&
          "border border-white/60 bg-white/80 text-slate-900 shadow-soft hover:-translate-y-0.5",
        variant === "ghost" &&
          "bg-transparent text-slate-700 hover:bg-white/70",
        variant === "danger" &&
          "bg-rose-600 text-white hover:bg-rose-700",
        size === "sm" && "h-9 px-3 text-sm",
        size === "md" && "h-11 px-5 text-sm",
        size === "lg" && "h-12 px-6 text-base",
        className
      )}
      {...props}
    />
  );
}
