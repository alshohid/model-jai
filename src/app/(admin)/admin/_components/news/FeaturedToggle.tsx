/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useUpdateNewsMutation } from "@/redux/features/settings/news/newsManagement";

export default function FeaturedToggle({ id, featured }: any) {
    const [updateNews] = useUpdateNewsMutation();

    const toggle = async () => {
        const form = new FormData();
        form.append("is_featured", featured ? "0" : "1");

        await updateNews({
            id,
            body: form,
        });
    };

    return (
        <button
            onClick={toggle}
            className={`px-2 py-1 text-xs rounded-md ${featured
                    ? "bg-purple-600 text-white"
                    : "bg-gray-500 text-white"
                }`}
        >
            {featured ? "Featured" : "Normal"}
        </button>
    );
}