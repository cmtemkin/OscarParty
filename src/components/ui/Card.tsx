import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  gold?: boolean;
}

export function Card({
  gold,
  className = "",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={`
        bg-oscar-card rounded-xl p-6
        ${gold ? "border-2 border-oscar-gold shadow-lg shadow-oscar-gold/10" : "border border-oscar-border"}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
