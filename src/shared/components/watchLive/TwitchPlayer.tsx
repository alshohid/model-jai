import { useEffect, useId, useRef, useState } from "react";

type Props = {
    channel: string;
};

type TwitchEmbedPlayer = {
    setMuted: (muted: boolean) => void;
};

type TwitchEmbedInstance = {
    addEventListener: (event: string, callback: () => void) => void;
    getPlayer: () => TwitchEmbedPlayer;
};

type TwitchEmbedOptions = {
    width: string;
    height: string;
    channel: string;
    autoplay: boolean;
    muted: boolean;
    layout: "video";
    parent: string[];
};

type TwitchEmbedApi = {
    Embed: {
        new (targetId: string, options: TwitchEmbedOptions): TwitchEmbedInstance;
        VIDEO_READY: string;
    };
};

declare global {
    interface Window {
        Twitch?: TwitchEmbedApi;
        __twitchEmbedPromise?: Promise<TwitchEmbedApi>;
    }
}

const TWITCH_EMBED_SRC = "https://embed.twitch.tv/embed/v1.js";

function loadTwitchEmbedApi() {
    if (window.Twitch?.Embed) {
        return Promise.resolve(window.Twitch);
    }

    if (window.__twitchEmbedPromise) {
        return window.__twitchEmbedPromise;
    }

    window.__twitchEmbedPromise = new Promise<TwitchEmbedApi>((resolve, reject) => {
        const existingScript = document.querySelector<HTMLScriptElement>(
            `script[src="${TWITCH_EMBED_SRC}"]`
        );

        if (existingScript) {
            existingScript.addEventListener(
                "load",
                () => {
                    if (window.Twitch?.Embed) {
                        resolve(window.Twitch);
                        return;
                    }

                    reject(new Error("Twitch SDK loaded without embed API."));
                },
                { once: true }
            );

            existingScript.addEventListener(
                "error",
                () => reject(new Error("Failed to load Twitch embed SDK.")),
                { once: true }
            );

            return;
        }

        const script = document.createElement("script");
        script.src = TWITCH_EMBED_SRC;
        script.async = true;

        script.onload = () => {
            if (window.Twitch?.Embed) {
                resolve(window.Twitch);
                return;
            }

            reject(new Error("Twitch SDK loaded without embed API."));
        };

        script.onerror = () => reject(new Error("Failed to load Twitch embed SDK."));
        document.body.appendChild(script);
    });

    return window.__twitchEmbedPromise;
}

export default function TwitchPlayer({ channel }: Props) {
    const embedRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<TwitchEmbedPlayer | null>(null);
    const [isReady, setIsReady] = useState(false);
    const [hasError, setHasError] = useState(false);
    const embedId = useId().replace(/:/g, "");

    useEffect(() => {
        const embedElement = embedRef.current;

        if (!channel || !embedElement) {
            return;
        }

        let isMounted = true;
        let cleanupUnmute: (() => void) | undefined;

        const setupPlayer = async () => {
            try {
                setHasError(false);
                setIsReady(false);

                const twitch = await loadTwitchEmbedApi();

                if (!isMounted) {
                    return;
                }

                embedElement.innerHTML = "";

                const embed = new twitch.Embed(embedId, {
                    width: "100%",
                    height: "100%",
                    channel,
                    autoplay: true,
                    muted: true,
                    layout: "video",
                    parent: [window.location.hostname],
                });

                embed.addEventListener(twitch.Embed.VIDEO_READY, () => {
                    if (!isMounted) {
                        return;
                    }

                    playerRef.current = embed.getPlayer();
                    setIsReady(true);

                    const unmute = () => {
                        playerRef.current?.setMuted(false);
                    };

                    window.addEventListener("pointerdown", unmute, { once: true });
                    window.addEventListener("keydown", unmute, { once: true });

                    cleanupUnmute = () => {
                        window.removeEventListener("pointerdown", unmute);
                        window.removeEventListener("keydown", unmute);
                    };
                });
            } catch (error) {
                console.error("Unable to load Twitch player:", error);

                if (isMounted) {
                    setHasError(true);
                    setIsReady(false);
                }
            }
        };

        setupPlayer();

        return () => {
            isMounted = false;
            cleanupUnmute?.();
            playerRef.current = null;

            embedElement.innerHTML = "";
        };
    }, [channel, embedId]);

    return (
        <div className="relative size-full bg-black">
            <div
                id={embedId}
                ref={embedRef}
                className={`size-full transition-opacity duration-500 ${isReady ? "opacity-100" : "opacity-0"}`}
            />

            {!isReady && !hasError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_top,_rgba(0,195,255,0.18),_transparent_45%),linear-gradient(180deg,_rgba(8,8,8,0.96)_0%,_rgba(0,0,0,1)_100%)]">
                    <div className="flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#FF2EC8] shadow-[0_0_12px_rgba(255,46,200,0.95)] animate-pulse" />
                        Loading Stream
                    </div>
                    <p className="text-center text-sm text-white/45">
                        Preparing the Twitch player for this match.
                    </p>
                </div>
            )}

            {hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(180deg,_rgba(8,8,8,0.96)_0%,_rgba(0,0,0,1)_100%)] px-6 text-center">
                    <div>
                        <p className="text-sm font-semibold text-white">Stream unavailable right now</p>
                        <p className="mt-2 text-xs text-white/55">
                            We could not connect to the Twitch broadcast. Please try again in a moment.
                        </p>
                    </div>
                </div>
            )}

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
        </div>
    );
}
