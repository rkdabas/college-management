import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-blue-50 text-blue-700 border border-blue-200/50 shadow-sm",
    secondary: "bg-gray-100 text-gray-700 border border-gray-200/50",
    destructive: "bg-red-50 text-red-700 border border-red-200/50 shadow-sm",
    outline: "text-gray-700 border-2 border-gray-200 bg-white",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200/50 shadow-sm",
    warning: "bg-amber-50 text-amber-700 border border-amber-200/50 shadow-sm",
    info: "bg-sky-50 text-sky-700 border border-sky-200/50 shadow-sm",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold tracking-tight transition-all duration-200",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
