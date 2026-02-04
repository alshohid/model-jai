/**
 * Utility function for formatting points with signs and abbreviations
 * Following Single Responsibility Principle
 */

export function formatPoints(
  points: number | string,
  options: {
    sign?: "+" | "-";
    abbreviate?: boolean;
  } = {},
): string {
  const { sign, abbreviate = true } = options;

  // Convert to number if string
  const numericPoints =
    typeof points === "string" ? Number(points.replace(/,/g, "")) : points;

  // Validate number
  if (typeof numericPoints !== "number" || Number.isNaN(numericPoints)) {
    return `${sign || ""}${points}`;
  }

  // Format based on abbreviation setting
  let formatted: string;
  if (abbreviate && numericPoints >= 1_000_000_000) {
    formatted = `${(numericPoints / 1_000_000_000).toFixed(1)}B`;
  } else {
    formatted = numericPoints.toLocaleString();
  }

  // Add sign if provided
  return sign ? `${sign}${formatted}` : formatted;
}
