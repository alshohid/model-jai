/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import AppDialog from "@/shared/components/modal/AppDialog";
import {
    useViewSingleUserQuery,
    useUpdateUserMutation,
} from "@/redux/features/user/userManagement";
import { toast } from "sonner";
import Image from "next/image";
import { Upload } from "lucide-react";
import { cn } from "@/shared/lib/utils/cn";
import { getSafeImageSrc } from "@/shared/lib/utils/imagesrcvalidator";

interface Props {
    open: boolean;
    onClose: () => void;
    userId: number | null;
}

export default function EditUserModal({ open, onClose, userId }: Props) {
    const { data } = useViewSingleUserQuery(userId!, { skip: !userId });
    const [updateUser, { isLoading }] = useUpdateUserMutation();

    const user = data?.data;

    const [name, setName] = useState("");
    const [role, setRole] = useState<"user" | "artist">("user");

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState("");

    useEffect(() => {
        if (user) {
            setName(user.name);
            setRole(user.role === "artist" ? "artist" : "user");
            setImagePreview(getSafeImageSrc(user.image));
        }
    }, [user]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleUpdate = async () => {
        if (!userId) return;

        try {
            const formData = new FormData();

            formData.append("name", name);
            formData.append("role", role);

            if (imageFile) {
                formData.append("image", imageFile);
            } else {
                formData.append("image", "");
            }

            const res = await updateUser({
                id: userId,
                body: formData,
            }).unwrap();

            toast.success(res.message || "User updated successfully");
            onClose();
        } catch (err: any) {
            toast.error(err?.data?.message || "Update failed");
        }
    };
    return (
        <AppDialog open={open} onOpenChange={onClose} title="">
            <div className="space-y-6">

                {/* Header */}
                <div className="border-b border-white/10 pb-4">
                    <h3 className="text-lg font-semibold text-white">Edit User</h3>
                    <p className="text-sm text-white/60">
                        Update user information and role
                    </p>
                </div>

                {/* Avatar Upload */}
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Image
                            src={imagePreview || getSafeImageSrc(user?.image) || "/images/home/avatar_1.png"}
                            alt="user"
                            width={64}
                            height={64}
                            className="rounded-full object-cover border border-white/20"
                            onError={(e) => {
                                e.currentTarget.src = "/images/home/avatar_1.png";
                            }}
                            unoptimized
                            crossOrigin="anonymous"
                        />
                    </div>

                    <label className="cursor-pointer flex items-center gap-2 text-sm text-white bg-white/10 px-4 py-2 rounded-lg hover:bg-white/15 transition">
                        <Upload size={16} />
                        Upload Image
                        <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                    </label>
                </div>

                {/* Name */}
                <div className="space-y-2">
                    <label className="text-sm text-white/80">Full Name</label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter full name"
                        className={cn(
                            "w-full rounded-lg bg-white/5 border border-white/10",
                            "px-4 py-3 text-white",
                            "focus:outline-none focus:ring-1 focus:ring-[#FF2EC8]"
                        )}
                    />
                </div>

                {/* Role Select */}
                <div className="space-y-2">
                    <label className="text-sm text-white/80">User Role</label>

                    <select
                        value={role}
                        onChange={(e) =>
                            setRole(e.target.value as "user" | "artist")
                        }
                        className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-gray-300 outline-none focus:ring-1 focus:ring-[#FF2EC8]"
                    >
                        <option value="user">User</option>
                        <option value="artist">Artist</option>
                    </select>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4 border-t border-white/10">
                    <button
                        onClick={onClose}
                        className="flex-1 h-11 bg-white/10 hover:bg-white/15 text-white rounded-lg"
                    >
                        Cancel
                    </button>

                    <button
                        disabled={isLoading}
                        onClick={handleUpdate}
                        className={cn(
                            "flex-1 h-11 rounded-lg text-white bg-[#FF2EC8] hover:bg-[#FF2EC8]/90",
                            isLoading && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        {isLoading ? "Updating..." : "Update User"}
                    </button>
                </div>
            </div>
        </AppDialog>
    );
}