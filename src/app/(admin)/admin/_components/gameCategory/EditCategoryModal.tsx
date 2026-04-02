/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import AppDialog from "@/shared/components/modal/AppDialog";
import { useUpdateGameCategoryMutation, useViewSingleGameCategoryQuery } from "@/redux/features/game/gameCategoryManagement";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import Image from "next/image";
import { getSafeImageSrc } from "@/shared/lib/utils/imagesrcvalidator";

export default function EditCategoryModal({ item, open, onClose }: any) {
    const [name, setName] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const [updateCategory, { isLoading }] =
        useUpdateGameCategoryMutation();
    const { data: singleCategory, isFetching: isCategoryLoading } =
        useViewSingleGameCategoryQuery(item?.id, {
            skip: !item?.id || !open,
        });

    useEffect(() => {
        if (singleCategory?.data) {
            setName(singleCategory.data.name ?? "");
            setImage(null);
            setPreview(getSafeImageSrc(singleCategory.data.image));
        }
    }, [singleCategory]);

    useEffect(() => {
        if (!open) {
            setName("");
            setImage(null);
            setPreview(null);
        }
    }, [open]);

    const handleImageChange = (file: File | null) => {
        if (!file) return;

        setImage(file);
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
    };

    const handleUpdate = async () => {
        if (!item) return;
        if (!name.trim()) {
            toast.error("Category name is required");
            return;
        }

        const formData = new FormData();

        formData.append("name", name.trim());

        if (image) {
            formData.append("image", image);
        }

        try {
            await updateCategory({
                id: item.id,
                body: formData,
            }).unwrap();
            toast.success("Category updated successfully");

            onClose();
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    return (
        <AppDialog open={open} onOpenChange={onClose} title="Edit Category">
            <div className="space-y-4 py-4">
                <div className="space-y-2">
                    <label className="text-sm text-white/80">Category Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Category name"
                        className="w-full h-11 rounded-md px-3 bg-white/10 border border-white/10 text-white outline-none focus:ring-1 focus:ring-[#FF2EC8]"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-white/80">Category Image</label>

                    <div className="flex items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/5 p-4 min-h-[180px]">
                        {isCategoryLoading ? (
                            <div className="h-32 w-full animate-pulse rounded-lg bg-white/10" />
                        ) : preview ? (
                            <Image
                                src={preview}
                                alt={name || "Category preview"}
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
                    onClick={handleUpdate}
                    disabled={isLoading || isCategoryLoading}
                    className={`w-full h-11 rounded-md ${isLoading || isCategoryLoading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500 cursor-pointer"} text-white`}
                >
                    {isLoading ? "Updating..." : "Update Category"}
                </button>
            </div>
        </AppDialog>
    );
}
