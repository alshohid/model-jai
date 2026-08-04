"use client";

import { Search, UserPlus, Check } from "lucide-react";
import { cn } from "@/shared/lib/utils/cn";
import AppDialog from "@/shared/components/modal/AppDialog";
import AppSelect from "../reusable/AppSelect";
import Image from "next/image";
import { getSafeImageSrc } from "@/shared/lib/utils/imagesrcvalidator";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    image?: string | null;
}

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    users: User[];
    isLoading: boolean;

    keyword: string;
    setKeyword: (v: string) => void;

    filterType: "all" | "players" | "non-players";
    setFilterType: (v: "all" | "players" | "non-players") => void;

    onSelectAsPlayer: (userId: string) => void;
}

export default function SelectUserAsPlayerDialog({
    open,
    onOpenChange,
    users,
    isLoading,
    keyword,
    setKeyword,
    filterType,
    setFilterType,
    onSelectAsPlayer,
}: Props) {
    return (
        <AppDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Select User as Player"
            className="max-w-[640px]"
            bodyClassName="flex min-h-0 flex-col"
        >
            <p className="mb-4 text-sm text-white/70">
                Search for users and assign them as players
            </p>

            <div className="flex min-h-0 flex-1 flex-col gap-4">
                <div className="space-y-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-white/50" />

                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            className={cn(
                                "h-11 w-full rounded-lg",
                                "border border-white/10 bg-white/5",
                                "pl-10 pr-4 text-sm text-white placeholder:text-white/25",
                                "outline-none transition-all duration-200",
                                "focus:border-[#FF2EC8]/60 focus:bg-[#FF2EC8]/5",
                            )}
                        />
                    </div>

                    <AppSelect
                        value={filterType}
                        onValueChange={(v) => setFilterType(v as typeof filterType)}
                        options={[
                            { label: "All Users", value: "all" },
                            { label: "Players Only", value: "players" },
                            { label: "Non-Players", value: "non-players" },
                        ]}
                        placeholder="Filter users"
                    />
                </div>

                <div className="custom-scroll max-h-[45vh] min-h-0 flex-1 space-y-2 overflow-y-auto">
                    {isLoading ? (
                        <div className="py-10 text-center text-white/50">
                            Loading users...
                        </div>
                    ) : users.length === 0 ? (
                        <div className="py-10 text-center text-white/50">
                            No users found
                        </div>
                    ) : (
                        users.map((user) => (
                            <div
                                key={user.id}
                                className={cn(
                                    "flex items-center justify-between gap-3 rounded-lg p-4",
                                    "border border-white/10 bg-white/5",
                                    "transition-all hover:bg-white/10",
                                )}
                            >
                                <div className="flex min-w-0 items-center gap-3">
                                    <Image
                                        src={
                                            getSafeImageSrc(user.image) ??
                                            "/images/home/avatar_1.png"
                                        }
                                        alt={user.name}
                                        width={40}
                                        height={40}
                                        className="size-10 shrink-0 rounded-full object-cover"
                                        unoptimized
                                    />

                                    <div className="min-w-0">
                                        <p className="truncate font-medium text-white">
                                            {user.name}
                                        </p>
                                        <p className="truncate text-xs text-white/60">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>

                                {user.role === "artist" ? (
                                    <div className="flex shrink-0 items-center gap-2 rounded-lg border border-[#00C3FF]/30 bg-[#00C3FF]/20 px-3 py-1.5 text-[#00C3FF]">
                                        <Check className="size-4" />
                                        <span className="text-xs font-medium">Player</span>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => onSelectAsPlayer(user.id)}
                                        className={cn(
                                            "flex shrink-0 items-center gap-2 rounded-lg px-4 py-2",
                                            "bg-[#FF2EC8] text-sm font-medium text-white",
                                            "transition-all hover:bg-[#FF2EC8]/90",
                                        )}
                                    >
                                        <UserPlus className="size-4" />
                                        Make Player
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </AppDialog>
    );
}
