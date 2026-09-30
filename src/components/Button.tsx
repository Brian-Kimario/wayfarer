"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  isLoading = false,
  disabled,
  children,
  className = "",
  ariaLabel,
  ariaDescribedBy,
  ...props
}: ButtonProps) {
  const baseStyles = `
    inline-flex items-center justify-center
    font-medium transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
    focus-visible:outline-2 focus-visible:outline-offset-2
  `;

  const variantStyles: Record<string, string> = {
    primary: `
      bg-[var(--color-ocean-700)] text-white
      hover:bg-[var(--color-ocean-950)] active:bg-[var(--color-ocean-950)]
      focus-visible:outline-[var(--color-ocean-700)]
    `,
    secondary: `
      bg-[var(--color-surface)] text-[var(--color-ink)]
      border border-[var(--color-border)]
      hover:bg-white active:bg-white
      focus-visible:outline-[var(--color-ocean-700)]
    `,
    tertiary: `
      bg-transparent text-[var(--color-ocean-700)]
      hover:text-[var(--color-ocean-950)] active:text-[var(--color-ocean-950)]
      hover:bg-[var(--color-surface)]/50
      focus-visible:outline-[var(--color-ocean-700)]
    `,
    danger: `
      bg-[var(--color-error)] text-white
      hover:bg-[var(--color-terracotta)] active:bg-[var(--color-terracotta)]
      focus-visible:outline-[var(--color-error)]
    `,
  };

  const sizeStyles: Record<string, string> = {
    sm: "px-3 py-1.5 text-sm rounded-md gap-2",
    md: "px-4 py-2.5 text-base rounded-lg gap-2",
    lg: "px-6 py-3 text-lg rounded-lg gap-3",
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      disabled={disabled || isLoading}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${widthStyle}
        ${className}
      `}
      {...(ariaLabel && { "aria-label": ariaLabel })}
      {...(ariaDescribedBy && { "aria-describedby": ariaDescribedBy })}
      aria-busy={Boolean(isLoading)}
      {...props}
    >
      {isLoading && (
        <svg
          className="w-4 h-4 animate-spin -ml-1 mr-2"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
