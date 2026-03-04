"use client";

import AppDialog from "@/shared/components/modal/AppDialog";
import Image from "next/image";
import { useViewSingleUserQuery } from "@/redux/features/user/userManagement";
import { getSafeImageSrc } from "@/shared/lib/utils/imagesrcvalidator";

interface Props {
    open: boolean;
    onClose: () => void;
    userId: number | null;
}

export default function ViewUserModal({ open, onClose, userId }: Props) {
    const { data, isLoading } = useViewSingleUserQuery(userId!, {
        skip: !userId,
    });

    const user = data?.data;

    return (
        <AppDialog open={open} onOpenChange={onClose} title="User Details">
            {isLoading ? (
                <div className="text-white text-sm">Loading...</div>
            ) : user ? (
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Image
                            src={getSafeImageSrc(user?.image) ?? "/images/home/avatar_1.png"}
                            alt={user?.name}
                            width={60}
                            height={60}
                            onError={(e) => {
                                e.currentTarget.src = "/images/home/avatar_1.png";
                            }}
                            unoptimized
                            crossOrigin="anonymous"
                            className="rounded-full"
                        />
                        <div>
                            <p className="text-white font-semibold">{user?.name}</p>
                            <p className="text-white/60 text-sm">{user?.email}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-white/60">Phone</div>
                        <div className="text-white">{user?.phone_number}</div>

                        <div className="text-white/60">Nationality</div>
                        <div className="text-white">{user?.nationality}</div>

                        <div className="text-white/60">Role</div>
                        <div className="text-white">{user?.role}</div>

                        <div className="text-white/60">Followers</div>
                        <div className="text-white">{user?.followers_count}</div>

                        <div className="text-white/60">Following</div>
                        <div className="text-white">{user?.following_count}</div>

                        <div className="text-white/60">Total Posts</div>
                        <div className="text-white">{user?.total_post}</div>
                    </div>
                </div>
            ) : null}
        </AppDialog>
    );
}