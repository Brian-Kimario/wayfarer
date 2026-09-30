import React from "react";
import Button from "./Button";

interface ErrorStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export default function ErrorState({
  title,
  description,
  action,
  className = "",
}: ErrorStateProps) {
  return (
    <div
      className={`
        flex flex-col items-center justify-center
        py-12 px-4 text-center
        bg-[var(--color-error)]/5 rounded-lg border-2 border-[var(--color-error)]/20
        ${className}
      `}
    >
      <div className="mb-4 text-4xl">⚠️</div>
      <h3
        className="text-lg font-bold mb-2"
        style={{ color: "var(--color-error)" }}
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
        <Button onClick={action.onClick} variant="danger">
          {action.label}
        </Button>
      )}
    </div>
  );
}
