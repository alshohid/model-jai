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

    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [artistName, setArtistName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [address, setAddress] = useState("");
    const [role, setRole] = useState<"user" | "artist">("user");

    const resetForm = () => {
        setFirstName("");
        setMiddleName("");
        setLastName("");
        setArtistName("");
        setEmail("");
        setPassword("");
        setCity("");
        setState("");
        setZipCode("");
        setAddress("");
        setRole("user");
    };

    const normalizeOptionalText = (value: string) => {
        const trimmedValue = value.trim();
        return trimmedValue ? trimmedValue : null;
    };

    const handleCreate = async () => {
        if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
            toast.error("Please fill all fields");
            return;
        }

        const fullName = [firstName, middleName, lastName]
            .map((part) => part.trim())
            .filter(Boolean)
            .join(" ");

        try {
            const res = await createUser({
                first_name: firstName.trim(),
                middle_name: normalizeOptionalText(middleName),
                last_name: lastName.trim(),
                artist_name: normalizeOptionalText(artistName),
                name: fullName,
                email: email.trim(),
                password,
                city: normalizeOptionalText(city),
                state: normalizeOptionalText(state),
                zip_code: normalizeOptionalText(zipCode),
                address: normalizeOptionalText(address),
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

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-sm text-white/80">First Name</label>
                        <input
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Enter first name"
                            className={cn(
                                "w-full rounded-lg bg-white/5 border border-white/10",
                                "px-4 py-3 text-white",
                                "focus:outline-none focus:ring-1 focus:ring-[#FF2EC8]"
                            )}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-white/80">Middle Name</label>
                        <input
                            value={middleName}
                            onChange={(e) => setMiddleName(e.target.value)}
                            placeholder="Enter middle name"
                            className={cn(
                                "w-full rounded-lg bg-white/5 border border-white/10",
                                "px-4 py-3 text-white",
                                "focus:outline-none focus:ring-1 focus:ring-[#FF2EC8]"
                            )}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-white/80">Last Name</label>
                    <input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Enter last name"
                        className={cn(
                            "w-full rounded-lg bg-white/5 border border-white/10",
                            "px-4 py-3 text-white",
                            "focus:outline-none focus:ring-1 focus:ring-[#FF2EC8]"
                        )}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-white/80">Artist Name (optional)</label>
                    <input
                        value={artistName}
                        onChange={(e) => setArtistName(e.target.value)}
                        placeholder="Enter artist name"
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

                <div className="space-y-2">
                    <label className="text-sm text-white/80">Address (optional)</label>
                    <input
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter address"
                        className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:ring-1 focus:ring-[#FF2EC8]"
                    />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-sm text-white/80">City (optional)</label>
                        <input
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="Enter city"
                            className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:ring-1 focus:ring-[#FF2EC8]"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-white/80">State (optional)</label>
                        <input
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            placeholder="Enter state"
                            className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:ring-1 focus:ring-[#FF2EC8]"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-white/80">Zip Code (optional)</label>
                    <input
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        placeholder="Enter zip code"
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
