"use client";

import { useEffect, useMemo, useState } from "react";

export type PaginationMeta = {
    page: number;
    limit: number;
    total: number;
    prev: boolean;
    next: boolean;
};

type Params<T> = {
    items: T[];
    limit: number;
    initialPage?: number;

    // filter
    filterFn?: (item: T) => boolean;
    resetKey?: string | number; // filter change হলে page=1 reset হবে
};

export function useClientPagination<T>({
    items,
    limit,
    initialPage = 1,
    filterFn,
    resetKey,
}: Params<T>) {
    const [page, setPage] = useState(initialPage);

    // ✅ filter first
    const filtered = useMemo(() => {
        return filterFn ? items.filter(filterFn) : items;
    }, [items, filterFn]);

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));

    // ✅ clamp page
    const safePage = Math.min(Math.max(page, 1), totalPages);

    // ✅ reset page when filter changes
    useEffect(() => {
        setPage(1);
    }, [resetKey]);

    // ✅ slice
    const currentItems = useMemo(() => {
        const start = (safePage - 1) * limit;
        const end = start + limit;
        return filtered.slice(start, end);
    }, [filtered, safePage, limit]);

    const meta: PaginationMeta = useMemo(() => {
        return {
            page: safePage,
            limit,
            total,
            prev: safePage > 1,
            next: safePage < totalPages,
        };
    }, [safePage, limit, total, totalPages]);

    return {
        page: safePage,
        setPage,
        totalPages,
        total,
        filtered,
        currentItems,
        meta,
    };
}
