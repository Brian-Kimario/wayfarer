import React from "react";

interface LoadingSkeletonProps {
  count?: number;
  variant?: "card" | "text" | "title" | "property";
  className?: string;
}

export default function LoadingSkeleton({
  count = 1,
  variant = "card",
  className = "",
}: LoadingSkeletonProps) {
  const baseAnimation = `
    animate-pulse
    bg-gradient-to-r from-[var(--color-surface)] via-white to-[var(--color-surface)]
    bg-[length:200%_100%]
  `;

  if (variant === "text") {
    return (
      <>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className={`h-4 rounded mb-2 ${baseAnimation}`} />
        ))}
      </>
    );
  }

  if (variant === "title") {
    return (
      <>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className={`h-8 rounded mb-3 w-3/4 ${baseAnimation}`} />
        ))}
      </>
    );
  }

  if (variant === "property") {
    return (
      <div className={`rounded-lg overflow-hidden ${className}`}>
        {/* Image placeholder */}
        <div className={`h-48 ${baseAnimation}`} />

        {/* Content placeholder */}
        <div className="p-4 space-y-3">
          <div className={`h-6 rounded w-3/4 ${baseAnimation}`} />
          <div className={`h-4 rounded w-1/2 ${baseAnimation}`} />
          <div className="space-y-2">
            <div className={`h-3 rounded ${baseAnimation}`} />
            <div className={`h-3 rounded w-5/6 ${baseAnimation}`} />
          </div>
          <div className={`h-5 rounded w-1/3 mt-4 ${baseAnimation}`} />
        </div>
      </div>
    );
  }

  // Default card variant
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`rounded-lg overflow-hidden border ${baseAnimation} ${className}`}
          style={{ borderColor: "var(--color-border)" }}
        >
          <div className="h-40" />
          <div className="p-4 space-y-2">
            <div className="h-4 rounded w-3/4" />
            <div className="h-3 rounded w-1/2" />
          </div>
        </div>
      ))}
    </>
  );
}
