/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import AppDialog from "@/shared/components/modal/AppDialog";
import {
    useUpdateNewsMutation,
    useViewSingleNewsQuery,
} from "@/redux/features/settings/news/newsManagement";
import { EditMatchSkeleton } from "../match/EditMatchSkeleton";

export default function EditNewsModal({ newsId, open, onClose }: any) {

    const { data, isLoading } = useViewSingleNewsQuery(newsId, {
        skip: !newsId || !open,
    });

    const [updateNews, { isLoading: isUpdating }] = useUpdateNewsMutation();

    const [form, setForm] = useState<any>({
        title: "",
        description: "",
        status: "published",
        is_featured: false,
        image: null,
    });

    useEffect(() => {
        if (data?.data) {

            const n = data.data;

            setForm({
                title: n.title,
                description: n.description,
                status: n.status,
                is_featured: n.is_featured,
            });
        }
    }, [data]);

    const handleSubmit = async () => {

        const formData = new FormData();

        formData.append("title", form.title);
        formData.append("description", form.description);
        formData.append("status", form.status);
        formData.append("is_featured", form.is_featured ? "1" : "0");

        if (form.image) formData.append("image", form.image);

        await updateNews({
            id: newsId,
            body: formData,
        }).unwrap();

        onClose();
    };

    return (
        <AppDialog open={open} onOpenChange={onClose} title="Edit News">
            {isLoading ? (

                <EditMatchSkeleton />

            ) : (
                <div className="space-y-4 py-4">

                    <input
                        value={form.title}
                        onChange={(e) =>
                            setForm({ ...form, title: e.target.value })
                        }
                        className="w-full h-10 px-3 rounded-md bg-white/10 text-white"
                    />

                    <textarea
                        value={form.description}
                        onChange={(e) =>
                            setForm({ ...form, description: e.target.value })
                        }
                        className="w-full h-24 px-3 rounded-md bg-white/10 text-white"
                    />

                    <input
                        type="file"
                        onChange={(e) =>
                            setForm({ ...form, image: e.target.files?.[0] })
                        }
                    />

                    <button
                        onClick={handleSubmit}
                        disabled={isUpdating}
                        className="w-full h-10 bg-[#FF2EC8] text-white rounded-md"
                    >
                        {isUpdating ? "Updating..." : "Update"}
                    </button>

                </div>
            )}



        </AppDialog>
    );
}