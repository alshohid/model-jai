export function formatViewerCount(n: number): string {
  if (!n || n <= 0) return "0";

  if (n >= 1_000_000) {
    const val = n / 1_000_000;
    return `${val % 1 === 0 ? val : val.toFixed(1)}M`;
  }
  if (n >= 1_000) {
    const val = n / 1_000;
    return `${val % 1 === 0 ? val : val.toFixed(1)}K`;
  }
  return String(n);
}
