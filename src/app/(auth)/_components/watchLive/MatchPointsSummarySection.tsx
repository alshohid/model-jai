"use client";

import MatchPointsCard from "@/shared/components/card/MatchPointsCard";
import { cn } from "@/shared/lib/utils/cn";
import LiveBadge from "@/shared/UI/button/LiveButton";
import Image from "next/image";

type Props = {
    isLive: boolean;
    timeLeft?: {
        hours: number;
        minutes: number;
        seconds: number;
    };
    onStartStreaming?: () => void;
    isScheduled?: boolean;
    className?: string;
};

export default function MatchPointsSummarySection({
    isLive,
    timeLeft,
    className,
    onStartStreaming,
    isScheduled


}: Props) {
    const left = {
        playerName: "Jack",
        teamLogoSrc: "/images/home/bayern.png",
        points: 1000,
    };

    const right = {
        playerName: "Steve",
        teamLogoSrc: "/images/home/totenhum.png",
        points: 2000,
    };

    return (
        <section className={cn("relative", className)}>
            <div className="pointer-events-none absolute right-0 bottom-0 -z-10 translate-y-1/2">
                <Image
                    src="/images/home/bottom_right.png"
                    width={702}
                    height={702}
                    alt="elips"
                    className="w-[1700px] h-[1400px]"
                />
            </div>

            <div className="container py-10">
                <div className="flex justify-center items-center py-8">
                    {isLive && (
                        <div >
                            <LiveBadge />
                        </div>
                    )}

                </div>
                {/* points */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
                    <MatchPointsCard
                        playerName={left.playerName}
                        teamLogoSrc={left.teamLogoSrc}
                        title="Matched Points"
                        points={left.points}
                        onShare={() => { }}
                    />

                    <MatchPointsCard
                        playerName={right.playerName}
                        teamLogoSrc={right.teamLogoSrc}
                        title="Unmatched Points"
                        points={right.points}
                        onShare={() => { }}
                    />
                </div>

                {/* status */}
                {/* status */}
                <div className="mt-10 text-center text-white/85 text-[16px] md:text-[18px] tracking-wide">
                    {!isLive ? (
                        <>
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

                            {/* ✅ Start Streaming Button */}
                            {onStartStreaming && !isScheduled && (
                                <div className="mt-6 flex justify-center">
                                    <button
                                        onClick={onStartStreaming}
                                        className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 transition font-semibold text-white shadow-lg"
                                    >
                                        Start Streaming (Live in 1 min)
                                    </button>
                                </div>
                            )}

                            {isScheduled && (
                                <p className="mt-4 text-sm text-yellow-300">
                                    Streaming scheduled. Please wait…
                                </p>
                            )}
                        </>
                    ) : (
                        <div>
                            <h4 className="text-2xl font-extralight pt-2">Live Now</h4>
                            <div className="flex items-center justify-center gap-2">
                                <Image
                                    src="/images/home/live.png"
                                    alt="live_icon"
                                    width={24}
                                    height={24}
                                />
                                <h4 className="text-lg font-semibold">Support Closed</h4>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </section>
    );
}
