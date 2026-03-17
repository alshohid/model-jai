/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"


import { cn } from "@/lib/utils";
import NotificationItem from "@/shared/components/notifications/NotificationItem";
import { formatNotificationTime } from "@/shared/lib/formateNotificatinTime";
import { useNotifications } from "@/shared/providers/hook/useNotificaton";
import { ArrowLeft, CheckCheck, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";



export default function AdminNotificationContainer() {
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
            if (item.category === "match.created") {
                return {
                    id: item.id,
                    type: "live" as const,
                    title: item.title,
                    playerName: "MODELJAY",
                    playerColor: "#00C3FF",
                    message: item.message,
                    timestamp: formatNotificationTime(item.createdAt),
                    read: item.read,
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
        <div>
            <div className="sticky top-0 bg-black/95 backdrop-blur-lg z-10 border-b border-white/10">
                <div className="container px-4 py-3">
                    <div className="flex items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="text-white hover:text-white/80 transition"
                            >
                                <ArrowLeft className="size-6" />
                            </button>

                            <div>
                                <h1 className="text-white font-bold text-xl">Notifications</h1>
                                <p className="text-sm text-white/50">
                                    {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
                                </p>
                            </div>
                        </div>

                        {notifications.length > 0 && (
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={handleMarkAllRead}
                                    disabled={isMarkingRead}
                                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 text-sm text-white flex items-center gap-2"
                                >
                                    <CheckCheck className="size-4" />
                                    Mark all read
                                </button>

                                <button
                                    type="button"
                                    onClick={handleClearAll}
                                    disabled={isClearingAll}
                                    className="px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/30 border border-red-500/20 text-sm text-red-300 flex items-center gap-2"
                                >
                                    <Trash2 className="size-4" />
                                    Delete all
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="px-4 py-4">
                <div className="space-y-3">
                    {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={cn(
                                "rounded-xl border transition-all p-4",
                                notification.read
                                    ? "border-white/10 bg-white/5"
                                    : "border-[#FF2EC8]/30 bg-[#FF2EC8]/8"
                            )}
                        >
                            <NotificationItem {...notification} />

                            <div className="mt-3 flex items-center gap-2">
                                {!notification.read ? (
                                    <button
                                        onClick={() => handleMarkOneRead(notification.id)}
                                        disabled={processingId === notification.id}
                                        className="px-3 py-1.5 rounded-lg bg-blue-600/20 cursor-pointer hover:bg-blue-600/30 border border-blue-500/20 text-sm text-blue-300"
                                    >
                                        Mark as read
                                    </button>
                                ) : (
                                    <button

                                        disabled={processingId === notification.id}
                                        className="px-3 py-1.5 rounded-lg flex gap-2 bg-green-300/20 hover:bg-green-300/30 border border-green-500/20 text-sm text-green-300"
                                    >
                                        <CheckCheck className="size-4" />
                                        read
                                    </button>
                                )}

                                <button
                                    onClick={() => handleDeleteOne(notification.id)}
                                    disabled={processingId === notification.id}
                                    className="px-3 py-1.5 rounded-lg bg-red-600/20 cursor-pointer hover:bg-red-600/30 border border-red-500/20 text-sm text-red-300"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {notifications?.length === 0 && (
                    <div className="text-center py-12 text-white/50">
                        <p className="text-sm">No notifications yet</p>
                    </div>
                )}
            </div>
        </div>
    );
}