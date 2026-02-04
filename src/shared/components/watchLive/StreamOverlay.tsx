/**
 * StreamOverlay Component
 * Shows loading, error, or offline states for live stream
 * Following Single Responsibility Principle
 */

"use client";

import type { StreamStatus } from "@/shared/components/watchLive/types";

interface StreamOverlayProps {
    status: StreamStatus;
    error: string | null;
    onRetry?: () => void;
}

export default function StreamOverlay({
    status,
    error,
    onRetry,
}: StreamOverlayProps) {
    return (
        <div className="absolute inset-0 grid place-items-center bg-black/45 backdrop-blur-[6px]">
            <div className="text-center px-6">
                {error ? (
                    <>
                        <p className="text-white font-semibold">{error}</p>
                        {onRetry && (
                            <button
                                type="button"
                                onClick={onRetry}
                                className="mt-4 px-5 py-2 rounded-md bg-white/10 border border-white/15 text-white hover:bg-white/15"
                            >
                                Retry
                            </button>
                        )}
                    </>
                ) : status === "offline" ? (
                    <p className="text-white/90 font-semibold">Stream is offline</p>
                ) : status === "starting" ? (
                    <p className="text-white/90 font-semibold">Stream is starting…</p>
                ) : (
                    <p className="text-white/90 font-semibold">Loading stream…</p>
                )}
            </div>
        </div>
    );
}
