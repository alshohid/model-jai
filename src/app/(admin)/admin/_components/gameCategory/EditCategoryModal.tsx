/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import AppDialog from "@/shared/components/modal/AppDialog";
import { useUpdateGameCategoryMutation } from "@/redux/features/game/gameCategoryManagement";

export default function EditCategoryModal({ item, open, onClose }: any) {

    const [name, setName] = useState("");
    const [image, setImage] = useState<File | null>(null);

    const [updateCategory, { isLoading }] =
        useUpdateGameCategoryMutation();

    useEffect(() => {
        if (item) {
            setName(item.name);
            setImage(null);
        }
    }, [item]);

    const handleUpdate = async () => {
        if (!item) return;

        const formData = new FormData();

        formData.append("name", name);

        if (image) {
            formData.append("image", image);
        }

        try {
            await updateCategory({
                id: item.id,
                body: formData,
            }).unwrap();

            onClose();
        } catch (error) {
            console.error("Update category failed:", error);
        }
    };

    return (
        <AppDialog open={open} onOpenChange={onClose} title="Edit Category">

            <div className="space-y-4 py-4">

                {/* Category Name */}
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Category name"
                    className="w-full h-11 rounded-md px-3 bg-white/10 border border-white/10 text-white"
                />

                {/* Image Upload */}
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                    className="text-white"
                />

                {/* Action Button */}
                <button
                    onClick={handleUpdate}
                    disabled={isLoading}
                    className={`w-full h-11 rounded-md ${isLoading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500 cursor-pointer"} text-white`}
                >
                    {isLoading ? "Updating..." : "Update Category"}
                </button>

            </div>

        </AppDialog>
    );
}