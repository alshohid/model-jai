export type SupporterRankingInput = {
    user_id?: number | string | null;
    serial_no?: string | number | null;
    supported_amounts?: string | number | Array<string | number> | null;
    range_points?: Array<string | number> | null;
    supporter?: {
        id?: number | string | null;
        name?: string | null;
        image?: string | null;
    } | null;
};

export type SupporterRankingRow = {
    id: string;
    userId: string;
    serialNo: string;
    supportedAmounts: string;
    supporterName: string;
    supporterImage: string;
};

export const FALLBACK_SUPPORTER_IMAGE = "/images/home/avatar_img.png";
export const FALLBACK_SUPPORTER_NAME = "No Supporter";

function toReadableAmount(
    value?: string | number | Array<string | number> | null,
    rangePoints?: Array<string | number> | null
) {
    if (Array.isArray(rangePoints) && rangePoints.length > 0) {
        return rangePoints.map((item) => String(item)).join(", ");
    }

    if (Array.isArray(value) && value.length > 0) {
        return value.map((item) => String(item)).join(", ");
    }

    if (value === null || typeof value === "undefined" || value === "") {
        return "N/A";
    }

    return String(value);
}

export function normalizeSupporterRankingRows(
    data?: SupporterRankingInput[] | null
): SupporterRankingRow[] {
    return (data ?? []).map((item, index) => {
        const userId = String(item.user_id ?? item.supporter?.id ?? "N/A");

        return {
            id: `${userId}-${item.serial_no ?? index + 1}`,
            userId,
            serialNo: String(item.serial_no ?? index + 1),
            supportedAmounts: toReadableAmount(
                item.supported_amounts,
                item.range_points
            ),
            supporterName: item.supporter?.name?.trim() || FALLBACK_SUPPORTER_NAME,
            supporterImage:
                item.supporter?.image?.trim() || FALLBACK_SUPPORTER_IMAGE,
        };
    });
}
