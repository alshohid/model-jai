/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import AppDialog from "@/shared/components/modal/AppDialog";
import AppSelect, { AppSelectOption } from "../reusable/AppSelect";
import Image from "next/image";
import { cn } from "@/shared/lib/utils/cn";
import { Ban, CheckCircle2 } from "lucide-react";
import { useSuspendUserMutation } from "@/redux/features/user/userManagement";
import { toast } from "sonner";

interface SuspendUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    userName?: string;
    userId: number;
    userImage?: string;
    status?: string;
}

export default function SuspendUserModal({
    isOpen,
    onClose,
    userName = "Cameron Williamson",
    userId,
    userImage = "/images/home/user.png",

}: SuspendUserModalProps) {
    const [suspensionDuration, setSuspensionDuration] = useState("7");
    const [reasonCategory, setReasonCategory] = useState("Violation of Terms");
    const [additionalNote, setAdditionalNote] = useState("");
    const [notifyUser, setNotifyUser] = useState(false);
    const [suspendUser, { isLoading: isUserSuspendLoading }] = useSuspendUserMutation()

    const durationOptions: AppSelectOption[] = [
        { value: "1", label: "1 day" },
        { value: "3", label: "3 days" },
        { value: "7", label: "7 days" },
        { value: "14", label: "14 days" },
        { value: "30", label: "30 days" },
        { value: "permanent", label: "Permanent" },
    ];

    const reasonOptions: AppSelectOption[] = [
        { value: "Violation of Terms", label: "Violation of Terms" },
        { value: "Fraudulent Activity", label: "Fraudulent Activity" },
        { value: "Inappropriate Behavior", label: "Inappropriate Behavior" },
        { value: "Security Breach", label: "Security Breach" },
        { value: "Other", label: "Other" },
    ];

    const handleConfirm = async () => {
        if (!userId) return;

        try {
            const res = await suspendUser({
                id: Number(userId),
                duration: suspensionDuration,
                reason_category: reasonCategory,
                note: additionalNote,
                notify_email: notifyUser,
            }).unwrap();
            toast.success(res?.message || "User suspended successfully");
            onClose();
            setSuspensionDuration("7");
            setReasonCategory("Violation of Terms");
            setAdditionalNote("");
            setNotifyUser(false);
        } catch (error: any) {
            toast.error(
                error?.data?.message ||
                error?.message ||
                "Something went wrong"
            );
        }
    };
    const maxChars = 200;
    const charCount = additionalNote.length;

    return (
        <AppDialog open={isOpen} onOpenChange={onClose} title="">
            <div className="space-y-6">
                {/* Header */}
                <div className="w-full border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#FF2EC8]/20 flex items-center justify-center">
                            <Ban className="size-5 text-[#FF2EC8]" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white">Suspend User</h3>
                            <p className="text-sm text-white/60">
                                This action will restrict the user&apos;s access.
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
                                unoptimized
                                crossOrigin="anonymous"
                                className="rounded-full size-12 object-cover border-2 border-white/20"
                            />

                        </div>
                        <div>
                            <p className="font-medium text-white">{userName}</p>
                            <div className="flex items-center gap-2 text-xs text-white/60">
                                <span>{userId}</span>

                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-5">
                    {/* Suspension Duration */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">
                            Suspension Duration <span className="text-[#FF2EC8]">*</span>
                        </label>
                        <AppSelect
                            value={suspensionDuration}
                            onValueChange={setSuspensionDuration}
                            options={durationOptions}
                            placeholder="Select duration"
                        />
                    </div>

                    {/* Reason Category */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">
                            Reason Category <span className="text-[#FF2EC8]">*</span>
                        </label>
                        <AppSelect
                            value={reasonCategory}
                            onValueChange={setReasonCategory}
                            options={reasonOptions}
                            placeholder="Select reason"
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
                            An automated email will be sent explaining the suspension.
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
                        disabled={isUserSuspendLoading}
                        onClick={handleConfirm}
                        className={cn(
                            "flex-1 h-11 px-6 py-3 rounded-lg text-sm font-medium",
                            "bg-[#FF2EC8] hover:bg-[#FF2EC8]/90 text-white",
                            "transition-all flex items-center justify-center gap-2",
                            isUserSuspendLoading && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        <CheckCircle2 className="size-4" />
                        {isUserSuspendLoading ? "Suspending..." : "Confirm Suspension"}
                    </button>
                </div>
            </div>
        </AppDialog>
    );
}
