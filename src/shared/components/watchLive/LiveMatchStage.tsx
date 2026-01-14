"use client";

import MuxPlayer from "@mux/mux-player-react";
import TriplePanelHUD from "./TriplePanelHUD";
import SupportControls from "./SupportControls";
import { useMatchRealtimeState } from "./useMatchRealtimeState";

type Props = {
    matchId: string;
    playbackId: string;
    socket?: any;
};

export default function LiveMatchStage({
    matchId,
    playbackId,
    socket,
}: Props) {
    const { state, support } = useMatchRealtimeState({
        matchId,
        socket,
    });

    return (
        <section className="w-full bg-black">
            <div className="relative z-20">
                <TriplePanelHUD state={state} />
            </div>

            <div className="relative w-full aspect-video bg-black overflow-hidden">
                <MuxPlayer
                    playbackId={playbackId}
                    autoPlay
                    muted
                    playsInline
                    streamType="live"
                    className="absolute inset-0 w-full h-full"
                />
                <div className="absolute bottom-6 left-0 w-full z-30 pointer-events-auto">
                    <SupportControls
                        onSupportLeft={() => support("left", 1)}
                        onSupportRight={() => support("right", 1)}
                    />
                </div>
            </div>
        </section>
    );
}
