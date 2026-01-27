"use client";

import { useState } from "react";
import { Search, UserPlus, UserCheck, Star } from "lucide-react";
import Image from "next/image";
import { cn } from "@/shared/lib/utils/cn";
import GlassInput from "@/shared/UI/reusable/auth/GlassInput";

interface User {
    id: string;
    name: string;
    username: string;
    avatar: string;
    isBigBoss?: boolean;
    isSubscribed?: boolean;
}

interface UserSearchAndSubscribeProps {
    onUserClick?: (user: User) => void;
    onSubscribe?: (userId: string) => void;
    className?: string;
}

export default function UserSearchAndSubscribe({
    onUserClick,
    onSubscribe,
    className,
}: UserSearchAndSubscribeProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [users, setUsers] = useState<User[]>([
        {
            id: "1",
            name: "Jack",
            username: "@jack",
            avatar: "/images/home/user.png",
            isBigBoss: true,
            isSubscribed: false,
        },
        {
            id: "2",
            name: "Steve",
            username: "@steve",
            avatar: "/images/home/user.png",
            isBigBoss: false,
            isSubscribed: true,
        },
    ]);

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSubscribe = (userId: string) => {
        setUsers((prev) =>
            prev.map((user) =>
                user.id === userId ? { ...user, isSubscribed: !user.isSubscribed } : user
            )
        );
        onSubscribe?.(userId);
    };

    return (
        <div className={cn("w-full", className)}>
            {/* Search Input */}
            <div className="mb-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-white/50" />
                    <input
                        type="text"
                        placeholder="Search for users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={cn(
                            "w-full h-[48px] md:h-[52px] rounded-[12px]",
                            "bg-white/5 border border-white/12 backdrop-blur-lg",
                            "text-white placeholder:text-white/30",
                            "pl-10 pr-4 outline-none",
                            "focus:ring-2 focus:ring-[#00C3FF]/50 focus:border-[#00C3FF]/50",
                            "transition-all"
                        )}
                    />
                </div>
            </div>

            {/* User List */}
            <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scroll">
                {filteredUsers.length === 0 ? (
                    <div className="text-center py-8 text-white/50">
                        <p>No users found</p>
                    </div>
                ) : (
                    filteredUsers.map((user) => (
                        <div
                            key={user.id}
                            className={cn(
                                "flex items-center gap-3 p-3 rounded-lg",
                                "bg-white/5 border border-white/10",
                                "hover:bg-white/10 transition-all cursor-pointer",
                                "group"
                            )}
                            onClick={() => onUserClick?.(user)}
                        >
                            {/* Avatar with Gradient Border for Big Boss */}
                            <div
                                className="relative cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onUserClick?.(user);
                                }}
                            >
                                {user.isBigBoss ? (
                                    <div
                                        className="rounded-full p-[2px]"
                                        style={{
                                            background: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
                                        }}
                                    >
                                        <div className="rounded-full bg-black">
                                            <Image
                                                src={user.avatar}
                                                alt={user.name}
                                                width={48}
                                                height={48}
                                                className="rounded-full size-12 object-cover"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <Image
                                        src={user.avatar}
                                        alt={user.name}
                                        width={48}
                                        height={48}
                                        className="rounded-full size-12 object-cover border-2 border-white/20"
                                    />
                                )}
                                {user.isBigBoss && (
                                    <div className="absolute -top-1 -right-1 bg-[#FF2EC8] rounded-full p-1">
                                        <Star className="size-3 text-white fill-white" />
                                    </div>
                                )}
                            </div>

                            {/* User Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-white truncate">
                                        {user.name}
                                    </h3>
                                    {user.isBigBoss && (
                                        <Star className="size-4 text-[#FF2EC8] fill-[#FF2EC8]" />
                                    )}
                                </div>
                                <p className="text-sm text-white/60 truncate">{user.username}</p>
                            </div>

                            {/* Subscribe Button */}
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleSubscribe(user.id);
                                }}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-lg",
                                    "transition-all",
                                    user.isSubscribed
                                        ? "bg-[#00C3FF]/20 text-[#00C3FF] border border-[#00C3FF]/30"
                                        : "bg-[#FF2EC8] text-white hover:bg-[#FF2EC8]/90"
                                )}
                            >
                                {user.isSubscribed ? (
                                    <>
                                        <UserCheck className="size-4" />
                                        <span className="text-xs md:text-sm font-medium">
                                            Subscribed
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="size-4" />
                                        <span className="text-xs md:text-sm font-medium">
                                            Subscribe
                                        </span>
                                    </>
                                )}
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
