"use client";

import { useState } from "react";
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

interface User {
    id: string;
    name: string;
    email: string;
    isPlayer: boolean;
}

interface SelectUserAsPlayerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    users: User[];
    onSelectAsPlayer: (userId: string) => void;
    onSearch?: (query: string) => void;
}

export default function SelectUserAsPlayerDialog({
    open,
    onOpenChange,
    users,
    onSelectAsPlayer,
    onSearch,
}: SelectUserAsPlayerDialogProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState<"all" | "players" | "non-players">("all");

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilter =
            filterType === "all" ||
            (filterType === "players" && user.isPlayer) ||
            (filterType === "non-players" && !user.isPlayer);

        return matchesSearch && matchesFilter;
    });

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        onSearch?.(value);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={cn(
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

                <div className="flex-1 overflow-hidden flex flex-col gap-4 mt-4">
                    {/* Search and Filter */}
                    <div className="space-y-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-white/50" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchQuery}
                                onChange={(e) => handleSearchChange(e.target.value)}
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
                            onValueChange={(value) => setFilterType(value as typeof filterType)}
                            options={[
                                { label: "All Users", value: "all" },
                                { label: "Players Only", value: "players" },
                                { label: "Non-Players", value: "non-players" },
                            ]}
                            placeholder="Filter users"
                        />
                    </div>

                    {/* User List */}
                    <div className="flex-1 overflow-y-auto custom-scroll space-y-2">
                        {filteredUsers.length === 0 ? (
                            <div className="text-center py-8 text-white/50">
                                <p>No users found</p>
                            </div>
                        ) : (
                            filteredUsers.map((user) => (
                                <div
                                    key={user.id}
                                    className={cn(
                                        "flex items-center justify-between gap-3 p-3 md:p-4 rounded-lg",
                                        "bg-white/5 border border-white/10",
                                        "hover:bg-white/10 transition-all"
                                    )}
                                >
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-white truncate">
                                            {user.name}
                                        </h3>
                                        <p className="text-sm text-white/60 truncate">{user.email}</p>
                                    </div>

                                    {user.isPlayer ? (
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#00C3FF]/20 text-[#00C3FF] border border-[#00C3FF]/30">
                                            <Check className="size-4" />
                                            <span className="text-xs md:text-sm font-medium">
                                                Player
                                            </span>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => onSelectAsPlayer(user.id)}
                                            className={cn(
                                                "flex items-center gap-2 px-4 py-2 rounded-lg",
                                                "bg-[#FF2EC8] hover:bg-[#FF2EC8]/90 text-white",
                                                "transition-all font-medium",
                                                "text-xs md:text-sm"
                                            )}
                                        >
                                            <UserPlus className="size-4" />
                                            <span>Make Player</span>
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
