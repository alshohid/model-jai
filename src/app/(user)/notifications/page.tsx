"use client";

import { useState } from "react";
import { ArrowLeft, Copy, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import PublicNavbar from "@/app/(public)/_components/publicNavbar/PublicNavbar";
import NotificationItem from "@/shared/components/notifications/NotificationItem";
import { cn } from "@/shared/lib/utils/cn";
import BigBossIndicator from "@/shared/components/user/BigBossIndicator";

export default function NotificationsPage() {
    const router = useRouter();
    const [copied, setCopied] = useState(false);
    const bigBossName = "TEAM JACK"; // This should come from API/context
    const bigBossColor = "#FF2EC8"; // Instagram-like color

    const notifications = [
        {
            id: "1",
            type: "live" as const,
            playerId: "jack",
            playerName: "TEAM JACK",
            playerAvatar: "/images/home/user.png",
            playerColor: bigBossColor,
            isBigBoss: true,
            matchId: "match-123",
            message: "is going live now! Watch the match",
            timestamp: "2m ago",
        },
        {
            id: "2",
            type: "goal" as const,
            playerId: "jack",
            playerName: "TEAM JACK",
            playerAvatar: "/images/home/user.png",
            playerColor: bigBossColor,
            isBigBoss: true,
            matchId: "match-123",
            message: "scored a goal! 🎉",
            timestamp: "5m ago",
        },
        {
            id: "3",
            type: "match_start" as const,
            playerId: "steve",
            playerName: "TEAM STEEVE",
            playerAvatar: "/images/home/user.png",
            isBigBoss: false,
            matchId: "match-124",
            message: "match is starting now",
            timestamp: "10m ago",
        },
    ];

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(bigBossName);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <div className="min-h-screen bg-black">
            <PublicNavbar />
            
            {/* Header */}
            <div className="sticky top-0 bg-black/95 backdrop-blur-lg z-10 border-b border-white/10">
                <div className="container px-4 py-3">
                    <div className="flex items-center gap-3 mb-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="text-white hover:text-white/80 transition"
                        >
                            <ArrowLeft className="size-6" />
                        </button>
                        <h1 className="text-white font-bold text-xl">Notifications</h1>
                    </div>

                    {/* Big Boss Name Display with Copy */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex items-center gap-2">
                            <BigBossIndicator isBigBoss={true} size="md" />
                            <h2
                                className="text-lg md:text-xl font-bold"
                                style={{ color: bigBossColor }}
                            >
                                {bigBossName}
                            </h2>
                        </div>
                        <button
                            type="button"
                            onClick={handleCopy}
                            className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-lg",
                                "bg-white/10 hover:bg-white/15 border border-white/20",
                                "text-white text-sm font-medium transition-all"
                            )}
                        >
                            {copied ? (
                                <>
                                    <Check className="size-4 text-[#00C3FF]" />
                                    <span className="text-[#00C3FF]">Copied!</span>
                                </>
                            ) : (
                                <>
                                    <Copy className="size-4" />
                                    <span>Copy</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Notifications List */}
            <div className="container px-4 py-4">
                <div className="space-y-2">
                    {notifications.map((notification) => (
                        <NotificationItem
                            key={notification.id}
                            {...notification}
                        />
                    ))}
                </div>

                {notifications.length === 0 && (
                    <div className="text-center py-12 text-white/50">
                        <p className="text-sm">No notifications yet</p>
                    </div>
                )}
            </div>
        </div>
    );
}
