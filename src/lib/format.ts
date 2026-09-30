/**
 * Formatting utilities for money, dates, and scores
 */

export function formatMoney(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return "$0.00";
  return `$${amount.toFixed(2)}`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00Z");
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatDateRange(startStr: string, endStr: string): string {
  const start = new Date(startStr + "T00:00:00Z");
  const end = new Date(endStr + "T00:00:00Z");
  const nights = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return `${formatDate(startStr)} to ${formatDate(endStr)} (${nights} night${nights !== 1 ? "s" : ""})`;
}

export function scoreLabel(score: number | null | undefined): string {
  if (!score) return "No rating";
  if (score >= 9) return "Exceptional";
  if (score >= 8.5) return "Excellent";
  if (score >= 8) return "Very good";
  if (score >= 7) return "Good";
  return "Pleasant";
}

export function formatScore(score: number | null | undefined): string {
  if (!score) return "—";
  return score.toFixed(1);
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}
