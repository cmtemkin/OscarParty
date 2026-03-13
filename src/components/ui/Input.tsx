"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm text-oscar-text-muted mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-3 rounded-lg bg-oscar-black border
            text-oscar-text placeholder:text-oscar-text-muted/50
            focus:outline-none focus:ring-2 focus:ring-oscar-gold/50 focus:border-oscar-gold
            transition-all duration-200
            ${error ? "border-oscar-red" : "border-oscar-border"}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-oscar-red">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
