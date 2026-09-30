import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "outlined";
  onClick?: () => void;
}

export default function Card({
  children,
  className = "",
  variant = "default",
  onClick,
}: CardProps) {
  const variantStyles: Record<string, string> = {
    default: "bg-white border border-[var(--color-border)] shadow-sm",
    elevated: "bg-white shadow-lg",
    outlined: "bg-transparent border-2 border-[var(--color-border)]",
  };

  return (
    <div
      className={`
        rounded-lg
        ${variantStyles[variant]}
        ${onClick ? "cursor-pointer transition-all duration-200 hover:shadow-md" : ""}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
