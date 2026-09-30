import React, { useId } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export default function Input({
  label,
  error,
  helperText,
  fullWidth = false,
  id,
  className = "",
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className={fullWidth ? "w-full" : ""}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium mb-1.5"
          style={{ color: "var(--color-ink)" }}
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          w-full px-3 py-2 text-base
          border border-[var(--color-border)] rounded-lg
          bg-white
          placeholder:text-[var(--color-muted)]
          text-[var(--color-ink)]
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-[var(--color-ocean-700)] focus:ring-offset-0
          focus:border-[var(--color-ocean-700)]
          disabled:bg-[var(--color-surface)] disabled:cursor-not-allowed
          ${error ? "border-[var(--color-error)] focus:ring-[var(--color-error)] focus:border-[var(--color-error)]" : ""}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-sm mt-1.5 font-medium" style={{ color: "var(--color-error)" }}>
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="text-sm mt-1.5" style={{ color: "var(--color-muted)" }}>
          {helperText}
        </p>
      )}
    </div>
  );
}
