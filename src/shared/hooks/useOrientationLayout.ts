"use client";

import { useEffect, useState } from "react";

export function useOrientationLayout(): "tiktok" | "twitch" {
    const [isPortrait, setIsPortrait] = useState<boolean>(true);

    useEffect(() => {
        const mq = window.matchMedia("(orientation: portrait)");
        const update = () => setIsPortrait(mq.matches);
        console.log(isPortrait,"mg")
        update();
        mq.addEventListener?.("change", update);
        return () => mq.removeEventListener?.("change", update);
    }, []);

    return isPortrait ? "tiktok" : "twitch";
}
