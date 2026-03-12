/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import SupporterGrid, { GridCell, SupportSide } from "@/shared/components/grid/SupporterGrid";

type Props = {
    matchId?: string;
    matchStatus?: any;
    locked?: boolean;

    selectedSide: SupportSide;
    onSupport: (side: SupportSide, amount: number) => void; // ✅ store support
};

function makeDummyCells(rows: number, cols: number): GridCell[] {
    const total = rows * cols;
    const pointsPool = [1000, 1100, 1200, 1300, 1500, 1600, 1700, 1800, 1900, 2000, 2200, 2300, 2500, 2900, 3000, 3200];

    return Array.from({ length: total }).map((_, i) => {
        const points = pointsPool[i % pointsPool.length];
        const taken = Math.random() > 0.7;

        return {
            id: `c-${i + 1}`,
            status: taken ? "taken" : "available",
            points,
            ownerSide: taken ? (Math.random() > 0.5 ? "left" : "right") : undefined,
        };
    });
}

export default function SupporterGridContainer({
    matchId,
    matchStatus,
    locked = false,
    selectedSide,
    onSupport,
}: Props) {
    const rows = 8;
    const cols = 8;

    const [cells, setCells] = React.useState<GridCell[]>(() => makeDummyCells(rows, cols));
    const [pendingCellId, setPendingCellId] = React.useState<string | null>(null);

    const handleCellClick = async (cell: GridCell) => {
        if (locked || matchStatus === "Past") return;
        if (cell.status === "taken") return;

        setPendingCellId(cell.id);

        try {
            // ✅ dummy delay
            await new Promise((r) => setTimeout(r, 250));

            // slot taken + side assign
            setCells((prev) =>
                prev.map((c) =>
                    c.id === cell.id ? { ...c, status: "taken", ownerSide: selectedSide } : c
                )
            );

            // ✅ update points/boss/top supporter
            onSupport(selectedSide, cell.points);
        } finally {
            setPendingCellId(null);
        }
    };

    return (
        <SupporterGrid
            rows={rows}
            cols={cols}
            cells={cells}
            matchStatus={matchStatus}
            locked={locked}
            pendingCellId={pendingCellId}
            onCellClick={handleCellClick}
            className="w-full"
        />
    );
}
