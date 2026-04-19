import * as React from "react";

import { cn } from "@/lib/utils";

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "soft" | "success";
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        variant === "default" && "bg-blush-100 text-blush-800",
        variant === "soft" && "bg-white/80 text-slate-700 border border-white/70",
        variant === "success" && "bg-emerald-100 text-emerald-700",
        className
      )}
      {...props}
    />
  );
}
