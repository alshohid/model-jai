"use client";

import { useState } from "react";
import { Bell, BellOff } from "lucide-react";
import { cn } from "@/shared/lib/utils/cn";

interface PlayerNotificationBellProps {
    playerId: string;
    playerName: string;
    isSubscribed: boolean;
    onToggle?: (playerId: string, subscribed: boolean) => void;
    className?: string;
    size?: "sm" | "md" | "lg";
}

export default function PlayerNotificationBell({
    playerId,
    playerName,
    isSubscribed,
    onToggle,
    className,
    size = "md",
}: PlayerNotificationBellProps) {
    const [subscribed, setSubscribed] = useState(isSubscribed);

    const sizeClasses = {
        sm: "size-6",
        md: "size-8",
        lg: "size-10",
    };

    const iconSizeClasses = {
        sm: "size-3",
        md: "size-4",
        lg: "size-5",
    };

    const handleToggle = () => {
        const newState = !subscribed;
        setSubscribed(newState);
        onToggle?.(playerId, newState);
    };

    return (
        <button
            type="button"
            onClick={handleToggle}
            className={cn(
                "relative inline-flex items-center justify-center",
                "rounded-full transition-all",
                sizeClasses[size],
                subscribed
                    ? "bg-[#FF2EC8]/20 text-[#FF2EC8] border border-[#FF2EC8]/30 hover:bg-[#FF2EC8]/30"
                    : "bg-white/10 text-white/60 border border-white/20 hover:bg-white/15",
                "focus:outline-none focus:ring-2 focus:ring-[#FF2EC8]/50",
                className
            )}
            aria-label={subscribed ? `Unsubscribe from ${playerName}` : `Subscribe to ${playerName}`}
            title={
                subscribed
                    ? `You'll receive notifications when ${playerName} goes live, scores goals, or plays matches`
                    : `Click to receive notifications for ${playerName}`
            }
        >
            {subscribed ? (
                <Bell className={iconSizeClasses[size]} fill="currentColor" />
            ) : (
                <BellOff className={iconSizeClasses[size]} />
            )}
        </button>
    );
}
