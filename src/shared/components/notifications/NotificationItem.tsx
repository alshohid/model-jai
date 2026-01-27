"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/shared/lib/utils/cn";
import BigBossIndicator from "@/shared/components/user/BigBossIndicator";

interface NotificationItemProps {
    id: string;
    type: "live" | "goal" | "match_start" | "match_end";
    playerId: string;
    playerName: string;
    playerAvatar: string;
    playerColor?: string; // Instagram-like color copying
    isBigBoss?: boolean;
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
    playerName,
    playerAvatar,
    playerColor,
    isBigBoss,
    matchId,
    message,
    timestamp,
    onClick,
    className,
}: NotificationItemProps) {
    const router = useRouter();

    const handleClick = () => {
        if (matchId) {
            router.push(`/live-stream/match/${matchId}`);
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
            {/* Player Avatar - Clickable */}
            <div
                className="relative flex-shrink-0 cursor-pointer"
                onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/user-profile?user=${playerId}`);
                }}
            >
                {/* Gradient Border for Big Boss */}
                {isBigBoss ? (
                    <div
                        className="rounded-full p-[2px]"
                        style={{
                            background: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
                        }}
                    >
                        <div className="size-12 md:size-14 rounded-full overflow-hidden bg-black">
                            <Image
                                src={playerAvatar}
                                alt={playerName}
                                width={56}
                                height={56}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                ) : (
                    <div
                        className="size-12 md:size-14 rounded-full overflow-hidden border-2"
                        style={{ borderColor: getTypeColor() }}
                    >
                        <Image
                            src={playerAvatar}
                            alt={playerName}
                            width={56}
                            height={56}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}
                {isBigBoss && (
                    <div className="absolute -top-1 -right-1">
                        <BigBossIndicator isBigBoss={true} size="sm" />
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <h3
                        className="font-semibold text-sm md:text-base truncate"
                        style={{ color: getTypeColor() }}
                    >
                        {playerName}
                    </h3>
                    {isBigBoss && <BigBossIndicator isBigBoss={true} size="sm" />}
                </div>
                <p className="text-white/80 text-xs md:text-sm leading-relaxed mb-1">
                    {message}
                </p>
                <p className="text-white/50 text-xs">{timestamp}</p>
            </div>
        </button>
    );
}
