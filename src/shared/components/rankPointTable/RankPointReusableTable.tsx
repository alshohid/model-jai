"use client";

import { ReactNode } from "react";
import ReuseAbleTable from "@/shared/UI/reusable/table/ReuseAbleTable";
import { SupporterRankingRow } from "@/shared/lib/ranking/supporterRanking";

const RankPointReusableTable = ({
    rows,
    isLoading,
}: {
    rows?: SupporterRankingRow[] | null;
    isLoading?: boolean;
}) => {
    const tableHeader = [
        "Rank Boss No",
        "Boss Name",
        "User ID",
        "Range Point Match Support From Highest to Lowest",
    ];
    const currentItems = rows ?? [];

    const tableRowDataRenderers: ((
        item: SupporterRankingRow,
        index: number
    ) => ReactNode)[] = [
        (item) => <span className="text-[#FFFFFF] border border-white p-2 rounded-md">{item.serialNo}</span>,
        (item) => <span className="text-[#FFFFFF]">{item.supporterName}</span>,
        (item) => <span className="text-[#FFFFFF]">{item.userId}</span>,
        (item) => <span className="text-[#FFFFFF]">{item.supportedAmounts}</span>,
    ];

    return (
        <div>
            <ReuseAbleTable
                isLoadings={Boolean(isLoading)}
                currentItems={currentItems}
                tableHeader={tableHeader}
                tableRowDataRenderers={tableRowDataRenderers}
                isBg={false}
                minTableWidthPx={1320}
                variant="rank-dark"
            />
        </div>
    );
};

export default RankPointReusableTable;
