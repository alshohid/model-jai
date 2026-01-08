"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/shared/providers/auth/useAuth";
import SupporterGrid, { GridCell } from "@/shared/components/grid/SupporterGrid";

type Props = {
    matchId: string;
    matchStatus: "Upcoming" | "Live" | "Past";
    locked?: boolean;
};

function makeDummyCells(rows: number, cols: number): GridCell[] {
    const total = rows * cols;

    const pointsPool = [1000, 1100, 1200, 1300, 1500, 1600, 1700, 1800, 1900, 2000, 2200, 2300, 2500, 2900, 3000, 3200];

    return Array.from({ length: total }).map((_, i) => {
        const points = pointsPool[i % pointsPool.length];
        const taken = Math.random() > 0.35;
        return {
            id: `c-${i + 1}`,
            status: taken ? "taken" : "available",
            points,
        };
    });
}

export default function SupporterGridContainer({
    matchId,
    matchStatus,
    locked = false,
}: Props) {
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    const rows = 8;
    const cols = 8;

    const [cells, setCells] = React.useState<GridCell[]>(() =>
        makeDummyCells(rows, cols)
    );
    const [pendingCellId, setPendingCellId] = React.useState<string | null>(null);

    const handleCellClick = async (cell: GridCell) => {
        console.log("clicked ", cell)
        // Global disabled rules
        if (locked || matchStatus === "Past") return;

        // Auth gate
        if (!isAuthenticated) {
            router.push(`/login?redirect=/match/${matchId}`);
            return;
        }

        // Cell rules
        if (cell.status === "taken") return;

        // optimistic update
        setPendingCellId(cell.id);

        try {
            // এখানে backend থাকলে: await socket.emit / await api call
            // dummy delay to simulate request:
            // await new Promise((r) => setTimeout(r, 100));

            setCells((prev) =>
                prev.map((c) =>
                    c.id === cell.id ? { ...c, status: "taken" } : c
                )
            );
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
            className="container"
        />
    );
}
