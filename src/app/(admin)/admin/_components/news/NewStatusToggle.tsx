/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useUpdateNewsMutation } from "@/redux/features/settings/news/newsManagement";

export default function NewsStatusToggle({ id, status }: any) {
    const [updateNews] = useUpdateNewsMutation();

    const toggleStatus = async () => {
        await updateNews({
            id,
            body: {
                status: status === "published" ? "draft" : "published",
            },
        });
    };

    return (
        <button
            onClick={toggleStatus}
            className={`px-3 py-1 text-xs rounded-md transition ${status === "published"
                    ? "bg-green-600 text-white"
                    : "bg-gray-600 text-white"
                }`}
        >
            {status}
        </button>
    );
}