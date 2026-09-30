import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: "narrow" | "page" | "full";
}

export default function Container({
  children,
  className = "",
  size = "page",
}: ContainerProps) {
  const sizeStyles: Record<string, string> = {
    narrow: "max-w-2xl",
    page: "max-w-6xl",
    full: "w-full",
  };

  return (
    <div
      className={`
        mx-auto
        ${sizeStyles[size]}
        px-4 md:px-6
        ${className}
      `}
    >
      {children}
    </div>
  );
}
