export function safeRedirect(raw: string | null) {
    if (!raw) return "/";

    let decoded = raw;
    try {
        decoded = decodeURIComponent(raw);
    } catch {
        return "/";
    }

    if (!decoded.startsWith("/") || decoded.startsWith("//")) return "/";

    return decoded;
}