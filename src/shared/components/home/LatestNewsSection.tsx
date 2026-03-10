"use client";

import Image from "next/image";
import StartStreamingButton from "@/shared/UI/button/StartStreamingButton";
import { useGetPublicNewsListQuery } from "@/redux/features/settings/news/newsManagement";
import AppPagination from "@/app/(admin)/admin/_components/topComponent/AppPagination";
import { useState } from "react";
import Link from "next/link";

type NewsItem = {
    id: string;
    title: string;
    image: string;
};



export default function LatestNewsSection() {
    const [page, setPage] = useState(1);
    const { data, isLoading } = useGetPublicNewsListQuery({
        page: page,
        limit: 5
    });

    const items: NewsItem[] =
        data?.data?.map((news) => ({
            id: String(news?.id),
            title: news?.title,
            image: news?.image || "/images/home/news_1.png",
        })) ?? [];
    const meta = {
        page: data?.meta?.current_page ?? 1,
        limit: data?.meta?.per_page ?? 10,
        total: data?.meta?.total ?? 0,
        prev: data?.meta?.has_prev ?? false,
        next: data?.meta?.has_next ?? false,
    };

    return (
        <section className="w-full relative">
            <div className="absolute top-0 left-0 -translate-y-2/3 pointer-events-none ">
                <Image
                    src="/images/home/Ellipse2.png"
                    alt="ellipse"
                    width={1600}
                    height={800}
                    className="w-[1600px] h-[800px]"
                    unoptimized
                />
            </div>
            <div className="container py-8 md:py-15 lg:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-[4fr_8fr] gap-10 lg:gap-16 items-start">
                    {/* Left */}
                    <div className="flex flex-col items-start gap-6">
                        <h2 className="text-[#FFFFFF] text-[48px] sm:text-[52px] leading-[1.05] font-light pb-4 ">
                            Latest news &<br /> updates
                        </h2>

                        <Link href="/register">
                            <StartStreamingButton >
                                Sign Up
                            </StartStreamingButton>
                        </Link>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="h-[220px] rounded-[20px] bg-white/10 animate-pulse"
                                />
                            ))}
                        </div>
                    ) : (
                        <>    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                            {items.map((item) => (
                                <article key={item.id} className="w-full">
                                    <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden">
                                        <Image
                                            src={item?.image}
                                            alt={item?.title}
                                            fill
                                            className="object-cover"
                                            sizes="(min-width: 768px) 320px, 100vw"
                                        />
                                    </div>

                                    <p className="mt-5 text-white/90 text-lg sm:text-xl leading-snug line-clamp-2">
                                        {item?.title}
                                    </p>
                                </article>
                            ))}
                        </div>
                            {meta.total > 5 && (
                                <div className="mt-6">
                                    <AppPagination
                                        meta={meta}
                                        onPageChange={setPage}
                                        showSummary={false}
                                    />
                                </div>)} </>


                    )}

                </div>
            </div>
        </section>
    );
}
