"use client";

import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import authApi, { useGetMeDataQuery } from "@/redux/features/auth/authapi";
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
import CoinReceivedToast from "../components/CoinReceivedToast";
import {
    attachRealtimeChannelDebug,
    logRealtimeLifecycle,
} from "@/shared/lib/realtimeDebug";
import ChallengeWonToast from "../components/ChallengeWonToast";
import ChallengeLostToast from "../components/ChallengeLostToast";


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
            console.log("Private notification", notification);
            dispatch(addNotification(mapSocketPrivateNotification(notification)));


            // Show custom toast with sound for coin.received event
            if (notification.type === "coin.received" && notification.amount && notification.sender_name) {
                // Reflect the received coins in the cached balance shown in the navbar
                dispatch(
                    authApi.util.updateQueryData("getMeData", undefined, (draft) => {
                        if (!draft.data) return;
                        draft.data.total_balance = Number(draft.data.total_balance || 0) + Number(notification.amount);
                        if (draft.data.user) {
                            draft.data.user.total_balance = Number(draft.data.user.total_balance || 0) + Number(notification.amount);
                        }
                    }),
                );

                // Play cash money sound
                try {
                    const audio = new Audio("/images/cash_money_sound.mp3");
                    audio.volume = 0.6;
                    audio.play().catch((err) => console.warn("Coin sound play failed:", err));
                } catch (err) {
                    console.warn("Coin sound error:", err);
                }

                // Show custom toast notification
                toast.custom(
                    (t) => (
                        <CoinReceivedToast
                            sender_name={notification.sender_name!}
                            amount={notification.amount!}
                        />
                    ),
                    {
                        duration: 5000,
                        position: "top-center",
                    },
                );
            }
            else if (notification.type === "challenge.won" && notification.payout!) {
                try {
                    const audio = new Audio("/images/cash_money_sound.mp3");
                    audio.volume = 0.6;
                    audio.play().catch((err) => console.warn("Coin sound play failed:", err));
                } catch (err) {
                    console.warn("Coin sound error:", err);
                }

                toast.custom(
                    (t) => (
                        <ChallengeWonToast amount={notification.payout!} />
                    ),
                    {
                        duration: 5000,
                        position: "top-center",
                    },
                );
            }
            else if (notification.type === "challenge.lost") {
                try {
                    const audio = new Audio("/images/cash_money_sound.mp3");
                    audio.volume = 0.6;
                    audio.play().catch((err) => console.warn("Coin sound play failed:", err));
                } catch (err) {
                    console.warn("Coin sound error:", err);
                }

                toast.custom(
                    (t) => (
                        <ChallengeLostToast amount={notification.stake!} />
                    ),
                    {
                        duration: 5000,
                        position: "top-center",
                    },
                );
            }
            else if (notification.type === "challenge.opponent_ready") {
                toast.success(notification.message);
            }
        })


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
