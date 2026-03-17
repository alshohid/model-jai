"use client";


import { useRouter } from "next/navigation";
import { cn } from "@/shared/lib/utils/cn";


interface NotificationItemProps {
    id: string;
    type: "live" | "goal" | "match_start" | "match_end";
    playerId?: string;
    playerName?: string;
    title?: string;
    read?: boolean;
    playerColor?: string; // Instagram-like color copying
    matchId?: string;
    message: string;
    timestamp: string;
    onClick?: () => void;
    className?: string;
}

export default function NotificationItem({
    id,
    type,
    playerId,
    playerColor,
    matchId,
    message,
    timestamp,
    onClick,
    className,
}: NotificationItemProps) {
    const router = useRouter();

    const handleClick = () => {
        if (matchId) {
            router.push(`/live-stream/match`);
        }
        onClick?.();
    };

    const getTypeColor = () => {
        if (playerColor) return playerColor;
        switch (type) {
            case "live":
                return "#FF2EC8";
            case "goal":
                return "#00C3FF";
            case "match_start":
                return "#B7FF4A";
            case "match_end":
                return "#FF2EC8";
            default:
                return "#00C3FF";
        }
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className={cn(
                "w-full flex items-start gap-3 p-3 md:p-4 rounded-lg",
                "bg-white/5 border border-white/10",
                "hover:bg-white/10 transition-all",
                "text-left cursor-pointer",
                className
            )}
        >
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <h3
                        className="font-semibold text-sm md:text-base truncate"
                        style={{ color: getTypeColor() }}
                    >
                        {message}
                    </h3>

                </div>
                <p className="text-white/80 text-xs md:text-sm leading-relaxed mb-1">
                    {message}
                </p>
                <p className="text-white/50 text-xs">{timestamp}</p>
            </div>
        </button>
    );
}
