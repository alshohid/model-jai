export function isValidHttpUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const v = value.trim();
  if (!v) return false;

  try {
    const url = new URL(v);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function getSafeImageSrc(
  src: unknown,
  fallback = "/images/home/pro_1.jpg",
) {
  return isValidHttpUrl(src) ? src : fallback;
}
