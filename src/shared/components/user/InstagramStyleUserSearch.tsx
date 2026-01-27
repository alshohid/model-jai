"use client";

import { useState } from "react";
import { Search, X, Clock, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/shared/lib/utils/cn";
import BigBossIndicator from "./BigBossIndicator";

interface User {
    id: string;
    name: string;
    username: string;
    avatar: string;
    isBigBoss?: boolean;
    isVerified?: boolean;
    activityStatus?: string; // e.g., "26 new posts", "Live now"
    isSubscribed?: boolean;
}

interface InstagramStyleUserSearchProps {
    onUserClick?: (user: User) => void;
    onSubscribe?: (userId: string) => void;
    className?: string;
}

export default function InstagramStyleUserSearch({
    onUserClick,
    onSubscribe,
    className,
}: InstagramStyleUserSearchProps) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [recentSearches, setRecentSearches] = useState<string[]>([
        "kai cenat",
        "janmsotba",
        "breezy jhonn colection",
    ]);

    const [users, setUsers] = useState<User[]>([
        {
            id: "1",
            name: "Jeffson Jrcelestin",
            username: "jeffsonjrcelestin",
            avatar: "/images/home/user.png",
            isBigBoss: true,
            isVerified: true,
            activityStatus: "Janmsotba • 26 new posts •",
            isSubscribed: false,
        },
        {
            id: "2",
            name: "Trophy Boy",
            username: "trophy.bwoy",
            avatar: "/images/home/user.png",
            isBigBoss: false,
            isVerified: false,
            activityStatus: "VINCENT 🏂",
            isSubscribed: true,
        },
        {
            id: "3",
            name: "Jack",
            username: "@jack",
            avatar: "/images/home/user.png",
            isBigBoss: true,
            isVerified: true,
            activityStatus: "Live now",
            isSubscribed: false,
        },
    ]);

    const filteredUsers = searchQuery
        ? users.filter(
              (user) =>
                  user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  user.username.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : [];

    const handleUserClick = (user: User) => {
        // Navigate to artist profile page
        router.push(`/artist/${user.id}`);
        onUserClick?.(user);
    };

    const handleRemoveRecent = (search: string) => {
        setRecentSearches((prev) => prev.filter((s) => s !== search));
    };

    // Gradient border for profile pictures
    const GradientBorder = ({ children, isBigBoss }: { children: React.ReactNode; isBigBoss?: boolean }) => {
        if (!isBigBoss) return <>{children}</>;
        return (
            <div
                className="rounded-full p-[2px]"
                style={{
                    background: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
                }}
            >
                {children}
            </div>
        );
    };

    return (
        <div className={cn("w-full bg-black min-h-screen", className)}>
            {/* Search Bar */}
            <div className="sticky top-0 bg-black/95 backdrop-blur-lg z-10 border-b border-white/10 px-4 py-3">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="text-white hover:text-white/80 transition"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-white/50" />
                        <input
                            type="text"
                            placeholder="Search artist name or something.."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={cn(
                                "w-full h-[40px] rounded-lg",
                                "bg-white/10 border border-white/20",
                                "text-white placeholder:text-white/40",
                                "pl-10 pr-4 outline-none",
                                "focus:bg-white/15 focus:border-white/30",
                                "transition-all text-sm"
                            )}
                        />
                    </div>
                </div>
            </div>

            <div className="px-4 py-4">
                {/* Recent Searches */}
                {!searchQuery && recentSearches.length > 0 && (
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-white font-semibold text-base">Recent</h3>
                            <button
                                type="button"
                                className="text-[#00C3FF] text-sm font-medium hover:text-[#00C3FF]/80"
                            >
                                See all
                            </button>
                        </div>
                        <div className="space-y-2">
                            {recentSearches.map((search, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg transition"
                                >
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="size-10 rounded-full bg-white/10 flex items-center justify-center">
                                            <Clock className="size-5 text-white/50" />
                                        </div>
                                        <span className="text-white text-sm">{search}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveRecent(search)}
                                        className="text-white/40 hover:text-white/60"
                                    >
                                        <X className="size-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Search Results / User List */}
                {searchQuery ? (
                    <div className="space-y-1">
                        {filteredUsers.length === 0 ? (
                            <div className="text-center py-12 text-white/50">
                                <p className="text-sm">No results found</p>
                            </div>
                        ) : (
                            filteredUsers.map((user) => (
                                <div
                                    key={user.id}
                                    className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition cursor-pointer"
                                    onClick={() => handleUserClick(user)}
                                >
                                    {/* Avatar with Gradient Border */}
                                    <GradientBorder isBigBoss={user.isBigBoss}>
                                        <div className="relative">
                                            <Image
                                                src={user.avatar}
                                                alt={user.name}
                                                width={56}
                                                height={56}
                                                className="rounded-full size-14 object-cover bg-white/10"
                                            />
                                        </div>
                                    </GradientBorder>

                                    {/* User Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5 mb-0.5">
                                            <h3 className="text-white font-medium text-sm truncate">
                                                {user.username}
                                            </h3>
                                            {user.isVerified && (
                                                <CheckCircle2 className="size-4 text-[#00C3FF] flex-shrink-0" />
                                            )}
                                            {user.isBigBoss && (
                                                <BigBossIndicator isBigBoss={true} size="sm" />
                                            )}
                                        </div>
                                        {user.activityStatus && (
                                            <p className="text-white/60 text-xs truncate">
                                                {user.activityStatus}
                                            </p>
                                        )}
                                    </div>

                                    {/* Notification Bell */}
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onSubscribe?.(user.id);
                                        }}
                                        className={cn(
                                            "size-8 rounded-full flex items-center justify-center",
                                            "transition-all",
                                            user.isSubscribed
                                                ? "bg-[#FF2EC8]/20 text-[#FF2EC8]"
                                                : "bg-white/10 text-white/60 hover:bg-white/15"
                                        )}
                                    >
                                        <svg
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill={user.isSubscribed ? "currentColor" : "none"}
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                                        </svg>
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    /* Suggested Users */
                    <div className="space-y-1">
                        {users.map((user) => (
                            <div
                                key={user.id}
                                className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition cursor-pointer"
                                onClick={() => handleUserClick(user)}
                            >
                                <GradientBorder isBigBoss={user.isBigBoss}>
                                    <div className="relative">
                                        <Image
                                            src={user.avatar}
                                            alt={user.name}
                                            width={56}
                                            height={56}
                                            className="rounded-full size-14 object-cover bg-white/10"
                                        />
                                    </div>
                                </GradientBorder>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5 mb-0.5">
                                        <h3 className="text-white font-medium text-sm truncate">
                                            {user.username}
                                        </h3>
                                        {user.isVerified && (
                                            <CheckCircle2 className="size-4 text-[#00C3FF] flex-shrink-0" />
                                        )}
                                        {user.isBigBoss && (
                                            <BigBossIndicator isBigBoss={true} size="sm" />
                                        )}
                                    </div>
                                    {user.activityStatus && (
                                        <p className="text-white/60 text-xs truncate">
                                            {user.activityStatus}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onSubscribe?.(user.id);
                                    }}
                                    className={cn(
                                        "size-8 rounded-full flex items-center justify-center",
                                        "transition-all",
                                        user.isSubscribed
                                            ? "bg-[#FF2EC8]/20 text-[#FF2EC8]"
                                            : "bg-white/10 text-white/60 hover:bg-white/15"
                                    )}
                                >
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill={user.isSubscribed ? "currentColor" : "none"}
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
