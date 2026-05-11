/* eslint-disable react-hooks/purity */
"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

type TwitchPlayerOptions = {
    channel?: string;
    parent: string[];
    width?: string | number;
    height?: string | number;
    autoplay?: boolean;
    muted?: boolean;
};

type TwitchPlayerInstance = {
    destroy?: () => void;
    setMuted?: (muted: boolean) => void;
};

type TwitchPlayerApi = {
    Player: new (
        elementId: string,
        options: TwitchPlayerOptions
    ) => TwitchPlayerInstance;
};

type Props = {
    channel: string;
    autoplay?: boolean;
    muted?: boolean;
    className?: string;
};

export default function TwitchEmbedPlayer({
    channel,
    autoplay = true,
    muted = false,
    className = "",
}: Props) {
    const containerIdRef = useRef(
        `twitch-embed-${Math.random().toString(36).slice(2)}`
    );
    const playerRef = useRef<TwitchPlayerInstance | null>(null);

    const [scriptLoaded, setScriptLoaded] = useState(false);

    useEffect(() => {
        const twitchApi = (window as Window & { Twitch?: TwitchPlayerApi }).Twitch;

        if (!scriptLoaded || !twitchApi?.Player || !channel) return;

        const parentHost =
            typeof window !== "undefined" ? window.location.hostname : "localhost";

        if (playerRef.current?.destroy) {
            playerRef.current.destroy();
            playerRef.current = null;
        }

        playerRef.current = new twitchApi.Player(containerIdRef.current, {
            channel,
            parent: [parentHost],
            width: "100%",
            height: "100%",
            autoplay,
            muted,
        });

        if (muted && playerRef.current?.setMuted) {
            playerRef.current.setMuted(true);
        }

        return () => {
            if (playerRef.current?.destroy) {
                playerRef.current.destroy();
                playerRef.current = null;
            }
        };
    }, [scriptLoaded, channel, autoplay, muted]);

    return (
        <div className={className}>
            <Script
                src="https://player.twitch.tv/js/embed/v1.js"
                strategy="afterInteractive"
                onLoad={() => setScriptLoaded(true)}
            />
            <div id={containerIdRef.current} className="w-full h-full" />
        </div>
    );
}
