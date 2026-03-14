"use client";

import { PropsWithChildren, useEffect } from "react";
import { getEcho } from "@/shared/lib/echo";
import { useGetStartLiveMatchDataQuery } from "@/redux/features/dashboard/dashboardManagement";
import { useAppDispatch } from "@/redux/store";
import { setLiveStatus } from "@/redux/features/live/liveStatusReducer";
import { ILiveStatusChangedEvent } from "@/types/liveMatchDetails/liveStatus";


export default function LiveStatusProvider({
    children,
}: PropsWithChildren) {
    const dispatch = useAppDispatch();

    const { data } = useGetStartLiveMatchDataQuery();

    // initial API data -> redux
    useEffect(() => {
        if (data?.data) {
            dispatch(setLiveStatus(data?.data));
        }
    }, [data, dispatch]);

    // socket listener -> redux
    useEffect(() => {
        const echo = getEcho();
        if (!echo) return;

        const channelName = "live-status-updates";

        const channel = echo.channel(channelName);

        channel.listen(".status.changed", (event: ILiveStatusChangedEvent) => {
            console.log("Live status broadcast received:", event);
            if (event?.data) {
                dispatch(setLiveStatus(event.data));
            }
        });

        return () => {
            echo.leave(channelName);
        };
    }, [dispatch]);

    return children;
}