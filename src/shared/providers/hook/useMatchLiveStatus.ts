"use client";

import { useEffect, useMemo, useState } from "react";

type Options = {
    /** ISO string from admin panel later */
    scheduledAt: string;
};

export function useMatchLiveStatus({ scheduledAt }: Options) {
    const scheduledTime = useMemo(
        () => new Date(scheduledAt).getTime(),
        [scheduledAt]
    );

    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        const interval = setInterval(() => {
            setNow(Date.now());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const isLive = now >= scheduledTime;
    const diffMs = Math.max(0, scheduledTime - now);

    const timeLeft = {
        hours: Math.floor(diffMs / (1000 * 60 * 60)),
        minutes: Math.floor((diffMs / (1000 * 60)) % 60),
        seconds: Math.floor((diffMs / 1000) % 60),
    };

    return {
        isLive,
        timeLeft,
    };
}
