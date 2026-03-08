/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import AppDialog from "@/shared/components/modal/AppDialog";
import { useViewSingleNewsQuery } from "@/redux/features/settings/news/newsManagement";

export default function ViewNewsModal({ newsId, open, onClose }: any) {

    const { data, isLoading } = useViewSingleNewsQuery(newsId, {
        skip: !newsId || !open,
    });

    const news = data?.data;

    return (
        <AppDialog open={open} onOpenChange={onClose} title="News Details">

            {isLoading ? (
                <div className="text-white py-10 text-center">Loading...</div>
            ) : (
                <div className="space-y-4 text-white">

                    <img
                        src={news?.image ?? "/images/home/avatar_1.png"}
                        className="w-full h-60 object-cover rounded-md"
                    />

                    <h2 className="text-lg font-semibold">{news?.title}</h2>

                    <p className="text-white/70">{news?.description}</p>

                </div>
            )}

        </AppDialog>
    );
}