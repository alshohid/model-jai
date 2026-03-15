/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";

export default function TwitchPlayer() {
    const embedRef = useRef<HTMLDivElement>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const playerRef = useRef<any>(null);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://embed.twitch.tv/embed/v1.js";
        script.async = true;

        script.onload = () => {
            const Twitch = (window as any).Twitch;
            const embed = new Twitch.Embed("twitch-embed", {
                width: "100%",
                height: 450,
                channel: "mattp1tommy",
                autoplay: true,
                muted: false,
                layout: "video",
                parent: [window.location.hostname],
            });

            embed.addEventListener(Twitch.Embed.VIDEO_READY, () => {
                playerRef.current = embed.getPlayer();

                const handleClick = () => {
                    if (playerRef.current) {
                        playerRef.current.setMuted(false);
                    }
                };

                document.addEventListener("click", handleClick, { once: true });
            });
        };

        document.body.appendChild(script);
    }, []);

    return <div id="twitch-embed" ref={embedRef}></div>;
}