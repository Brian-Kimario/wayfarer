import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "success" | "warning" | "error" | "info";
  className?: string;
}

export default function Badge({
  children,
  variant = "primary",
  className = "",
}: BadgeProps) {
  const variantStyles: Record<string, string> = {
    primary: "bg-[var(--color-ocean-700)]/10 text-[var(--color-ocean-700)]",
    success: "bg-[var(--color-success)]/10 text-[var(--color-success)]",
    warning: "bg-[var(--color-gold)]/20 text-[var(--color-terracotta)]",
    error: "bg-[var(--color-error)]/10 text-[var(--color-error)]",
    info: "bg-[var(--color-sea-glass)]/10 text-[var(--color-sea-glass)]",
  };

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5
        text-xs font-semibold
        rounded-full
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
