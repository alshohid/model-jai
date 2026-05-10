/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import AppDialog from "@/shared/components/modal/AppDialog";
import {
    useViewSingleUserQuery,
    useUpdateUserMutation,
} from "@/redux/features/user/userManagement";
import { useGetAllGamesQuery } from "@/redux/features/game/gameListManagement";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { cn } from "@/shared/lib/utils/cn";
import { getSafeImageSrc } from "@/shared/lib/utils/imagesrcvalidator";
import { User } from "@/types/user/usermanagement";
import { IGame } from "@/types/game/gameList/gameListTypes";

interface Props {
    open: boolean;
    onClose: () => void;
    userId: number | null;
}

export default function EditUserModal({ open, onClose, userId }: Props) {
    const { data } = useViewSingleUserQuery(userId!, { skip: !userId });
    const { data: gamesResponse } = useGetAllGamesQuery();
    const [updateUser, { isLoading }] = useUpdateUserMutation();
    const avatarFallback = "/images/home/avatar_1.png";

    const user: User | undefined = data?.data;
    const games: IGame[] = gamesResponse?.data ?? [];

    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [artistName, setArtistName] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [role, setRole] = useState<"user" | "artist">("user");
    const [gameId, setGameId] = useState("");
    const [socialVerificationStatus, setSocialVerificationStatus] = useState(false);

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState("");

    useEffect(() => {
        if (user) {
            setFirstName(user.first_name ?? "");
            setMiddleName(user.middle_name ?? "");
            setLastName(user.last_name ?? "");
            setArtistName(user.artist_name ?? "");
            setAddress(user.address ?? "");
            setCity(user.city ?? "");
            setState(user.state ?? "");
            setZipCode(user.zip_code ?? "");
            setRole(user.role === "artist" ? "artist" : "user");
            setGameId(
                user.game_id != null
                    ? String(user.game_id)
                    : user.game?.id != null
                        ? String(user.game.id)
                        : ""
            );
            setSocialVerificationStatus(Boolean(user.social_verification_status));
            setImagePreview(getSafeImageSrc(user.image, avatarFallback));
            setImageFile(null);
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

            formData.append("first_name", firstName);
            formData.append("middle_name", middleName);
            formData.append("last_name", lastName);
            formData.append("artist_name", artistName);
            formData.append("address", address.trim());
            formData.append("city", city.trim());
            formData.append("state", state.trim());
            formData.append("zip_code", zipCode.trim());
            formData.append("role", role);
            formData.append("game_id", gameId);
            formData.append(
                "social_verification_status",
                String(socialVerificationStatus)
            );

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
                        <img
                            src={imagePreview || getSafeImageSrc(user?.image, avatarFallback)}
                            alt="user"
                            className="rounded-full object-cover border border-white/20 w-16 h-16"
                            onError={(e) => {
                                e.currentTarget.src = avatarFallback;
                            }}
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
                    <label className="text-sm text-white/80">Artist Name</label>
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

                <div className="space-y-2">
                    <label className="text-sm text-white/80">Address</label>
                    <input
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter address"
                        className={cn(
                            "w-full rounded-lg bg-white/5 border border-white/10",
                            "px-4 py-3 text-white",
                            "focus:outline-none focus:ring-1 focus:ring-[#FF2EC8]"
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-sm text-white/80">City</label>
                        <input
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="Enter city"
                            className={cn(
                                "w-full rounded-lg bg-white/5 border border-white/10",
                                "px-4 py-3 text-white",
                                "focus:outline-none focus:ring-1 focus:ring-[#FF2EC8]"
                            )}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-white/80">State</label>
                        <input
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            placeholder="Enter state"
                            className={cn(
                                "w-full rounded-lg bg-white/5 border border-white/10",
                                "px-4 py-3 text-white",
                                "focus:outline-none focus:ring-1 focus:ring-[#FF2EC8]"
                            )}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-white/80">Zip Code</label>
                    <input
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        placeholder="Enter zip code"
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
                        className="w-full rounded-lg bg-black/20 border border-white/10  px-4 py-3 text-white outline-none focus:ring-1 focus:ring-[#FF2EC8]"
                    >
                        <option value="user">User</option>
                        <option value="artist">Artist</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-white/80">Favorite Game</label>
                    <select
                        value={gameId}
                        onChange={(e) => setGameId(e.target.value)}
                        className="w-full rounded-lg bg-black/20 border border-white/10 px-4 py-3 text-white outline-none focus:ring-1 focus:ring-[#FF2EC8]"
                    >
                        <option value="">Select a game</option>
                        {games.map((game) => (
                            <option key={game.id} value={game.id}>
                                {game.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                    <div className="space-y-1">
                        <p className="text-sm text-white/80">Social Verification Status</p>
                        <p className="text-xs text-white/50">
                            {socialVerificationStatus ? "Verified" : "Not Verified"}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            setSocialVerificationStatus((prev) => !prev)
                        }
                        className={cn(
                            "relative h-6 w-12 rounded-full transition-all duration-300",
                            socialVerificationStatus
                                ? "bg-[#22CAAD] shadow-[0_0_12px_rgba(34,202,173,0.35)]"
                                : "bg-white/15"
                        )}
                        aria-label="Toggle social verification status"
                        aria-pressed={socialVerificationStatus}
                    >
                        <span
                            className={cn(
                                "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-all duration-300",
                                socialVerificationStatus ? "left-6" : "left-0.5"
                            )}
                        />
                    </button>
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
