"use client";

import { Search, UserPlus, Check } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/shared/lib/utils/cn";
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
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                data-lenis-prevent
                data-lenis-prevent-wheel
                overlayClassName="z-[200]"
                className={cn(
                    "z-[200",
                    "max-w-[90vw] sm:max-w-2xl",
                    "bg-[#0F0F0F] border-white/10",
                    "text-white max-h-[80vh] flex flex-col"
                )}
            >
                <DialogHeader>
                    <DialogTitle className="text-xl md:text-2xl font-bold text-white">
                        Select User as Player
                    </DialogTitle>
                    <DialogDescription className="text-white/70 text-sm">
                        Search for users and assign them as players
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 mt-4 flex-1">
                    {/* Search */}
                    <div className="space-y-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-white/50" />

                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                className={cn(
                                    "w-full h-[48px] rounded-lg",
                                    "bg-white/5 border border-white/12",
                                    "text-white placeholder:text-white/30",
                                    "pl-10 pr-4 outline-none",
                                    "focus:ring-2 focus:ring-[#00C3FF]/50"
                                )}
                            />
                        </div>

                        <AppSelect
                            value={filterType}
                            onValueChange={(v) => setFilterType(v as typeof filterType)}
                            options={[
                                { label: "All Users", value: "" },
                                { label: "Players Only", value: "players" },
                                { label: "Non-Players", value: "non-players" },
                            ]}
                            placeholder="Filter users"
                        />
                    </div>

                    {/* User List */}
                    <div className="flex-1 overflow-y-auto space-y-2 custom-scroll">
                        {isLoading ? (
                            <div className="text-center py-10 text-white/50">
                                Loading users...
                            </div>
                        ) : users.length === 0 ? (
                            <div className="text-center py-10 text-white/50">
                                No users found
                            </div>
                        ) : (
                            users.map((user) => (
                                <div
                                    key={user.id}
                                    className={cn(
                                        "flex items-center justify-between gap-3 p-4 rounded-lg",
                                        "bg-white/5 border border-white/10",
                                        "hover:bg-white/10 transition-all"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <Image
                                            src={
                                                getSafeImageSrc(user.image) ??
                                                "/images/home/avatar_1.png"
                                            }
                                            alt={user.name}
                                            width={40}
                                            height={40}
                                            className="rounded-full object-cover"
                                            unoptimized
                                        />

                                        <div>
                                            <p className="font-medium text-white">{user.name}</p>
                                            <p className="text-xs text-white/60">{user.email}</p>
                                        </div>
                                    </div>

                                    {user.role === "artist" ? (
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#00C3FF]/20 text-[#00C3FF] border border-[#00C3FF]/30">
                                            <Check className="size-4" />
                                            <span className="text-xs font-medium">Player</span>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => onSelectAsPlayer(user.id)}
                                            className={cn(
                                                "flex items-center gap-2 px-4 py-2 rounded-lg",
                                                "bg-[#FF2EC8] hover:bg-[#FF2EC8]/90 text-white",
                                                "transition-all text-sm font-medium"
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
            </DialogContent>
        </Dialog>
    );
}
