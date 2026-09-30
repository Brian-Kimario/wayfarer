import React from "react";
import Button from "./Button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`
        flex flex-col items-center justify-center
        py-12 px-4 text-center
        ${className}
      `}
    >
      {icon && (
        <div className="mb-4 text-5xl">{icon}</div>
      )}
      <h3
        className="text-xl font-bold mb-2"
        style={{ color: "var(--color-ink)" }}
      >
        {title}
      </h3>
      <p
        className="text-sm max-w-sm mb-6"
        style={{ color: "var(--color-muted)" }}
      >
        {description}
      </p>
      {action && (
        action.href ? (
          <a href={action.href}>
            <Button size="md">{action.label}</Button>
          </a>
        ) : (
          <Button onClick={action.onClick} size="md">
            {action.label}
          </Button>
        )
      )}
    </div>
  );
}
