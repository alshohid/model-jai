"use client";

import { ReactNode } from "react";
import ReuseAbleTable from "@/shared/UI/reusable/table/ReuseAbleTable";

export type SupporterRowItem = {
    user_id: number;
    serial_no: string;
    supported_amounts: string;
    supporter: {
        id: number;
        name: string;
    };
};

const RankPointReusableTable = ({ data, isLoading }: { data: SupporterRowItem[]; isLoading: boolean }) => {
    const tableHeader = [
        "Rank Boss No",
        "Boss Name",
        "User ID",
        "Range Point Match Support From Highest to Lowest",
    ];

    const currentItems: SupporterRowItem[] = data?.map((item) => ({
        user_id: item.user_id,
        serial_no: item.serial_no,
        supported_amounts: item.supported_amounts,
        supporter: {
            id: item.supporter.id,
            name: item.supporter.name,
        },
    })) ?? [];

    const tableRowDataRenderers: ((item: SupporterRowItem, index: number) => ReactNode)[] = [
        (item) => <span className="text-[#FFFFFF] border border-white p-2 rounded-md">{item.serial_no}</span>,
        (item) => <span className="text-[#FFFFFF]">{item.supporter?.name ?? "N/A"}</span>,
        (item) => <span className="text-[#FFFFFF]">{item.user_id}</span>,
        (item) => <span className="text-[#FFFFFF]">{item.supported_amounts}</span>,
    ];

    return (
        <div>
            <ReuseAbleTable
                isLoadings={isLoading}
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