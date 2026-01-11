"use client";

import * as React from "react";
import { cn } from "@/shared/lib/utils/cn";

export type PaginationMeta = {
    page: number;   // current page (1-based)
    limit: number;  // per page
    total: number;  // total items
    prev: boolean;  // backend says previous exists?
    next: boolean;  // backend says next exists?
};

type Props = {
    meta: PaginationMeta;
    onPageChange: (page: number) => void;
    className?: string;
    siblingCount?: number;
    showSummary?: boolean; // "Showing 1–10 of 17" চাইলে true
};

const DOTS = "…";

function range(start: number, end: number) {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

function getPaginationRange(params: {
    totalCount: number;
    pageSize: number;
    siblingCount: number;
    currentPage: number;
}) {
    const { totalCount, pageSize, siblingCount, currentPage } = params;

    const totalPageCount = Math.max(1, Math.ceil(totalCount / pageSize));
    const totalPageNumbers = siblingCount + 5;

    if (totalPageNumbers >= totalPageCount) return range(1, totalPageCount);

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPageCount);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 1;

    const firstPageIndex = 1;
    const lastPageIndex = totalPageCount;

    if (!shouldShowLeftDots && shouldShowRightDots) {
        const leftItemCount = 3 + 2 * siblingCount;
        return [...range(1, leftItemCount), DOTS, totalPageCount];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
        const rightItemCount = 3 + 2 * siblingCount;
        return [firstPageIndex, DOTS, ...range(totalPageCount - rightItemCount + 1, totalPageCount)];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
        return [firstPageIndex, DOTS, ...range(leftSiblingIndex, rightSiblingIndex), DOTS, lastPageIndex];
    }

    return range(1, totalPageCount);
}

export default function AppPagination({
    meta,
    onPageChange,
    className,
    siblingCount = 1,
    showSummary = true,
}: Props) {
    const { page, limit, total, prev, next } = meta;

    const totalPages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(Math.max(page, 1), totalPages);

    const paginationRange = getPaginationRange({
        totalCount: total,
        pageSize: limit,
        siblingCount,
        currentPage: safePage,
    });

    // summary
    const from = total === 0 ? 0 : (safePage - 1) * limit + 1;
    const to = Math.min(safePage * limit, total);

    // backend boolean drives arrows
    const canPrev = prev && safePage > 1;
    const canNext = next && safePage < totalPages;

    return (
        <div className={cn("w-full", className)}>
            {showSummary && (
                <p className="text-white/60 text-sm mb-4">
                    Showing <span className="text-white">{from}</span>–<span className="text-white">{to}</span> of{" "}
                    <span className="text-white">{total}</span>
                </p>
            )}

            <div className="flex items-center gap-3">
                {/* LEFT ARROW */}
                <button
                    type="button"
                    disabled={!canPrev}
                    onClick={() => canPrev && onPageChange(safePage - 1)}
                    className={cn(
                        "h-11 w-11 rounded-[10px] border",
                        "bg-white text-black border-[#FF2EC8]",
                        "grid place-items-center",
                        "transition",
                        "hover:brightness-95",
                        !canPrev && "opacity-40 cursor-not-allowed hover:brightness-100"
                    )}
                    aria-label="Previous page"
                >
                    {/* chevron left */}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                {/* PAGE NUMBERS */}
                <div className="flex items-center gap-4">
                    {paginationRange.map((p, idx) => {
                        if (p === DOTS) {
                            return (
                                <span key={`dots-${idx}`} className="text-white/80 select-none">
                                    {DOTS}
                                </span>
                            );
                        }

                        const pageNumber = p as number;
                        const active = pageNumber === safePage;

                        return (
                            <button
                                key={pageNumber}
                                type="button"
                                onClick={() => onPageChange(pageNumber)}
                                className={cn(
                                    "min-w-[36px] h-11 px-3 rounded-[10px]",
                                    "text-[16px] font-medium",
                                    "transition",
                                    active
                                        ? "bg-[#FF2EC8] text-white shadow-[0_10px_25px_rgba(255,46,200,0.25)]"
                                        : "bg-transparent text-white/90 hover:bg-white/5"
                                )}
                            >
                                {pageNumber}
                            </button>
                        );
                    })}
                </div>

                {/* RIGHT ARROW */}
                <button
                    type="button"
                    disabled={!canNext}
                    onClick={() => canNext && onPageChange(safePage + 1)}
                    className={cn(
                        "h-11 w-11 rounded-[10px] border",
                        "bg-white text-black border-[#FF2EC8]",
                        "grid place-items-center",
                        "transition",
                        "hover:brightness-95",
                        !canNext && "opacity-40 cursor-not-allowed hover:brightness-100"
                    )}
                    aria-label="Next page"
                >
                    {/* chevron right */}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
