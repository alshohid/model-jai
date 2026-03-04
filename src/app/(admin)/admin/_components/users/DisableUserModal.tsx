/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import AppDialog from "@/shared/components/modal/AppDialog";
import Image from "next/image";
import { cn } from "@/shared/lib/utils/cn";
import { CheckCircle2 } from "lucide-react";
import { useUnSuspendUserMutation } from "@/redux/features/user/userManagement";
import { toast } from "sonner";

interface DisableUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    userName?: string;
    userId?: number;
    userImage?: string;
    status?: string;
}

export default function DisableUserModal({
    isOpen,
    onClose,
    userName = "Cameron Williamson",
    userId = 8832,
    userImage = "/images/home/user.png",

}: DisableUserModalProps) {
    const [notifyUser, setNotifyUser] = useState(false);
    const [unSuspendUser, { isLoading: isUnSuspendUserLoading }] = useUnSuspendUserMutation()


    const handleConfirm = async () => {
        if (!userId) return;

        try {
            const res = await unSuspendUser({
                id: userId,
                notify_email: notifyUser,
            }).unwrap();

            toast.success(res.message || "User re-enabled successfully");

            onClose();
            setNotifyUser(false);

        } catch (error: any) {
            toast.error(
                error?.data?.message ||
                error?.message ||
                "Failed to re-enable user"
            );
        }
    };


    return (
        <AppDialog open={isOpen} onOpenChange={onClose} title="">
            <div className="space-y-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-[#FF2EC8]/20 flex items-center justify-center">
                            <CheckCircle2 className="size-5 text-[#FF2EC8]" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white">
                                Re-Enable User
                            </h3>

                            <p className="text-sm text-white/60">
                                This will restore full access to the platform.
                            </p>
                        </div>
                    </div>
                </div>

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
                        disabled={isUnSuspendUserLoading}
                        className={cn(
                            "flex-1 h-11 px-6 py-3 rounded-lg text-sm font-medium",
                            "bg-[#FF2EC8] hover:bg-[#FF2EC8]/90 text-white",
                            "transition-all flex items-center justify-center gap-2",
                            isUnSuspendUserLoading && "opacity-60 cursor-not-allowed"
                        )}
                    >
                        {isUnSuspendUserLoading ? (
                            "Processing..."
                        ) : (
                            <>
                                <CheckCircle2 className="size-4" />
                                Confirm Re-Enable
                            </>
                        )}
                    </button>
                </div>
            </div>
        </AppDialog>
    );
}
