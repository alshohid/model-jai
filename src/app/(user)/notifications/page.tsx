/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, CheckCheck, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import PublicNavbar from "@/app/(public)/_components/publicNavbar/PublicNavbar";
import NotificationItem from "@/shared/components/notifications/NotificationItem";
import { cn } from "@/shared/lib/utils/cn";
import { useNotifications } from "@/shared/providers/hook/useNotificaton";
import { formatNotificationTime } from "@/shared/lib/formateNotificatinTime";
import { getNotificationRoute } from "@/shared/lib/notificationRoutes";

export default function NotificationsPage() {
    const {
        notifications: appNotifications,
        unreadCount,
        markAllRead,
        markOneRead,
        clearOne,
        clearAll,
        isMarkingRead,
        isClearingAll,
    } = useNotifications();

    const router = useRouter();
    const [processingId, setProcessingId] = useState<string | null>(null);

    const notifications = useMemo(() => {
        return appNotifications.map((item) => {
            const route = getNotificationRoute(item);

            if (item.category === "match.created") {
                return {
                    id: item.id,
                    type: "live" as const,
                    title: item.title,
                    playerName: "PLAYER",
                    playerColor: "#00C3FF",
                    message: item.message,
                    timestamp: formatNotificationTime(item.createdAt),
                    read: item.read,
                    route,
                };
            }

            if (item.category === "match.completed") {
                return {
                    id: item.id,
                    type: "match_end" as const,
                    title: item.title,
                    playerName: "Match",
                    playerColor: "#FF2EC8",
                    message: item.message,
                    timestamp: formatNotificationTime(item.createdAt),
                    read: item.read,
                    route,
                };
            }

            if (item.category === "admin.withdrawal.created") {
                return {
                    id: item.id,
                    type: "match_start" as const,
                    title: item.title,
                    playerName: (item.raw as any)?.user_name || "User",
                    playerColor: "#FACC15",
                    message: item.message,
                    timestamp: formatNotificationTime(item.createdAt),
                    read: item.read,
                    route,
                };
            }

            if (item.category === "user.withdrawal.completed") {
                return {
                    id: item.id,
                    type: "goal" as const,
                    title: item.title,
                    playerName: "Withdrawal",
                    playerColor: "#22C55E",
                    message: item.message,
                    timestamp: formatNotificationTime(item.createdAt),
                    read: item.read,
                    route,
                };
            }

            if (item.category === "user.withdrawal.declined") {
                return {
                    id: item.id,
                    type: "goal" as const,
                    title: item.title,
                    playerName: "Withdrawal",
                    playerColor: "#EF4444",
                    message: item.message,
                    timestamp: formatNotificationTime(item.createdAt),
                    read: item.read,
                    route,
                };
            }

            return {
                id: item.id,
                type: "match_start" as const,
                title: item.title,
                playerName: "Notification",
                playerColor: "#FFFFFF",
                message: item.message,
                timestamp: formatNotificationTime(item.createdAt),
                read: item.read,
                route,
            };
        });
    }, [appNotifications]);

    const handleMarkAllRead = async () => {
        const success = await markAllRead();
        if (success) {
            toast.success("All notifications marked as read");
        } else {
            toast.error("Failed to mark all notifications as read");
        }
    };

    const handleClearAll = async () => {
        const success = await clearAll();
        if (success) {
            toast.success("All notifications deleted");
        } else {
            toast.error("Failed to delete all notifications");
        }
    };

    const handleMarkOneRead = async (id: string) => {
        setProcessingId(id);
        const success = await markOneRead(id);
        setProcessingId(null);
        if (success) {
            toast.success("Notification marked as read");
        } else {
            toast.error("Failed to mark notification as read");
        }
    };

    const handleDeleteOne = async (id: string) => {
        setProcessingId(id);
        const success = await clearOne(id);
        setProcessingId(null);
        if (success) {
            toast.success("Notification deleted");
        } else {
            toast.error("Failed to delete notification");
        }
    };

    return (
        <div className="min-h-screen bg-black">
            <PublicNavbar />

            <div className="sticky top-0 bg-black/95 backdrop-blur-lg z-10 border-b border-white/10">
                <div className="container px-3 py-3 sm:px-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-start gap-3 sm:items-center">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="mt-0.5 shrink-0 rounded-full border border-white/10 bg-white/5 p-2 text-white transition hover:bg-white/10 hover:text-white/80 sm:mt-0"
                            >
                                <ArrowLeft className="size-5 sm:size-6" />
                            </button>

                            <div className="min-w-0">
                                <h1 className="text-lg font-bold text-white sm:text-xl">Notifications</h1>
                                <p className="text-xs text-white/50 sm:text-sm">
                                    {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
                                </p>
                            </div>
                        </div>

                        {notifications.length > 0 && (
                            <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:justify-end">
                                <button
                                    type="button"
                                    onClick={handleMarkAllRead}
                                    disabled={isMarkingRead}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm text-white transition hover:bg-white/15 sm:w-auto"
                                >
                                    <CheckCheck className="size-4" />
                                    Mark all read
                                </button>

                                <button
                                    type="button"
                                    onClick={handleClearAll}
                                    disabled={isClearingAll}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-600/20 px-3 py-2 text-sm text-red-300 transition hover:bg-red-600/30 sm:w-auto"
                                >
                                    <Trash2 className="size-4" />
                                    Delete all
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="container px-3 py-4 sm:px-4 sm:py-5">
                <div className="space-y-3">
                    {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={cn(
                                "rounded-xl border p-3 transition-all sm:p-4",
                                notification.read
                                    ? "border-white/10 bg-white/5"
                                    : "border-[#FF2EC8]/30 bg-[#FF2EC8]/8"
                            )}
                        >
                            <NotificationItem
                                {...notification}
                                onClick={() => {
                                    if (!notification.read) {
                                        handleMarkOneRead(notification.id);
                                    }
                                }}
                            />

                            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                                {!notification.read ? (
                                    <button
                                        onClick={() => handleMarkOneRead(notification.id)}
                                        disabled={processingId === notification.id}
                                        className="w-full rounded-lg border border-blue-500/20 bg-blue-600/20 px-3 py-2 text-sm text-blue-300 transition hover:bg-blue-600/30 sm:w-auto"
                                    >
                                        Mark as read
                                    </button>
                                ) : (
                                    <button

                                        disabled={processingId === notification.id}
                                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-green-500/20 bg-green-300/20 px-3 py-2 text-sm text-green-300 transition hover:bg-green-300/30 sm:w-auto"
                                    >
                                        <CheckCheck className="size-4" />
                                        Read
                                    </button>
                                )}

                                <button
                                    onClick={() => handleDeleteOne(notification.id)}
                                    disabled={processingId === notification.id}
                                    className="w-full rounded-lg border border-red-500/20 bg-red-600/20 px-3 py-2 text-sm text-red-300 transition hover:bg-red-600/30 sm:w-auto"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {notifications?.length === 0 && (
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-12 text-center text-white/50">
                        <p className="text-sm sm:text-base">No notifications yet</p>
                    </div>
                )}
            </div>
        </div>
    );
}
