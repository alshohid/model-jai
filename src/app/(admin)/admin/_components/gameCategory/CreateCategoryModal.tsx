/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import AppDialog from "@/shared/components/modal/AppDialog";
import { useCreateGameCategoryMutation } from "@/redux/features/game/gameCategoryManagement";
import { toast } from "sonner";
import {
    Field,
    inputCls,
    LogoUploadField,
    readImagePreview,
} from "../match/matchFormShared";

export default function CreateCategoryModal({ open, onClose }: any) {
    const [name, setName] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const [createCategory, { isLoading }] = useCreateGameCategoryMutation();

    const getErrorMessage = (error: any) => {
        const fieldErrors = error?.data?.errors;

        if (fieldErrors && typeof fieldErrors === "object") {
            const firstFieldError = Object.values(fieldErrors).find(
                (value) => Array.isArray(value) && value.length > 0,
            ) as string[] | undefined;

            if (firstFieldError?.[0]) {
                return firstFieldError[0];
            }
        }

        return (
            error?.data?.message ??
            error?.message ??
            "Failed to create category"
        );
    };

    const resetForm = () => {
        setName("");
        setImage(null);
        setPreview(null);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleImageChange = async (file: File | null) => {
        if (!file) {
            setImage(null);
            setPreview(null);
            return;
        }

        try {
            const nextPreview = await readImagePreview(file);
            setImage(file);
            setPreview(nextPreview);
        } catch {
            toast.error("Could not preview the selected image.");
        }
    };

    const handleSubmit = async () => {
        if (!name.trim()) {
            toast.error("Category name is required");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("name", name.trim());
            if (image) formData.append("image", image);

            const response = await createCategory(formData as any).unwrap();
            toast.success(response?.message ?? "Category created successfully");
            handleClose();
        } catch (error: any) {
            toast.error(getErrorMessage(error));
        }
    };

    return (
        <AppDialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (!nextOpen) {
                    handleClose();
                }
            }}
            title="Create Category"
        >
            <div className="space-y-5 py-2">
                <Field label="Category Name" required>
                    <input
                        type="text"
                        placeholder="Enter category name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={inputCls}
                    />
                </Field>

                <LogoUploadField
                    label="Category Image"
                    inputId="create-category-image"
                    previewSrc={preview}
                    fileName={image?.name}
                    buttonLabel={preview ? "Change image" : "Choose image"}
                    helperText="PNG, JPG, or WEBP"
                    onFileChange={handleImageChange}
                    onClear={() => handleImageChange(null)}
                />

                <button
                    type="button"
                    disabled={isLoading}
                    onClick={handleSubmit}
                    className={`h-11 w-full rounded-lg text-sm font-medium text-white transition ${
                        isLoading
                            ? "cursor-not-allowed bg-white/20"
                            : "cursor-pointer bg-[#FF2EC8] hover:bg-[#ff48d0]"
                    }`}
                >
                    {isLoading ? "Creating..." : "Create Category"}
                </button>
            </div>
        </AppDialog>
    );
}
