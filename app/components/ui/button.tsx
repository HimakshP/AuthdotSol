"use client";

import { cn } from "../../../lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "px-6 py-3 rounded-xl border-2 border-yellow-400 text-yellow-300 font-semibold bg-white/10 backdrop-blur-md hover:bg-yellow-400 hover:text-black transition-all duration-300 hover:scale-105 shadow-md",
      className
    )}
    {...props}
  />
));

Button.displayName = "Button";
