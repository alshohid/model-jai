/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import AppDialog from "@/shared/components/modal/AppDialog";
import { useCreateGameListMutation } from "@/redux/features/game/gameListManagement";
import { useGetAllGameCategoriesQuery } from "@/redux/features/game/gameCategoryManagement";

export default function CreateGameModal({ open, onClose }: any) {

    const [name, setName] = useState("");
    const [categoryId, setCategoryId] = useState<number | null>(null);
    const [image, setImage] = useState<File | null>(null);

    const [createGame, { isLoading }] =
        useCreateGameListMutation();

    const { data } =
        useGetAllGameCategoriesQuery({ page: 1, limit: 100 });

    const handleSubmit = async () => {

        if (!categoryId || !image) return;

        const formData = new FormData();

        formData.append("name", name);
        formData.append("category_id", String(categoryId));
        formData.append("image", image);

        await createGame(formData as any).unwrap();

        setName("");
        setCategoryId(null);
        setImage(null);

        onClose();
    };

    return (
        <AppDialog open={open} onOpenChange={onClose} title="Create Game">

            <div className="space-y-4 py-4">

                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Game name"
                    className="w-full h-10 px-3 rounded-md bg-white/10 text-white"
                />

                <select
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

                <input
                    type="file"
                    onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                />

                <button
                    disabled={isLoading}
                    onClick={handleSubmit}
                    className={`w-full h-10 rounded-md ${isLoading ? "bg-gray-500 cursor-not-allowed" : "bg-[#FF2EC8] cursor-pointer"} text-white`}
                >
                    {isLoading ? "Creating..." : "Create Game"}
                </button>

            </div>

        </AppDialog>
    );
}