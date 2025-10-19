import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "success";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 tracking-tight shadow-sm hover:shadow-md active:scale-[0.98]";
    
    const variants = {
      default: "bg-gradient-to-r from-sky-600 to-sky-700 text-white hover:from-sky-700 hover:to-sky-800 shadow-sky-600/20",
      destructive: "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-red-600/20",
      outline: "border-2 border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 text-gray-700",
      secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200",
      ghost: "hover:bg-gray-100 hover:text-gray-900 shadow-none",
      link: "text-primary underline-offset-4 hover:underline shadow-none",
      success: "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 shadow-emerald-600/20",
    };

    const sizes = {
      default: "h-10 px-5 py-2.5",
      sm: "h-9 rounded-lg px-4 text-xs",
      lg: "h-12 rounded-xl px-8 text-base",
      icon: "h-10 w-10",
    };

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
