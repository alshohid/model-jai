/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import AppDialog from "@/shared/components/modal/AppDialog";
import { useUpdateGameListMutation } from "@/redux/features/game/gameListManagement";
import { useGetAllGameCategoriesQuery } from "@/redux/features/game/gameCategoryManagement";

export default function EditGameModal({ item, open, onClose }: any) {

    const [name, setName] = useState("");
    const [categoryId, setCategoryId] = useState<number | null>(null);
    const [image, setImage] = useState<File | null>(null);

    const [updateGame, { isLoading }] =
        useUpdateGameListMutation();

    const { data } =
        useGetAllGameCategoriesQuery({ page: 1, limit: 100 });

    useEffect(() => {
        if (item) {
            setName(item.name);
            setCategoryId(item.category_id);
            setImage(null);
        }
    }, [item]);

    const handleUpdate = async () => {

        if (!categoryId) return;

        const formData = new FormData();

        formData.append("name", name);
        formData.append("category_id", String(categoryId));

        if (image) {
            formData.append("image", image);
        }

        await updateGame({
            id: item.id,
            body: formData,
        }).unwrap();

        onClose();
    };

    return (
        <AppDialog open={open} onOpenChange={onClose} title="Edit Game">

            <div className="space-y-4 py-4">

                {/* Game Name */}
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Game name"
                    className="w-full h-10 px-3 rounded-md bg-white/10 text-white"
                />

                {/* Category Select */}
                <select
                    value={categoryId ?? ""}
                    onChange={(e) => setCategoryId(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-md bg-white/10 text-white"
                >
                    <option value="">Select Category</option>

                    {data?.data?.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}

                </select>

                {/* Image Upload */}
                <input
                    type="file"
                    onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                />

                {/* Submit Button */}
                <button
                    disabled={isLoading}
                    onClick={handleUpdate}
                    className={`w-full h-10 rounded-md ${isLoading
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