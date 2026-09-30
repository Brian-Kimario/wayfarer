import React from "react";

interface RatingProps {
  score: number;
  count?: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export default function Rating({ score, count, size = "md", showLabel = true }: RatingProps) {
  const stars = Math.round(score * 2) / 2; // Round to nearest 0.5
  const maxStars = 5;
  const filledStars = Math.floor(stars);
  const hasHalfStar = stars % 1 !== 0;

  const sizeStyles: Record<string, { star: string; text: string }> = {
    sm: { star: "w-3 h-3", text: "text-xs" },
    md: { star: "w-4 h-4", text: "text-sm" },
    lg: { star: "w-5 h-5", text: "text-base" },
  };

  return (
    <div className="flex items-center gap-1.5" role="img" aria-label={`${score} out of 5 stars${count ? ` (${count} reviews)` : ''}`}>
      <div className="flex gap-0.5" aria-hidden="true">
        {Array.from({ length: maxStars }).map((_, i) => (
          <div key={i} className="relative">
            {/* Background star */}
            <svg
              className={`${sizeStyles[size].star} text-[var(--color-border)]`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {/* Filled star overlay */}
            {i < filledStars && (
              <svg
                className={`${sizeStyles[size].star} text-[var(--color-gold)] absolute top-0 left-0`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            )}
            {/* Half star overlay */}
            {i === filledStars && hasHalfStar && (
              <div className={`${sizeStyles[size].star} absolute top-0 left-0 overflow-hidden w-1/2`}>
                <svg
                  className={`${sizeStyles[size].star} text-[var(--color-gold)]`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
      {showLabel && (
        <div className={`${sizeStyles[size].text} font-semibold`} style={{ color: "var(--color-ink)" }}>
          {score.toFixed(1)}
        </div>
      )}
      {count && (
        <div className={`${sizeStyles[size].text}`} style={{ color: "var(--color-muted)" }}>
          ({count})
        </div>
      )}
    </div>
  );
}
