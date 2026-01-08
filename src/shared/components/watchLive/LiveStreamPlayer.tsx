"use client";

import MuxPlayer from "@mux/mux-player-react";
import { useMemo, useState } from "react";
import { cn } from "@/shared/lib/utils/cn";

type Props = {
    playbackId: string;
    streamStatus: "live" | "offline" | "starting";
    poster?: string;
    className?: string;
};

export default function LiveStreamPlayer({
    playbackId,
    streamStatus,
    poster,
    className,
}: Props) {
    const [error, setError] = useState<string | null>(null);
    const [ready, setReady] = useState(false);

    // avoid unnecessary prop identity changes
    const muxProps = useMemo(
        () => ({
            playbackId,
            streamType: "live" as const,
            autoPlay: true,
            muted: true, // ✅ required for autoplay
            playsInline: true,
            poster,
        }),
        [playbackId, poster]
    );

    const showOverlay =
        streamStatus !== "live" || !!error || !ready;

    return (
        <div
            className={cn(
                "relative w-full overflow-hidden rounded-[16px]",
                "bg-black border border-white/10",
                className
            )}
        >
            {/* 16:9 ratio */}
            <div className="relative w-full aspect-video">
                <MuxPlayer
                    {...muxProps}
                    className="absolute inset-0 w-full h-full"
                    onCanPlay={() => setReady(true)}
                    onError={() => setError("Stream error. Please retry.")}
                />
            </div>

            {showOverlay && (
                <div className="absolute inset-0 grid place-items-center bg-black/45 backdrop-blur-[6px]">
                    <div className="text-center px-6">
                        {error ? (
                            <>
                                <p className="text-white font-semibold">{error}</p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setError(null);
                                        setReady(false);
                                        // playbackId same থাকলে mux নিজেই retry করবে।
                                    }}
                                    className="mt-4 px-5 py-2 rounded-md bg-white/10 border border-white/15 text-white hover:bg-white/15"
                                >
                                    Retry
                                </button>
                            </>
                        ) : streamStatus === "offline" ? (
                            <p className="text-white/90 font-semibold">
                                Stream is offline
                            </p>
                        ) : streamStatus === "starting" ? (
                            <p className="text-white/90 font-semibold">
                                Stream is starting…
                            </p>
                        ) : (
                            <p className="text-white/90 font-semibold">
                                Loading stream…
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
