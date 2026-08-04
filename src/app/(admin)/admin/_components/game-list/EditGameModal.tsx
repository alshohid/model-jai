/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import AppDialog from "@/shared/components/modal/AppDialog";
import {
    useUpdateGameListMutation,
    useViewSingleGameListQuery,
} from "@/redux/features/game/gameListManagement";
import { useGetAllGameCategoriesQuery } from "@/redux/features/game/gameCategoryManagement";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import { getSafeImageSrc } from "@/shared/lib/utils/imagesrcvalidator";
import {
    Field,
    inputCls,
    LogoUploadField,
    readImagePreview,
} from "../match/matchFormShared";
import AppSelect from "../reusable/AppSelect";

export default function EditGameModal({ item, open, onClose }: any) {
    const [name, setName] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [existingImage, setExistingImage] = useState<string | null>(null);

    const [updateGame, { isLoading }] = useUpdateGameListMutation();
    const { data: singleGame, isFetching: isGameLoading } =
        useViewSingleGameListQuery(item?.id, {
            skip: !item?.id || !open,
        });

    const { data } = useGetAllGameCategoriesQuery({ page: 1, limit: 100 });

    const categoryOptions = useMemo(
        () =>
            data?.data?.map((cat) => ({
                label: cat.name,
                value: String(cat.id),
            })) ?? [],
        [data?.data],
    );

    useEffect(() => {
        if (singleGame?.data) {
            const nextImage = getSafeImageSrc(singleGame.data.image) || null;
            setName(singleGame.data.name ?? "");
            setCategoryId(
                singleGame.data.category_id
                    ? String(singleGame.data.category_id)
                    : "",
            );
            setImage(null);
            setExistingImage(nextImage);
            setPreview(nextImage);
        }
    }, [singleGame]);

    useEffect(() => {
        if (!open) {
            setName("");
            setCategoryId("");
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
            toast.error("Game name is required");
            return;
        }

        if (!categoryId) {
            toast.error("Category is required");
            return;
        }

        const formData = new FormData();
        formData.append("name", name.trim());
        formData.append("category_id", categoryId);

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
        <AppDialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (!nextOpen) {
                    onClose();
                }
            }}
            title="Edit Game"
        >
            <div className="space-y-5 py-2">
                <Field label="Game Name" required>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter game name"
                        disabled={isGameLoading}
                        className={inputCls}
                    />
                </Field>

                <Field label="Category" required>
                    <AppSelect
                        value={categoryId}
                        onValueChange={setCategoryId}
                        options={categoryOptions}
                        placeholder="Select category"
                        disabled={isGameLoading}
                    />
                </Field>

                <LogoUploadField
                    label="Game Image"
                    inputId="edit-game-image"
                    previewSrc={isGameLoading ? null : preview}
                    fileName={image?.name}
                    buttonLabel={preview ? "Change image" : "Choose image"}
                    helperText={
                        isGameLoading
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
                    disabled={isLoading || isGameLoading}
                    onClick={handleUpdate}
                    className={`h-11 w-full rounded-lg text-sm font-medium text-white transition ${
                        isLoading || isGameLoading
                            ? "cursor-not-allowed bg-white/20"
                            : "cursor-pointer bg-[#FF2EC8] hover:bg-[#ff48d0]"
                    }`}
                >
                    {isLoading ? "Updating..." : "Update Game"}
                </button>
            </div>
        </AppDialog>
    );
}
