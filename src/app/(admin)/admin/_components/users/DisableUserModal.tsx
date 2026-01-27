"use client";

import { useState } from "react";
import AppDialog from "@/shared/components/modal/AppDialog";
import AppSelect, { AppSelectOption } from "../reusable/AppSelect";
import Image from "next/image";
import { cn } from "@/shared/lib/utils/cn";
import { UserX, CheckCircle2 } from "lucide-react";

interface DisableUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    userName?: string;
    userId?: string;
    userImage?: string;
    isActive?: boolean;
}

export default function DisableUserModal({
    isOpen,
    onClose,
    userName = "Cameron Williamson",
    userId = "#8832",
    userImage = "/images/home/user.png",
    isActive = true,
}: DisableUserModalProps) {
    const [duration, setDuration] = useState("7 days");
    const [additionalNote, setAdditionalNote] = useState("");
    const [notifyUser, setNotifyUser] = useState(false);

    const durationOptions: AppSelectOption[] = [
        { value: "1 day", label: "1 day" },
        { value: "3 days", label: "3 days" },
        { value: "7 days", label: "7 days" },
        { value: "14 days", label: "14 days" },
        { value: "30 days", label: "30 days" },
        { value: "Permanent", label: "Permanent" },
    ];

    const handleConfirm = () => {
        console.log("Disabling user:", {
            userName,
            userId,
            duration,
            additionalNote,
            notifyUser,
        });
        onClose();
        // Reset form
        setDuration("7 days");
        setAdditionalNote("");
        setNotifyUser(false);
    };

    const maxChars = 200;
    const charCount = additionalNote.length;

    return (
        <AppDialog open={isOpen} onOpenChange={onClose} title="">
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-[#FF2EC8]/20 flex items-center justify-center">
                            <UserX className="size-5 text-[#FF2EC8]" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white">Disable User</h3>
                            <p className="text-sm text-white/60">
                                This will permanently restrict access until manually re-enabled.
                            </p>
                        </div>
                    </div>
                </div>

                {/* User Info Card */}
                <div className="rounded-lg bg-white/5 border border-white/10 p-4">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Image
                                src={userImage}
                                alt={userName}
                                width={48}
                                height={48}
                                className="rounded-full size-12 object-cover border-2 border-white/20"
                            />
                            {isActive && (
                                <div className="absolute -bottom-0.5 -right-0.5 size-4 bg-[#00C3FF] rounded-full border-2 border-black" />
                            )}
                        </div>
                        <div>
                            <p className="font-medium text-white">{userName}</p>
                            <div className="flex items-center gap-2 text-xs text-white/60">
                                <span>{userId}</span>
                                <span>•</span>
                                <span className={isActive ? "text-[#00C3FF]" : ""}>
                                    Currently Active
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-5">
                    {/* Duration */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">
                            Duration <span className="text-[#FF2EC8]">*</span>
                        </label>
                        <AppSelect
                            value={duration}
                            onValueChange={setDuration}
                            options={durationOptions}
                            placeholder="Select duration"
                        />
                    </div>

                    {/* Additional Note */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">
                            Additional Note
                        </label>
                        <div className="relative">
                            <textarea
                                value={additionalNote}
                                onChange={(e) => {
                                    if (e.target.value.length <= maxChars) {
                                        setAdditionalNote(e.target.value);
                                    }
                                }}
                                placeholder="e.g. Violation of terms regarding fair play in room #402..."
                                rows={4}
                                className={cn(
                                    "w-full rounded-lg bg-white/5 border border-white/10",
                                    "text-white placeholder:text-white/30",
                                    "px-4 py-3 outline-none resize-none",
                                    "focus:ring-2 focus:ring-[#FF2EC8]/50 focus:border-[#FF2EC8]/50",
                                    "pr-20"
                                )}
                            />
                            <div className="absolute bottom-3 right-3 text-xs text-white/40">
                                {charCount}/{maxChars} characters
                            </div>
                        </div>
                    </div>

                    {/* Notify User Checkbox */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={notifyUser}
                                onChange={(e) => setNotifyUser(e.target.checked)}
                                className="size-4 rounded border-white/20 bg-white/5 text-[#FF2EC8] focus:ring-[#FF2EC8] focus:ring-2"
                            />
                            <span className="text-sm text-white/80">Notify user via email</span>
                        </label>
                        <p className="text-xs text-white/50 ml-6">
                            An automated email will be sent explaining the disable action.
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-white/10">
                    <button
                        onClick={onClose}
                        className={cn(
                            "flex-1 h-11 px-6 py-3 rounded-lg text-sm font-medium",
                            "bg-white/10 hover:bg-white/15 border border-white/20 text-white",
                            "transition-all"
                        )}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        className={cn(
                            "flex-1 h-11 px-6 py-3 rounded-lg text-sm font-medium",
                            "bg-[#FF2EC8] hover:bg-[#FF2EC8]/90 text-white",
                            "transition-all flex items-center justify-center gap-2"
                        )}
                    >
                        <CheckCircle2 className="size-4" />
                        Confirm Disable
                    </button>
                </div>
            </div>
        </AppDialog>
    );
}
