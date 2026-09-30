import React from "react";
import { formatMoney } from "@/lib/format";

interface PriceProps {
  amount: number;
  currency?: string;
  period?: string;
  size?: "sm" | "md" | "lg";
  highlight?: boolean;
}

export default function Price({
  amount,
  currency = "USD",
  period,
  size = "md",
  highlight = false,
}: PriceProps) {
  const sizeStyles: Record<string, string> = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  };

  const priceColor = highlight
    ? "text-[var(--color-sunset)]"
    : "text-[var(--color-ink)]";

  return (
    <div className="flex items-baseline gap-1">
      <span
        className={`${sizeStyles[size]} font-bold ${priceColor}`}
      >
        {formatMoney(amount)}
      </span>
      {period && (
        <span className="text-sm" style={{ color: "var(--color-muted)" }}>
          {period}
        </span>
      )}
    </div>
  );
}
