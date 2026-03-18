/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import AppDialog from "@/shared/components/modal/AppDialog";
import { useCreateUserMutation } from "@/redux/features/user/userManagement";
import { toast } from "sonner";
import { cn } from "@/shared/lib/utils/cn";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateUserModal({ isOpen, onClose }: Props) {
    const [createUser, { isLoading }] = useCreateUserMutation();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<"user" | "artist">("user");

    const resetForm = () => {
        setName("");
        setEmail("");
        setPassword("");
        setRole("user");
    };

    const handleCreate = async () => {
        if (!name || !email || !password) {
            toast.error("Please fill all fields");
            return;
        }

        try {
            const res = await createUser({
                name,
                email,
                password,
                role,
            }).unwrap();

            toast.success(res?.message || "User created successfully");

            resetForm();
            onClose();
        } catch (err: any) {
            toast.error(err?.data?.message || "User creation failed");
        }
    };

    return (
        <AppDialog open={isOpen} onOpenChange={onClose} title="">
            <div className="space-y-6">

                {/* Header */}
                <div className="border-b border-white/10 pb-4">
                    <h3 className="text-lg font-semibold text-white">Create User</h3>
                    <p className="text-sm text-white/60">
                        Add a new user to the platform
                    </p>
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

                {/* Email */}
                <div className="space-y-2">
                    <label className="text-sm text-white/80">Email</label>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="Enter email"
                        className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:ring-1 focus:ring-[#FF2EC8]"
                    />
                </div>

                {/* Password */}
                <div className="space-y-2">
                    <label className="text-sm text-white/80">Password</label>
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        placeholder="Enter password"
                        className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:ring-1 focus:ring-[#FF2EC8]"
                    />
                </div>

                {/* Role */}
                <div className="space-y-2">
                    <label className="text-sm text-white/80">Role</label>

                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value as "user" | "artist")}
                        className="w-full rounded-lg bg-black/20 border border-white/10 px-4 py-3 text-white outline-none focus:ring-1 focus:ring-[#FF2EC8]"
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
                        onClick={handleCreate}
                        className={cn(
                            "flex-1 h-11 rounded-lg text-white bg-[#FF2EC8] hover:bg-[#FF2EC8]/90",
                            isLoading && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        {isLoading ? "Creating..." : "Create User"}
                    </button>
                </div>
            </div>
        </AppDialog>
    );
}