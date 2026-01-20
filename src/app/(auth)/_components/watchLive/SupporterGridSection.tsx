"use client";

import Image from "next/image";
import { cn } from "@/shared/lib/utils/cn";
import SupporterGridContainer from "./SupporterGridContainer";
import type { SupportSide } from "@/shared/components/grid/SupporterGrid";
import { useState } from "react";

export default function SupporterGridSection({
    matchId,
    mode,
    isLive,
    leftBoss,
    rightBoss,
    leftImg,
    rightImg,
    onSupport,
}: {
    matchId: string;
    mode: "tiktok" | "twitch";
    isLive: boolean;
    leftBoss: { name: string; total: number };
    rightBoss: { name: string; total: number };
    rightImg: string;
    leftImg: string;
    onSupport: (side: SupportSide, amount: number) => void;
}) {
    const [selectedSide, setSelectedSide] = useState<SupportSide>("left");

    // ✅ Live হলে grid close (hide / locked)
    if (isLive) {
        return (
            <section className="w-full bg-black">
                <div className="mx-auto w-full px-3 md:px-4 py-6">
                    <div className="grid grid-cols-2 gap-4 items-end">
                        <BossCard name={leftBoss.name} img={leftImg} />
                        <BossCard name={rightBoss.name} img={rightImg} />
                    </div>

                    <h2
                        className={cn(
                            "mt-6 text-center font-black text-[44px] md:text-[60px] tracking-widest",
                            "text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-500 to-yellow-300",
                            "drop-shadow-[0_6px_0_rgba(0,0,0,0.75)]"
                        )}
                    >
                        WHO IS THE BOSS
                    </h2>
                </div>
            </section>
        );
    }

    return (
        <section className="w-full bg-black">
            <div className="mx-auto w-full px-3 md:px-4 py-6">
                <h3 className="text-white font-black text-[28px] text-center mb-4">
                    Supporter Grid
                </h3>

                <div className="mb-4 flex items-center justify-center gap-3">
                    <SelectSideCard
                        mode={mode}
                        selected={selectedSide === "left"}
                        name={"Jack"}      
                        sideLabel="Matched"
                        onClick={() => setSelectedSide("left")}
                    />
                    <SelectSideCard
                        mode={mode}
                        selected={selectedSide === "right"}
                        name={"steve"}
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

function SelectSideCard({
    mode,
    selected,
    name,
    sideLabel, // optional: "Matched" / "Unmatched"
    onClick,
}: {
    mode: "tiktok" | "twitch";
    selected: boolean;
    name: string;        // ✅ JACK / STEEVE
    sideLabel?: string;  // ✅ optional
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "relative rounded-xl",
                "px-4 sm:px-6 py-3 sm:py-4",
                "min-w-[140px] sm:min-w-[180px]",
                "border transition text-left",
                "bg-black/35 backdrop-blur-md",
                selected
                    ? mode === "tiktok"
                        ? "border-4 border-yellow-400 shadow-[0_0_0_2px_rgba(0,0,0,0.45)]"
                        : "border-2 border-yellow-400"
                    : "border border-white/15 opacity-85 hover:opacity-100"
            )}
            aria-pressed={selected}
        >
            {/* optional top label */}
            {sideLabel && (
                <div className="text-[10px] sm:text-[12px] text-white/70 font-semibold">
                    {sideLabel}
                </div>
            )}

            {/* player name */}
            <div
                className={cn(
                    "font-extrabold leading-none truncate",
                    "text-[#DD2E03]",
                    "[-webkit-text-stroke:2px_#F9C80E]",
                    mode === "tiktok"
                        ? "text-[18px] sm:text-[22px]"
                        : "text-[18px] sm:text-[24px]"
                )}
                style={{ fontFamily: "Manrope" }}
            >
                {name}
            </div>

            {/* selected hint */}
            <div className={cn("mt-1 text-[10px] sm:text-[12px]", selected ? "text-yellow-300" : "text-white/60")}>
                {selected ? "Selected" : "Tap to select"}
            </div>
        </button>
    );
}


function BossCard({ name, img }: { name: string; img: string }) {
    return (
        <div className="relative rounded-xl bg-black/40 border border-white/10 p-3">
            <div className="w-full aspect-[4/5] relative rounded-lg overflow-hidden bg-black">
                <Image src={img} alt={name} fill className="object-cover" />
            </div>

            <div className="mt-3 text-white/80 text-[12px] font-semibold">
                Big Boss Supporter
            </div>
            <div className="text-white font-black text-[16px]">{name}</div>
        </div>
    );
}
