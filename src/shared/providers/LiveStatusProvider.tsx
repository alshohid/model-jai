/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { PropsWithChildren, useEffect } from "react";
import { getEcho } from "@/shared/lib/echo";
import { useGetLiveStatusQuery } from "@/redux/features/dashboard/dashboardManagement";
import { useAppDispatch } from "@/redux/store";
import { setLiveStatus } from "@/redux/features/live/liveStatusReducer";
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
        if (!echo) return;

        const channelName = "live-status-updates";

        const channel = echo.channel(channelName);

        channel.listen(".status.changed", (event: any) => {
            if (event?.liveStatus) {

                dispatch(setLiveStatus(event.liveStatus));
            }
        });

        return () => {
            echo.leave(channelName);
        };
    }, [dispatch]);

    return children;
}