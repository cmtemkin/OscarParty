"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-oscar-gold hover:bg-oscar-gold-light text-oscar-black font-bold",
  secondary:
    "bg-oscar-card hover:bg-oscar-card-hover text-oscar-text border border-oscar-border",
  danger: "bg-oscar-red hover:bg-oscar-red-light text-white font-bold",
  ghost: "bg-transparent hover:bg-oscar-card text-oscar-text-muted",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", fullWidth, className = "", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`
          px-6 py-3 rounded-lg text-base transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          cursor-pointer
          ${variantStyles[variant]}
          ${fullWidth ? "w-full" : ""}
          ${className}
        `}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
