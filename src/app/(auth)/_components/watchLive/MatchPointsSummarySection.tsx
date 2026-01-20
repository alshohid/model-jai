"use client";

import MatchPointsCard from "@/shared/components/card/MatchPointsCard";
import { cn } from "@/shared/lib/utils/cn";

type SideInfo = {
    playerName: string;
    teamLogoSrc: string;
    points: number;
};

type Props = {
    layout: "tiktok" | "twitch";
    isLive: boolean;
    supportOpen?: boolean;
    timeLeft?: { hours: number; minutes: number; seconds: number };
    onStartStreaming?: () => void;
    isScheduled?: boolean;
    left: SideInfo;
    right: SideInfo;
    className?: string;
};

export default function MatchPointsSummarySection({
    layout,
    isLive,
    supportOpen = false,
    timeLeft,
    onStartStreaming,
    isScheduled,
    left,
    right,
    className,
}: Props) {
    return (
        <section className={cn("px-4 py-6", className)}>
            <div className={cn("mx-auto", layout === "tiktok" ? "max-w-[520px]" : "max-w-[1100px]")}>
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-4 items-stretch">
                    <MatchPointsCard
                        playerName={left.playerName}
                        teamLogoSrc={left.teamLogoSrc}
                        title="Matched Points"
                        points={left.points}
                        onShare={() => { }}
                    />

                    <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md px-6 py-5 text-center flex flex-col justify-center">
                        <div className="text-3xl font-extrabold">VS</div>
                        <div className="mt-1 text-white/80">{isLive ? "Live Now" : "Upcoming"}</div>
                        <div className="mt-1 text-white/70">
                            {isLive ? (supportOpen ? "Support Open" : "Support Closed") : "Support Opens When Live"}
                        </div>
                    </div>

                    <MatchPointsCard
                        playerName={right.playerName}
                        teamLogoSrc={right.teamLogoSrc}
                        title="Unmatched Points"
                        points={right.points}
                        onShare={() => { }}
                    />
                </div>

                {/* live না হলে countdown + dummy start button */}
                {!isLive && (
                    <div className="mt-6 text-center text-white/80">
                        {timeLeft ? (
                            <p>
                                Match Live Almost Start In{" "}
                                <span className="font-semibold">
                                    {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
                                </span>
                            </p>
                        ) : (
                            <p>Streaming is currently offline</p>
                        )}

                        {onStartStreaming && !isScheduled && (
                            <div className="mt-4 flex justify-center">
                                <button
                                    onClick={onStartStreaming}
                                    className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 transition font-semibold text-white shadow-lg"
                                >
                                    Start Streaming (Demo)
                                </button>
                            </div>
                        )}

                        {isScheduled && (
                            <p className="mt-3 text-sm text-yellow-300">
                                Streaming scheduled. Please wait…
                            </p>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
