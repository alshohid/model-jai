/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import AppDialog from "@/shared/components/modal/AppDialog";
import { useCreateGameListMutation } from "@/redux/features/game/gameListManagement";
import { useGetAllGameCategoriesQuery } from "@/redux/features/game/gameCategoryManagement";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import {
    Field,
    inputCls,
    LogoUploadField,
    readImagePreview,
} from "../match/matchFormShared";
import AppSelect from "../reusable/AppSelect";

export default function CreateGameModal({ open, onClose }: any) {
    const [name, setName] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const [createGame, { isLoading }] = useCreateGameListMutation();
    const { data } = useGetAllGameCategoriesQuery({ page: 1, limit: 100 });

    const categoryOptions = useMemo(
        () =>
            data?.data?.map((cat) => ({
                label: cat.name,
                value: String(cat.id),
            })) ?? [],
        [data?.data],
    );

    const resetForm = () => {
        setName("");
        setCategoryId("");
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
            toast.error("Game name is required");
            return;
        }

        if (!categoryId) {
            toast.error("Category is required");
            return;
        }

        if (!image) {
            toast.error("Game image is required");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("name", name.trim());
            formData.append("category_id", categoryId);
            formData.append("image", image);

            await createGame(formData as any).unwrap();
            toast.success("Game created successfully");
            handleClose();
        } catch (error) {
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
            title="Create Game"
        >
            <div className="space-y-5 py-2">
                <Field label="Game Name" required>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter game name"
                        className={inputCls}
                    />
                </Field>

                <Field label="Category" required>
                    <AppSelect
                        value={categoryId}
                        onValueChange={setCategoryId}
                        options={categoryOptions}
                        placeholder="Select category"
                    />
                </Field>

                <LogoUploadField
                    label="Game Image"
                    inputId="create-game-image"
                    previewSrc={preview}
                    fileName={image?.name}
                    required
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
                    {isLoading ? "Creating..." : "Create Game"}
                </button>
            </div>
        </AppDialog>
    );
}
