/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./table";

export interface TableItem {
    id?: string | number;
    [key: string]: any;
}

type TableVariant = "light" | "rank-dark";

interface ReuseAbleTableProps<T extends TableItem> {
    isLoadings: boolean;
    currentItems: T[];
    tableHeader: string[];
    tableRowDataRenderers: ((item: T, index: number) => React.ReactNode)[];
    isBg?: boolean;

    columnWidths?: Array<number | null | undefined>;
    headerCellClasses?: Array<string | null | undefined>;
    minTableWidthPx?: number;

    /** NEW */
    variant?: TableVariant;
}

const ReuseAbleTable = <T extends TableItem>({
    isLoadings,
    currentItems,
    tableHeader,
    tableRowDataRenderers,
    isBg = false,
    columnWidths,
    headerCellClasses,
    minTableWidthPx,
    variant = "light",
}: ReuseAbleTableProps<T>) => {
    const safeWidths =
        columnWidths?.length === tableHeader.length ? columnWidths : undefined;

    const safeHeaderClasses =
        headerCellClasses?.length === tableHeader.length ? headerCellClasses : [];

    const isRankDark = variant === "rank-dark";

    const wrapperClass = isRankDark
        ? [
            "w-full",
            "rounded-[8px]",
            "border border-white/25",
            "overflow-hidden",
            "bg-[#D2D2D51A]",
            // " bg-gradient-to-br from-black via-[#120015] to-[#05000A]",
            "backdrop-blur-md",
        ].join(" ")
        : [
            "w-full",
            // "container",
            "rounded-[8px]",
            "border border-[#D2D2D5]",
            "overflow-hidden",
            isBg ? "bg-white" : "",
        ].join(" ");

    const headerCellBase = isRankDark
        ? "px-6 py-4 text-left text-[#FFFFFF] font-light text-[20px] leading-[1.24] tracking-[0.005em] whitespace-nowrap"
        : "px-4 py-3 text-left text-sm font-semibold text-[#1B1B1F] bg-white";

    const headerRowClass = isRankDark
        ? "bg-[#B02383] border-b border-white/25"
        : "border-b border-[#D2D2D5]";

    const rowClass = (rowIndex: number) =>
        isRankDark
            ? [
                "border-b border-white/20",
                rowIndex % 2 === 0 ? "bg-white/5" : "bg-white/0",
                "hover:bg-white/10",
            ].join(" ")
            : "border-b last:border-b-0 border-[#D2D2D5]";

    const cellBase = isRankDark
        ? "px-6 py-4 text-[14px] text-white/90 whitespace-nowrap"
        : "px-4 py-3 text-[14px] text-[#2B2B2F] whitespace-nowrap";

    return (
        <div className="w-full">
            <div className={wrapperClass}>
                {/* <div className="w-full overflow-x-auto lg:overflow-x-visible custom-scroll"> */}
                <div className="w-full">


                    {isLoadings ? (
                        <div className="p-4">
                            <div className="h-12 bg-white/10 rounded-md animate-pulse mb-3" />
                            {[1, 2, 3, 4, 5].map((k) => (
                                <div
                                    key={k}
                                    className="h-14 bg-white/10 rounded-md animate-pulse mb-2"
                                />
                            ))}
                        </div>
                    ) : (
                        <Table
                            className="w-full"
                        // style={{ minWidth: `${minTableWidthPx}px` }}
                        >

                            <TableCaption />

                            {safeWidths ? (
                                <colgroup>
                                    {safeWidths.map((w, idx) => (
                                        <col key={idx} style={w ? { width: `${w}px` } : undefined} />
                                    ))}
                                </colgroup>
                            ) : null}

                            <TableHeader>
                                <TableRow className={headerRowClass}>
                                    {tableHeader.map((header, index) => {
                                        const extra = safeHeaderClasses[index] ?? "";
                                        return (
                                            <TableHead
                                                key={index}
                                                className={[
                                                    headerCellBase,
                                                    isRankDark
                                                        ? "border-r border-white/25 last:border-r-0"
                                                        : "border-r border-[#D2D2D5] last:border-r-0",
                                                    extra,
                                                ].join(" ")}
                                            >
                                                {header}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {currentItems.length ? (
                                    currentItems.map((item, rowIndex) => (
                                        <TableRow key={item?.id ?? rowIndex} className={rowClass(rowIndex)}>
                                            {tableRowDataRenderers.map((renderFn, colIndex) => (
                                                <TableCell
                                                    key={colIndex}
                                                    className={[
                                                        cellBase,
                                                        isRankDark
                                                            ? "border-r border-white/20 last:border-r-0"
                                                            : "border-r border-[#D2D2D5] last:border-r-0",
                                                    ].join(" ")}
                                                >
                                                    {renderFn(item, rowIndex)}
                                                </TableCell>

                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={tableRowDataRenderers.length}
                                            className={isRankDark ? "py-10 text-center text-white/70" : "py-10 text-center text-[#6B6B73]"}
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
        </div>
    );
};

export default ReuseAbleTable;
