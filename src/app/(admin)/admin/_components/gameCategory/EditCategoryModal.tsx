/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import AppDialog from "@/shared/components/modal/AppDialog";
import {
    useUpdateGameCategoryMutation,
    useViewSingleGameCategoryQuery,
} from "@/redux/features/game/gameCategoryManagement";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import { getSafeImageSrc } from "@/shared/lib/utils/imagesrcvalidator";
import {
    Field,
    inputCls,
    LogoUploadField,
    readImagePreview,
} from "../match/matchFormShared";

export default function EditCategoryModal({ item, open, onClose }: any) {
    const [name, setName] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [existingImage, setExistingImage] = useState<string | null>(null);

    const [updateCategory, { isLoading }] = useUpdateGameCategoryMutation();
    const { data: singleCategory, isFetching: isCategoryLoading } =
        useViewSingleGameCategoryQuery(item?.id, {
            skip: !item?.id || !open,
        });

    useEffect(() => {
        if (singleCategory?.data) {
            const nextImage = getSafeImageSrc(singleCategory.data.image) || null;
            setName(singleCategory.data.name ?? "");
            setImage(null);
            setExistingImage(nextImage);
            setPreview(nextImage);
        }
    }, [singleCategory]);

    useEffect(() => {
        if (!open) {
            setName("");
            setImage(null);
            setPreview(null);
            setExistingImage(null);
        }
    }, [open]);

    const handleImageChange = async (file: File | null) => {
        if (!file) {
            setImage(null);
            setPreview(existingImage);
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
        <AppDialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (!nextOpen) {
                    onClose();
                }
            }}
            title="Edit Category"
        >
            <div className="space-y-5 py-2">
                <Field label="Category Name" required>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter category name"
                        disabled={isCategoryLoading}
                        className={inputCls}
                    />
                </Field>

                <LogoUploadField
                    label="Category Image"
                    inputId="edit-category-image"
                    previewSrc={isCategoryLoading ? null : preview}
                    fileName={image?.name}
                    buttonLabel={preview ? "Change image" : "Choose image"}
                    helperText={
                        isCategoryLoading
                            ? "Loading current image..."
                            : "PNG, JPG, or WEBP"
                    }
                    onFileChange={handleImageChange}
                    onClear={
                        image || preview
                            ? () => handleImageChange(null)
                            : undefined
                    }
                />

                <button
                    type="button"
                    onClick={handleUpdate}
                    disabled={isLoading || isCategoryLoading}
                    className={`h-11 w-full rounded-lg text-sm font-medium text-white transition ${
                        isLoading || isCategoryLoading
                            ? "cursor-not-allowed bg-white/20"
                            : "cursor-pointer bg-[#FF2EC8] hover:bg-[#ff48d0]"
                    }`}
                >
                    {isLoading ? "Updating..." : "Update Category"}
                </button>
            </div>
        </AppDialog>
    );
}
