const API_DATE_TIME_PATTERN =
    /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})?$/;

export function parseApiDateTime(value?: string | null) {
    if (!value) return null;

    const trimmedValue = value.trim();

    if (!trimmedValue || !API_DATE_TIME_PATTERN.test(trimmedValue)) {
        return null;
    }

    const normalized = trimmedValue.includes("T")
        ? trimmedValue
        : trimmedValue.replace(" ", "T");
    const sanitized = normalized.replace(/\.(\d{3})\d+(Z)?$/, ".$1$2");
    const date = new Date(sanitized);

    return Number.isNaN(date.getTime()) ? null : date;
}

export function getVotingEndTime(
    voteStartTime?: string | null,
    votingTime?: number | string | null,
) {
    const absoluteEndTime =
        typeof votingTime === "string" ? parseApiDateTime(votingTime) : null;

    if (absoluteEndTime) {
        return absoluteEndTime;
    }

    const startTime = parseApiDateTime(voteStartTime);
    const votingMinutes = Number(votingTime ?? 0);

    if (!startTime || !Number.isFinite(votingMinutes) || votingMinutes <= 0) {
        return null;
    }

    return new Date(startTime.getTime() + votingMinutes * 60 * 1000);
}
