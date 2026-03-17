"use client";

import { PropsWithChildren, useEffect } from "react";
import { useGetMeDataQuery } from "@/redux/features/auth/authapi";
import { useGetAllNotificationsQuery } from "@/redux/features/notification/notificationManagement";
import { useAppDispatch } from "@/redux/store";
import { getEcho } from "@/shared/lib/echo";
import {
    addNotification,
    setNotifications,
} from "@/redux/features/notification/notificationReducer";
import { mapApiNotificationItem, mapSocketMatchCreatedNotification, mapSocketPrivateNotification } from "../lib/notificationMapper";
import { IRawNotificationData } from "@/types/notifications/NotitficationsTypes";


export default function NotificationProvider({
    children,
}: PropsWithChildren) {
    const dispatch = useAppDispatch();
    const { data: meData } = useGetMeDataQuery();
    const { data: notificationsData } = useGetAllNotificationsQuery();

    const user = meData?.data?.user;
    const userId = user?.id;
    const role = user?.role;
    useEffect(() => {
        if (notificationsData?.data) {
            const mapped = notificationsData?.data?.map(mapApiNotificationItem);
            dispatch(setNotifications(mapped));
        }
    }, [notificationsData, dispatch]);

    // socket listeners
    useEffect(() => {
        if (!userId) return;

        const echo = getEcho();
        if (!echo) return;

        const cleanups: Array<() => void> = [];

        // 1) Match created notification for user
        const matchChannelName = `user.${userId}`;
        const matchChannel = echo.private(matchChannelName);

        matchChannel.listen(".match.created", (event: { message: string }) => {
            console.log("Match created notification:", event);
            dispatch(addNotification(mapSocketMatchCreatedNotification(event)));
        });

        cleanups.push(() => {
            echo.leave(`private-${matchChannelName}`);
        });

        // 2) Private user/admin notifications
        const privateNotificationChannelName = `App.Models.User.${userId}`;
        const privateNotificationChannel = echo.private(privateNotificationChannelName);

        privateNotificationChannel.notification((notification: IRawNotificationData) => {
            console.log("Private notification received:", notification);
            dispatch(addNotification(mapSocketPrivateNotification(notification)));
        });

        cleanups.push(() => {
            echo.leave(`private-${privateNotificationChannelName}`);
        });

        // 3) Optional explicit admin channel
        if (role === "super_admin" && Number(userId) === 1) {
            const adminChannelName = "App.Models.User.1";
            const adminChannel = echo.private(adminChannelName);

            adminChannel.notification((notification: IRawNotificationData) => {
                console.log("Admin private notification received:", notification);
                dispatch(addNotification(mapSocketPrivateNotification(notification)));
            });

            cleanups.push(() => {
                echo.leave(`private-${adminChannelName}`);
            });
        }

        return () => {
            cleanups.forEach((fn) => fn());
        };
    }, [dispatch, userId, role]);

    return children;
}