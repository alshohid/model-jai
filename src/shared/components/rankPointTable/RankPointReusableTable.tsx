"use client";

import { ReactNode } from "react";
import ReuseAbleTable from "@/shared/ui/reusable/table/ReuseAbleTable";

type RankRowItem = {
    id: number;
    rankNo: string; // "001"
    name: string;
    score: string; // "9.8/10"
    matchPoints: string; // "10000 pt, 8000 pt, 5000 pt"
};

const RankPointReusableTable = () => {
    const tableHeader = [
        "Rank No",
        "Name",
        "Score",
        "Range Point Match Support From Highest to Lowest",
    ];

    const currentItems: RankRowItem[] = [
        { id: 1, rankNo: "001", name: "Cameron Williamson", score: "9.8/10", matchPoints: "10000 pt, 8000 pt, 5000 pt" },
        { id: 2, rankNo: "002", name: "Leslie Alexander", score: "9.8/10", matchPoints: "9000 pt, 6000 pt, 5000 pt" },
        { id: 3, rankNo: "003", name: "Floyd Miles", score: "9.8/10", matchPoints: "7000 pt, 5000 pt, 4000 pt" },
        { id: 4, rankNo: "004", name: "Arlene McCoy", score: "9.8/10", matchPoints: "5000 pt, 4000 pt, 3000 pt" },
        { id: 5, rankNo: "005", name: "Jerome Bell", score: "9.8/10", matchPoints: "4800 pt, 3700 pt, 3000 pt" },
        { id: 6, rankNo: "006", name: "Ralph Edwards", score: "9.8/10", matchPoints: "3900 pt, 3300 pt, 2900 pt" },
        { id: 7, rankNo: "007", name: "Guy Hawkins", score: "9.8/10", matchPoints: "3500 pt, 2700 pt, 2300 pt" },
        { id: 8, rankNo: "008", name: "Eleanor Pena", score: "9.8/10", matchPoints: "3100 pt, 2600 pt, 2100 pt" },
        { id: 9, rankNo: "009", name: "Jacob Jones", score: "9.8/10", matchPoints: "2800 pt, 1900 pt, 1500 pt" },
        { id: 10, rankNo: "010", name: "Courtney Henry", score: "9.8/10", matchPoints: "2200 pt, 1600 pt, 1100 pt" },
    ];

    const tableRowDataRenderers: ((item: RankRowItem, index: number) => ReactNode)[] =
        [
            (item) => <span className="text-[#FFFFFF] border-[#FFFFFF00]">{item.rankNo}</span>,
            (item) => <span className="text-[#FFFFFF]">{item.name}</span>,
            (item) => <span className="text-[#FFFFFF]">{item.score}</span>,
            (item) => <span className="text-[#FFFFFF]">{item.matchPoints}</span>,
        ];

    // Screenshot-like widths (total ~1320)
    const columnWidths = [173, 356, 140, 651];

    return (
        <div>
            <ReuseAbleTable
                isLoadings={false}
                currentItems={currentItems}
                tableHeader={tableHeader}
                tableRowDataRenderers={tableRowDataRenderers}
                isBg={false}
                minTableWidthPx={1320}
                columnWidths={columnWidths}
                variant="rank-dark"
            />
        </div>
    );
};

export default RankPointReusableTable;
