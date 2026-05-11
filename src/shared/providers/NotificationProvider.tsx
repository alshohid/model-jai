"use client";

import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useGetMeDataQuery } from "@/redux/features/auth/authapi";
import { useGetAllNotificationsQuery } from "@/redux/features/notification/notificationManagement";
import { useAppDispatch } from "@/redux/store";
import { getEcho } from "@/shared/lib/echo";
import {
    addNotification,
    setNotifications,
} from "@/redux/features/notification/notificationReducer";
import {
    mapApiNotificationItem,
    mapSocketMatchCompletedNotification,
    mapSocketMatchCreatedNotification,
    mapSocketPrivateNotification,
} from "../lib/notificationMapper";
import { IRawNotificationData } from "@/types/notifications/NotitficationsTypes";
import MatchRulesModal from "../components/modal/MatchRulesModal";
import {
    attachRealtimeChannelDebug,
    logRealtimeLifecycle,
} from "@/shared/lib/realtimeDebug";


interface IMatchCreatedPayload {
    message: string;
    rules?: string;
    player_ids?: number[];
    socket: null;
}

interface IMatchCompletedPayload {
    match_id: number;
    message: string;
    socket?: null;
}

interface IRulesModalState {
    open: boolean;
    rules: string;
    message: string;
}

export default function NotificationProvider({ children }: PropsWithChildren) {
    const dispatch = useAppDispatch();
    const { data: meData } = useGetMeDataQuery();
    const { data: notificationsData } = useGetAllNotificationsQuery();
    const seenRealtimeEventsRef = useRef<Set<string>>(new Set());

    const user = meData?.data?.user;
    const userId = user?.id;
    const role = user?.role;

    const [rulesModal, setRulesModal] = useState<IRulesModalState>({
        open: false,
        rules: "",
        message: "",
    });

    // Hydrate notifications from API
    useEffect(() => {
        if (notificationsData?.data) {
            const mapped = notificationsData.data.map(mapApiNotificationItem);
            dispatch(setNotifications(mapped));
        }
    }, [notificationsData, dispatch]);

    // Socket listeners
    useEffect(() => {
        if (!userId) return;

        const echo = getEcho();
        if (!echo) {
            logRealtimeLifecycle(
                "NotificationProvider",
                "Echo client unavailable; skipping notification channels",
                { userId },
            );
            return;
        }

        const cleanups: Array<() => void> = [];

        // 1) Match created notification for user
        const matchChannelName = `user.${userId}`;
        const matchChannel = echo.private(matchChannelName);
        const detachMatchChannelDebug = attachRealtimeChannelDebug(matchChannel, {
            channelName: matchChannelName,
            channelType: "private",
            scope: "NotificationProvider",
        });

        matchChannel.listen(".match.created", (event: IMatchCreatedPayload) => {
            const isPlayer = event.player_ids?.includes(Number(userId)) ?? false;

            dispatch(addNotification(mapSocketMatchCreatedNotification(event)));
            if (isPlayer && event.rules) {
                setRulesModal({
                    open: true,
                    rules: event.rules,
                    message: event.message,
                });
            }
        });

        matchChannel.listen(".match.completed", (event: IMatchCompletedPayload) => {
            const eventKey = `user:${userId}:match.completed:${event.match_id}`;

            if (seenRealtimeEventsRef.current.has(eventKey)) {
                return;
            }

            seenRealtimeEventsRef.current.add(eventKey);
            dispatch(addNotification(mapSocketMatchCompletedNotification(event)));
            console.log("match completed", event);
            toast.success(event.message || "The match is over.");
        });

        cleanups.push(() => {
            detachMatchChannelDebug();
            logRealtimeLifecycle("NotificationProvider", "Leaving channel", {
                channelName: matchChannelName,
                channelType: "private",
            });
            echo.leave(`private-${matchChannelName}`);
        });

        // 2) Private user/admin notifications
        const privateNotificationChannelName = `App.Models.User.${userId}`;
        const privateNotificationChannel = echo.private(privateNotificationChannelName);
        const detachPrivateNotificationDebug = attachRealtimeChannelDebug(
            privateNotificationChannel,
            {
                channelName: privateNotificationChannelName,
                channelType: "private",
                scope: "NotificationProvider",
            },
        );

        privateNotificationChannel.notification((notification: IRawNotificationData) => {
            dispatch(addNotification(mapSocketPrivateNotification(notification)));
        });

        cleanups.push(() => {
            detachPrivateNotificationDebug();
            logRealtimeLifecycle("NotificationProvider", "Leaving channel", {
                channelName: privateNotificationChannelName,
                channelType: "private",
            });
            echo.leave(`private-${privateNotificationChannelName}`);
        });

        // 3) Optional explicit admin channel
        if (role === "super_admin" && Number(userId) === 1) {
            const adminChannelName = "App.Models.User.1";
            const adminChannel = echo.private(adminChannelName);
            const detachAdminChannelDebug = attachRealtimeChannelDebug(
                adminChannel,
                {
                    channelName: adminChannelName,
                    channelType: "private",
                    scope: "NotificationProvider",
                },
            );

            adminChannel.notification((notification: IRawNotificationData) => {
                dispatch(addNotification(mapSocketPrivateNotification(notification)));
            });

            cleanups.push(() => {
                detachAdminChannelDebug();
                logRealtimeLifecycle("NotificationProvider", "Leaving channel", {
                    channelName: adminChannelName,
                    channelType: "private",
                });
                echo.leave(`private-${adminChannelName}`);
            });
        }

        return () => {
            cleanups.forEach((fn) => fn());
        };
    }, [dispatch, userId, role]);

    return (
        <>
            {children}
            <MatchRulesModal
                open={rulesModal.open}
                onClose={() => setRulesModal((prev) => ({ ...prev, open: false }))}
                rules={rulesModal.rules}
                message={rulesModal.message}
            />
        </>
    );
}
