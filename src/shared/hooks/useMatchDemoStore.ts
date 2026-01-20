"use client";

import { useCallback, useMemo, useState } from "react";

export type SupportSide = "left" | "right";

type TotalsMap = Record<string, number>;

export type DemoPlayer = {
    name: string;
    teamLogoSrc?: string;
    imageSrc: string;
    points: number;
};

export type DemoBossSupporter = {
    name: string;
    total: number;
    imageSrc: string;
};

function topFrom(map: TotalsMap): { name: string; total: number } {
    const entries = Object.entries(map);
    if (!entries.length) return { name: "No Supporter", total: 0 };
    entries.sort((a, b) => b[1] - a[1]);
    return { name: entries[0][0], total: entries[0][1] };
}

export function useMatchDemoStore(matchId: string) {
    // demo viewer name (client demo তে চাইলে UI দিয়ে change করা যাবে)
    const [viewerName] = useState("You");

    const [leftPlayer, setLeftPlayer] = useState<DemoPlayer>({
        name: "JACK",
        teamLogoSrc: "/images/home/bayern.png",
        imageSrc: "/images/home/panel_left.png",
        points: 1000,
    });

    const [rightPlayer, setRightPlayer] = useState<DemoPlayer>({
        name: "STEEVE",
        teamLogoSrc: "/images/home/totenhum.png",
        imageSrc: "/images/home/panel_right.png",
        points: 2000,
    });

    // ✅ Middle fixed (client requirement)
    const middle = useMemo(
        () => ({
            label: "MODEL",
            imageSrc: "/images/home/middle.png",
        }),
        []
    );

    // Dummy supporters (boss supporter auto-change দেখানোর জন্য)
    const [supportTotals, setSupportTotals] = useState<{
        left: TotalsMap;
        right: TotalsMap;
    }>({
        left: { Cameron: 3200, Alex: 1800 },
        right: { Mike: 2800, Sam: 2200 },
    });

    // ✅ Boss side auto
    const bossSide = useMemo<SupportSide | null>(() => {
        if (leftPlayer.points === rightPlayer.points) return null;
        return leftPlayer.points > rightPlayer.points ? "left" : "right";
    }, [leftPlayer.points, rightPlayer.points]);

    const topLeftSupporter = useMemo(() => {
        const { name, total } = topFrom(supportTotals.left);
        return { name, total, imageSrc: "/images/home/leftPlayerImg.png" } as DemoBossSupporter;
    }, [supportTotals.left]);

    const topRightSupporter = useMemo(() => {
        const { name, total } = topFrom(supportTotals.right);
        return { name, total, imageSrc: "/images/home/rightPlayerImg.png" } as DemoBossSupporter;
    }, [supportTotals.right]);

    // ✅ একটাই support function: LiveStage click / Grid click সব এখানেই আসবে
    const support = useCallback((side: SupportSide, amount: number) => {
        // 1) player points update
        if (side === "left") {
            setLeftPlayer((p) => ({ ...p, points: p.points + amount }));
        } else {
            setRightPlayer((p) => ({ ...p, points: p.points + amount }));
        }

        // 2) boss supporter demo update (viewerName কে বাড়িয়ে দিচ্ছি)
        setSupportTotals((prev) => {
            if (side === "left") {
                const nextLeft = {
                    ...prev.left,
                    [viewerName]: (prev.left[viewerName] ?? 0) + amount,
                };
                return { ...prev, left: nextLeft };
            }
            const nextRight = {
                ...prev.right,
                [viewerName]: (prev.right[viewerName] ?? 0) + amount,
            };
            return { ...prev, right: nextRight };
        });
    }, [viewerName]);

    return {
        matchId,
        leftPlayer,
        rightPlayer,
        middle,
        bossSide,
        topLeftSupporter,
        topRightSupporter,
        support,
    };
}
