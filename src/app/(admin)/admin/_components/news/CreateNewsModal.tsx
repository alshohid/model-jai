/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import AppDialog from "@/shared/components/modal/AppDialog";
import { useCreateNewsMutation } from "@/redux/features/settings/news/newsManagement";

export default function CreateNewsModal({ open, onClose }: any) {

    const [createNews, { isLoading }] = useCreateNewsMutation();

    const [form, setForm] = useState({
        title: "",
        description: "",
        status: "published",
        is_featured: false,
        image: null as File | null,
    });

    const handleSubmit = async () => {

        const formData = new FormData();

        formData.append("title", form.title);
        formData.append("description", form.description);
        formData.append("status", form.status);
        formData.append("is_featured", form.is_featured ? "1" : "0");

        if (form.image) formData.append("image", form.image);

        await createNews(formData).unwrap();

        onClose();
    };

    return (
        <AppDialog open={open} onOpenChange={onClose} title="Create News">

            <div className="space-y-4 py-4">

                <input
                    placeholder="Title"
                    className="w-full h-10 px-3 rounded-md bg-white/10 text-white"
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                />

                <textarea
                    placeholder="Description"
                    className="w-full h-24 px-3 rounded-md bg-white/10 text-white"
                    onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                    }
                />

                <select
                    className="w-full h-10 px-3 rounded-md bg-white/10 text-white"
                    onChange={(e) =>
                        setForm({ ...form, status: e.target.value })
                    }
                >
                    <option value="published" className="text-black">
                        Published
                    </option>
                    <option value="draft" className="text-black">
                        Draft
                    </option>
                </select>

                <label className="flex items-center gap-2 text-white">

                    <input
                        type="checkbox"
                        onChange={(e) =>
                            setForm({ ...form, is_featured: e.target.checked })
                        }
                    />

                    Featured
                </label>

                <input
                    type="file"
                    onChange={(e) =>
                        setForm({ ...form, image: e.target.files?.[0] ?? null })
                    }
                />

                <button
                    onClick={handleSubmit}
                    className="w-full h-10 bg-[#FF2EC8] text-white rounded-md"
                >
                    {isLoading ? "Creating..." : "Create"}
                </button>

            </div>

        </AppDialog>
    );
}