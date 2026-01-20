"use client";

import MuxPlayer from "@mux/mux-player-react";
import { cn } from "@/shared/lib/utils/cn";
import type { DemoPlayer, SupportSide } from "@/shared/hooks/useMatchDemoStore";
import TriplePanelHUD from "./TriplePanelHUD";

type Props = {
    matchId: string;
    playbackId: string;
    isLive: boolean;
    layout: "tiktok" | "twitch";

    leftPlayer: DemoPlayer;
    rightPlayer: DemoPlayer;
    middle: { label: string; imageSrc: string };
    bossSide: SupportSide | null;

    onSupportLeft: () => void;
    onSupportRight: () => void;
};

export default function LiveMatchStage({
    matchId,
    playbackId,
    isLive,
    layout,
    leftPlayer,
    rightPlayer,
    middle,
    bossSide,
    onSupportLeft,
    onSupportRight,
}: Props) {
    const playerId = `live-player-${matchId}`;

    return (
        <section className="w-full bg-black text-white">
            <div className={cn("mx-auto w-full", layout === "tiktok" ? "max-w-[520px]" : "max-w-[1200px] px-4")}>
                {/* ✅ Top 3 panel */}
                <TriplePanelHUD
                    left={leftPlayer}
                    right={rightPlayer}
                    middle={middle}
                    bossSide={bossSide}
                />

                {/* ✅ Main live video */}
                <div className="relative w-full aspect-video bg-black overflow-hidden mt-2 rounded-xl">
                    {isLive ? (
                        <MuxPlayer
                            id={playerId}
                            playbackId={playbackId}
                            autoPlay
                            muted
                            playsInline
                            streamType="live"
                            className="absolute inset-0 w-full h-full"
                            style={
                                {
                                    // @ts-ignore
                                    "--media-object-fit": "cover",
                                } as any
                            }
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-white/70">
                            Live starts soon…
                        </div>
                    )}

                    {/* ✅ click-to-support overlay (client like “CLICK SUPPORT …”) */}
                    <div className="absolute inset-0 z-20 grid grid-cols-2">
                        <button
                            type="button"
                            onClick={onSupportLeft}
                            className="relative"
                            aria-label="Support Left"
                        >
                            <span className="absolute left-3 bottom-3 rounded-lg bg-black/60 px-3 py-2 text-xs font-bold">
                                CLICK SUPPORT {leftPlayer.name}
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={onSupportRight}
                            className="relative"
                            aria-label="Support Right"
                        >
                            <span className="absolute right-3 bottom-3 rounded-lg bg-black/60 px-3 py-2 text-xs font-bold">
                                CLICK SUPPORT {rightPlayer.name}
                            </span>
                        </button>
                    </div>

                    {/* ✅ LIVE pill (একবারই দেখাও) */}
                    {isLive && (
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-30">
                            <span className="px-4 py-2 rounded-full bg-red-600 font-bold">LIVE</span>
                        </div>
                    )}

                    {/* ✅ Fullscreen/Zoom */}
                    <button
                        type="button"
                        onClick={() => (document.getElementById(playerId) as any)?.requestFullscreen?.()}
                        className="absolute top-3 right-3 z-30 rounded-xl bg-black/60 px-3 py-2 text-xs"
                    >
                        Fullscreen
                    </button>
                </div>
            </div>
        </section>
    );
}
