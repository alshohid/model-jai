type NameSource = {
    name?: string | null;
    first_name?: string | null;
    middle_name?: string | null;
    last_name?: string | null;
};

export function splitFullName(fullName: string) {
    const parts = fullName.trim().split(/\s+/).filter(Boolean);

    if (parts.length === 0) {
        return {
            first_name: "",
            middle_name: "",
            last_name: "",
        };
    }

    if (parts.length === 1) {
        return {
            first_name: parts[0],
            middle_name: "",
            last_name: "",
        };
    }

    if (parts.length === 2) {
        return {
            first_name: parts[0],
            middle_name: "",
            last_name: parts[1],
        };
    }

    return {
        first_name: parts[0],
        middle_name: parts.slice(1, -1).join(" "),
        last_name: parts[parts.length - 1],
    };
}

export function getFullName(nameSource?: NameSource | null) {
    if (!nameSource) return "";

    const composedName = [
        nameSource.first_name,
        nameSource.middle_name,
        nameSource.last_name,
    ]
        .filter((part) => typeof part === "string" && part.trim().length > 0)
        .join(" ");

    return composedName || nameSource.name?.trim() || "";
}
