/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { PropsWithChildren, useEffect } from "react";
import { getEcho } from "@/shared/lib/echo";
import { useGetLiveStatusQuery } from "@/redux/features/dashboard/dashboardManagement";
import { useAppDispatch } from "@/redux/store";
import { setLiveStatus } from "@/redux/features/live/liveStatusReducer";
import {
    attachRealtimeChannelDebug,
    logRealtimeLifecycle,
} from "@/shared/lib/realtimeDebug";
// import { ILiveStatusChangedEvent } from "@/types/liveMatchDetails/liveStatus";


export default function LiveStatusProvider({
    children,
}: PropsWithChildren) {
    const dispatch = useAppDispatch();

    const { data } = useGetLiveStatusQuery();
    useEffect(() => {
        if (data?.data?.live_status && data?.data?.live_status?.length > 0) {
            dispatch(setLiveStatus(data?.data?.live_status[0]));
        }
    }, [data, dispatch]);

    // socket listener -> redux
    useEffect(() => {
        const echo = getEcho();
        const channelName = "live-status-updates";
        if (!echo) {
            logRealtimeLifecycle(
                "LiveStatusProvider",
                "Echo client unavailable; skipping channel subscription",
                { channelName },
            );
            return;
        }

        const channel = echo.channel(channelName);
        const detachRealtimeDebug = attachRealtimeChannelDebug(channel, {
            channelName,
            channelType: "public",
            scope: "LiveStatusProvider",
        });

        channel.listen(".status.changed", (event: any) => {
            if (event?.liveStatus) {
                dispatch(setLiveStatus(event.liveStatus));
            }
        });

        return () => {
            detachRealtimeDebug();
            logRealtimeLifecycle("LiveStatusProvider", "Leaving channel", {
                channelName,
                channelType: "public",
            });
            echo.leave(channelName);
        };
    }, [dispatch]);

    return children;
}
