"use client";

import { cn } from "../../../lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "w-full bg-black/60 border-2 border-yellow-400/50 text-white placeholder:text-gray-300 py-3 px-4 rounded-xl focus:outline-none focus:border-yellow-400 transition duration-200",
      className
    )}
    {...props}
  />
));

Input.displayName = "Input";
