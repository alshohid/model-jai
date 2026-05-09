export function maskEmail(email: string) {
    const [name, domain] = email.split("@");
    if (!name || !domain) return email;

    const visibleStart = name.slice(0, 2);
    const visibleEnd = name.slice(-1);
    return `${visibleStart}${"*".repeat(Math.max(name.length - 3, 1))}${visibleEnd}@${domain}`;
}
