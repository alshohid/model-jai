/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import AppDialog from "@/shared/components/modal/AppDialog";
import { useUpdateGameListMutation, useViewSingleGameListQuery } from "@/redux/features/game/gameListManagement";
import { useGetAllGameCategoriesQuery } from "@/redux/features/game/gameCategoryManagement";
import Image from "next/image";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import { getSafeImageSrc } from "@/shared/lib/utils/imagesrcvalidator";

export default function EditGameModal({ item, open, onClose }: any) {
    const [name, setName] = useState("");
    const [categoryId, setCategoryId] = useState<number | null>(null);
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const [updateGame, { isLoading }] =
        useUpdateGameListMutation();
    const { data: singleGame, isFetching: isGameLoading } =
        useViewSingleGameListQuery(item?.id, {
            skip: !item?.id || !open,
        });

    const { data } =
        useGetAllGameCategoriesQuery({ page: 1, limit: 100 });

    useEffect(() => {
        if (singleGame?.data) {
            setName(singleGame.data.name ?? "");
            setCategoryId(Number(singleGame.data.category_id));
            setImage(null);
            setPreview(getSafeImageSrc(singleGame.data.image));
        }
    }, [singleGame]);

    useEffect(() => {
        if (!open) {
            setName("");
            setCategoryId(null);
            setImage(null);
            setPreview(null);
        }
    }, [open]);

    const handleImageChange = (file: File | null) => {
        if (!file) return;

        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleUpdate = async () => {
        if (!item) return;
        if (!name.trim()) {
            toast.error("Game name is required");
            return;
        }

        if (!categoryId) {
            toast.error("Category is required");
            return;
        }

        const formData = new FormData();

        formData.append("name", name.trim());
        formData.append("category_id", String(categoryId));

        if (image) {
            formData.append("image", image);
        }

        try {
            await updateGame({
                id: item.id,
                body: formData,
            }).unwrap();

            toast.success("Game updated successfully");
            onClose();
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    return (
        <AppDialog open={open} onOpenChange={onClose} title="Edit Game">
            <div className="space-y-4 py-4">
                <div className="space-y-2">
                    <label className="text-sm text-white/80">Game Name</label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Game name"
                        className="w-full h-10 px-3 rounded-md bg-white/10 border border-white/10 text-white outline-none focus:ring-1 focus:ring-[#FF2EC8]"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-white/80">Category</label>
                    <select
                        value={categoryId ?? ""}
                        onChange={(e) =>
                            setCategoryId(e.target.value ? Number(e.target.value) : null)
                        }
                        className="w-full h-10 px-3 rounded-md bg-white/10 border border-white/10 text-white outline-none focus:ring-1 focus:ring-[#FF2EC8]"
                    >
                        <option value="">Select Category</option>

                        {data?.data?.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-white/80">Game Image</label>

                    <div className="flex items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/5 p-4 min-h-[180px]">
                        {isGameLoading ? (
                            <div className="h-32 w-full animate-pulse rounded-lg bg-white/10" />
                        ) : preview ? (
                            <Image
                                src={preview}
                                alt={name || "Game preview"}
                                width={220}
                                height={160}
                                className="max-h-[180px] w-auto rounded-lg object-cover border border-white/10"
                                unoptimized
                            />
                        ) : (
                            <p className="text-sm text-white/45">No image selected</p>
                        )}
                    </div>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)}
                        className="text-white"
                    />
                </div>

                <button
                    disabled={isLoading || isGameLoading}
                    onClick={handleUpdate}
                    className={`w-full h-10 rounded-md ${isLoading || isGameLoading
                        ? "bg-gray-500 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600 cursor-pointer"
                        } text-white`}
                >
                    {isLoading ? "Updating..." : "Update Game"}
                </button>
            </div>
        </AppDialog>
    );
}
