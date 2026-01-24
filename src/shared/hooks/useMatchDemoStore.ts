"use client";

import { useCallback, useMemo, useState } from "react";

export type Side = "left" | "right";

type Totals = Record<string, number>;

function getTop(map: Totals) {
    const entries = Object.entries(map);
    if (!entries.length) return { name: "No Supporter", total: 0 };
    entries.sort((a, b) => b[1] - a[1]);
    return { name: entries[0][0], total: entries[0][1] };
}

export function useMatchDemoStore(matchId: string) {
    const [viewerName] = useState("Cameron Williamson"); 

    const [left, setLeft] = useState({
        name: "JACK",
        points: 2000,
        imageSrc: "/images/home/panel_left.png",
        teamLogoSrc: "/images/home/bayern.png",
    });

    const [right, setRight] = useState({
        name: "STEEVE",
        points: 2000,
        imageSrc: "/images/home/panel_right.png",
        teamLogoSrc: "/images/home/totenhum.png",
    });

    // middle fixed (client requirement)
    const middle = useMemo(
        () => ({
            label: "Model",
            imageSrc: "/images/home/middle.png",
        }),
        []
    );

    const [totals, setTotals] = useState<{ left: Totals; right: Totals }>({
        left: { "Cameron Williamson": 4000 },
        right: { "Mastor j@y model": 2000 },
    });

    const bossSide = useMemo(() => {
        if (left.points === right.points) return null;
        return left.points > right.points ? ("left" as const) : ("right" as const);
    }, [left.points, right.points]);

    const topLeft = useMemo(() => getTop(totals.left), [totals.left]);
    const topRight = useMemo(() => getTop(totals.right), [totals.right]);

    const support = useCallback(
        (side: Side, amount: number) => {
            if (side === "left") setLeft((p) => ({ ...p, points: p.points + amount }));
            else setRight((p) => ({ ...p, points: p.points + amount }));

            setTotals((prev) => {
                if (side === "left") {
                    return {
                        ...prev,
                        left: { ...prev.left, [viewerName]: (prev.left[viewerName] ?? 0) + amount },
                    };
                }
                return {
                    ...prev,
                    right: { ...prev.right, [viewerName]: (prev.right[viewerName] ?? 0) + amount },
                };
            });
        },
        [viewerName]
    );

    return {
        matchId,
        left,
        right,
        middle,
        bossSide,
        topLeft,
        topRight,
        support,
    };
}
