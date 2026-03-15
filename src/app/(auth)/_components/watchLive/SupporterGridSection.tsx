"use client";


import { cn } from "@/shared/lib/utils/cn";
import SupporterGridContainer from "./SupporterGridContainer";
import type { SupportSide } from "@/shared/components/grid/SupporterGrid";
import { useState } from "react";
import { SelectSideCard } from "@/shared/components/card/SelectSideCard";
import { BossCard } from "@/shared/components/card/BossCard";

export default function SupporterGridSection({
    matchId,
    mode,
    // isLive,
    leftBoss,
    rightBoss,
    leftImg,
    rightImg,
    onSupport,
    leftBossName,
    rightBossName,
}: {
    matchId: string;
    mode: "landscape" | "portrait";
    // isLive: boolean;
    leftBoss: { name: string; total: number };
    rightBoss: { name: string; total: number };
    rightImg: string;
    leftImg: string;
    onSupport: (side: SupportSide, amount: number) => void;
    leftBossName: string;
    rightBossName: string;
}) {
    const [selectedSide, setSelectedSide] = useState<SupportSide>("left");

    return (
        <section className="w-full ">

            <div className=" mx-auto w-full px-1 md:px-4 py-2 md:py-6">
                <div className="grid grid-cols-[1fr_auto_1fr] md:grid-cols-[1fr_100px_1fr] gap-4 items-center">
                    <BossCard name={leftBoss.name} img={leftImg} supportPlayerName={leftBossName ?? "TEAM JACK"} total={leftBoss.total} />
                    <div className="text-[12px] sm:text-[22px] font-extrabold rotate-45 text-center">VS</div>
                    <BossCard name={rightBoss.name} img={rightImg} supportPlayerName={rightBossName ?? "TEAM STEEVE"} total={rightBoss.total} />
                </div>

                <h2
                    className={cn(
                        "mt-2 md:mt-6 text-center font-black text-[24px] md:text-[60px] tracking-widest",
                        "text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-white to-pink-300",
                        "drop-shadow-[0_6px_0_rgba(0,0,0,0.75)]"
                    )}
                >
                    WHO IS THE BOSS
                </h2>
            </div>
            <div className="mx-auto w-full px-3 md:px-4 py-6">
                <h3 className="text-white font-black text-[28px] text-center mb-4">
                    Supporter Grid
                </h3>

                <div className="mb-4 flex items-center justify-center gap-3">
                    <SelectSideCard
                        mode={mode}
                        selected={selectedSide === "left"}
                        name={leftBossName ?? "Jack"}
                        sideLabel="Matched"
                        onClick={() => setSelectedSide("left")}
                    />
                    <SelectSideCard
                        mode={mode}
                        selected={selectedSide === "right"}
                        name={rightBossName ?? "steve"}
                        sideLabel="UnMatched"
                        onClick={() => setSelectedSide("right")}
                    />
                </div>

                <SupporterGridContainer
                    matchId={matchId}
                    matchStatus="Upcoming"
                    locked={false}
                    selectedSide={selectedSide}
                    onSupport={onSupport}
                />
            </div>
        </section>
    );
}




