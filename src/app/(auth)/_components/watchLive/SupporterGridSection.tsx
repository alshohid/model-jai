"use client";

import * as React from "react";
import Image from "next/image";
import LiveSectionHeader from "./LiveSectionHeader";
import SupporterGridContainer from "./SupporterGridContainer";
import type { DemoBossSupporter, SupportSide } from "@/shared/hooks/useMatchDemoStore";
import type { SupportSide as GridSide } from "@/shared/components/grid/SupporterGrid";

export default function SupporterGridSection({
    matchId,
    layout,
    leftPlayerName,
    rightPlayerName,
    leftBoss,
    rightBoss,
    onSupport,
}: {
    matchId: string;
    layout: "tiktok" | "twitch";
    leftPlayerName: string;
    rightPlayerName: string;
    leftBoss: DemoBossSupporter;
    rightBoss: DemoBossSupporter;
    onSupport: (side: SupportSide, amount: number) => void;
}) {
    const [selectedSide, setSelectedSide] = React.useState<GridSide>("left");

    return (
        <div className={layout === "tiktok" ? "max-w-[520px] mx-auto px-4 py-6" : "max-w-[1200px] mx-auto px-4 py-6"}>
            <LiveSectionHeader title="Supporter Grid" className="mb-6 tracking-wide text-[42px]" />

            {/* side select */}
            <div className="flex gap-3 justify-center mb-5">
                <button
                    onClick={() => setSelectedSide("left")}
                    className={`px-4 py-2 rounded-xl border ${selectedSide === "left" ? "bg-white text-black" : "border-white/20 text-white"}`}
                >
                    Support {leftPlayerName} (X)
                </button>

                <button
                    onClick={() => setSelectedSide("right")}
                    className={`px-4 py-2 rounded-xl border ${selectedSide === "right" ? "bg-white text-black" : "border-white/20 text-white"}`}
                >
                    Support {rightPlayerName} (O)
                </button>
            </div>

            {/* boss + grid layout */}
            <div className={layout === "twitch" ? "grid grid-cols-[240px_1fr_240px] gap-4 items-start" : "grid grid-cols-1 gap-4"}>
                {/* left boss */}
                <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                    <div className="text-sm text-white/70">Big Boss Supporter</div>
                    <div className="text-xl font-extrabold">{leftBoss.name}</div>
                    <div className="text-white/80">Total: {leftBoss.total}</div>
                    <div className="mt-3 w-full aspect-square relative rounded-xl overflow-hidden">
                        <Image src={leftBoss.imageSrc} alt={leftBoss.name} fill className="object-cover" />
                    </div>
                </div>

                {/* grid */}
                <SupporterGridContainer
                    matchId={matchId}
                    matchStatus="Live"
                    locked={false}
                    selectedSide={selectedSide}
                    onSupport={(side, amount) => onSupport(side, amount)}
                />

                {/* right boss */}
                <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                    <div className="text-sm text-white/70">Big Boss Supporter</div>
                    <div className="text-xl font-extrabold">{rightBoss.name}</div>
                    <div className="text-white/80">Total: {rightBoss.total}</div>
                    <div className="mt-3 w-full aspect-square relative rounded-xl overflow-hidden">
                        <Image src={rightBoss.imageSrc} alt={rightBoss.name} fill className="object-cover" />
                    </div>
                </div>
            </div>

            <h2 className="mt-8 text-center text-[44px] font-black tracking-widest text-white">
                WHO IS THE BOSS
            </h2>
        </div>
    );
}
