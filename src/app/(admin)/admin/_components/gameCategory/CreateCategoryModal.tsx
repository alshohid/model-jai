/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import AppDialog from "@/shared/components/modal/AppDialog";
import { useCreateGameCategoryMutation } from "@/redux/features/game/gameCategoryManagement";
import Image from "next/image";

export default function CreateCategoryModal({ open, onClose }: any) {

    const [name, setName] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const [createCategory, { isLoading }] =
        useCreateGameCategoryMutation();

    const handleImageChange = (file: File | null) => {
        if (!file) return;

        setImage(file);

        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
    };

    const handleSubmit = async () => {

        const formData = new FormData();

        formData.append("name", name);
        if (image) formData.append("image", image);

        await createCategory(formData as any).unwrap();

        setName("");
        setImage(null);
        setPreview(null);

        onClose();
    };

    return (
        <AppDialog open={open} onOpenChange={onClose} title="Create Category">

            <div className="space-y-4 py-4">

                {/* Category Name */}
                <input
                    type="text"
                    placeholder="Category name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-10 rounded-md px-3 bg-white/10 text-white border border-white/10 focus:outline-none focus:ring-[0.5px] focus:ring-pink-500"
                />

                {/* Image Preview */}
                {preview && (
                    <div className="flex justify-center">
                        <Image
                            src={preview}
                            alt="preview"
                            width={120}
                            height={120}
                            className="rounded-md object-cover border border-white/20"
                            unoptimized
                        />
                    </div>
                )}

                {/* Image Input */}
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                        handleImageChange(e.target.files?.[0] ?? null)
                    }
                    className="text-white"
                />

                {/* Submit Button */}
                <button
                    disabled={isLoading}
                    onClick={handleSubmit}
                    className={`w-full h-10 rounded-md ${isLoading ? "bg-gray-500 cursor-not-allowed" : "bg-[#FF2EC8] cursor-pointer"} text-white`}
                >
                    {isLoading ? "Creating..." : "Create"}
                </button>

            </div>

        </AppDialog>
    );
}