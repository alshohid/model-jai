"use client";

import { SupporterRankingRow } from "@/shared/lib/ranking/supporterRanking";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/UI/reusable/table/table";

const RankPointReusableTable = ({
    rows,
    isLoading,
}: {
    rows?: SupporterRankingRow[] | null;
    isLoading?: boolean;
}) => {
    const currentItems = rows ?? [];
    const firstColumnWidth = 120;
    const secondColumnWidth = 168;
    const thirdColumnWidth = 140;
    const fourthColumnWidth = 360;
    const minTableWidthPx =
        firstColumnWidth +
        secondColumnWidth +
        thirdColumnWidth +
        fourthColumnWidth;

    return (
        <div className="w-full">
            <div className="w-full rounded-[8px] border border-white/25 overflow-hidden bg-[#D2D2D51A] backdrop-blur-md">
                {isLoading ? (
                    <div className="p-4">
                        <div className="h-12 rounded-md bg-white/10 animate-pulse mb-3" />
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="h-14 rounded-md bg-white/10 animate-pulse mb-2"
                            />
                        ))}
                    </div>
                ) : (
                    <Table
                        className="w-full table-fixed"
                        style={{ minWidth: `${minTableWidthPx}px` }}
                    >
                        <TableCaption />

                        <colgroup>
                            <col style={{ width: `${firstColumnWidth}px` }} />
                            <col style={{ width: `${secondColumnWidth}px` }} />
                            <col style={{ width: `${thirdColumnWidth}px` }} />
                            <col style={{ width: `${fourthColumnWidth}px` }} />
                        </colgroup>

                        <TableHeader>
                            <TableRow className="border-b border-white/25 bg-[#B02383]">
                                <TableHead className="h-auto border-r border-white/25 bg-[#B02383] px-3 py-4 text-center text-[14px] font-light leading-[1.24] text-white sm:px-5 sm:text-[18px] md:text-[20px]">
                                    Rank Boss No
                                </TableHead>
                                <TableHead className="h-auto border-r border-white/25 bg-[#B02383] px-3 py-4 text-center text-[14px] font-light leading-[1.24] text-white sm:px-5 sm:text-[18px] md:text-[20px]">
                                    Boss Name
                                </TableHead>
                                <TableHead className="h-auto border-r border-white/25 px-3 py-4 text-center text-[14px] font-light leading-[1.24] text-white sm:px-5 sm:text-[18px] md:text-[20px]">
                                    User ID
                                </TableHead>
                                <TableHead className="h-auto px-3 py-4 text-left text-[14px] font-light leading-[1.24] text-white whitespace-normal sm:px-5 sm:text-[18px] md:text-[20px]">
                                    Range Point Match Support From Highest to Lowest
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {currentItems.length ? (
                                currentItems.map((item, rowIndex) => (
                                        <TableRow
                                            key={item.id ?? rowIndex}
                                            className="border-b border-white/20 hover:bg-white/10"
                                        >
                                            <TableCell
                                                className="border-r border-white/20 px-3 py-4 text-center text-[13px] text-white/90 whitespace-nowrap sm:px-5 sm:text-[14px]"
                                            >
                                                <span className="inline-flex min-w-[54px] items-center justify-center rounded-md border border-white px-2 py-1 text-white">
                                                    {item.serialNo}
                                                </span>
                                            </TableCell>

                                            <TableCell
                                                className="border-r border-white/20 px-3 py-4 text-center text-[13px] text-white/90 whitespace-nowrap sm:px-5 sm:text-[14px]"
                                            >
                                                {item.supporterName}
                                            </TableCell>

                                            <TableCell className="border-r border-white/20 px-3 py-4 text-center text-[13px] text-white/90 whitespace-nowrap sm:px-5 sm:text-[14px]">
                                                {item.userId}
                                            </TableCell>

                                            <TableCell className="px-3 py-4 text-left text-[13px] text-white/90 whitespace-normal break-words sm:px-5 sm:text-[14px]">
                                                {item.supportedAmounts}
                                            </TableCell>
                                        </TableRow>
                                    ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="py-10 text-center text-white/70"
                                    >
                                        No Data Found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    );
};

export default RankPointReusableTable;
