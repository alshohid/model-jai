"use client";

import { useState } from "react";
import { useGetFeaturedGalleryListQuery } from "@/redux/features/settings/gallery/galleryManagement";
import VideoCarousel, {
    VideoCarouselItem,
} from "@/shared/UI/reusable/carousel/VideoCarousel";

export default function VideosSection() {
    const limit = 20;
    const [page] = useState(1);

    const { data, isLoading } = useGetFeaturedGalleryListQuery({
        page,
        limit,
    });

    const videos: VideoCarouselItem[] =
        data?.data?.map((video) => ({
            id: String(video.id),
            title: video.description || "",
            videoSrc: video.short_video,
            posterSrc: video.short_video_thumb,
        })) ?? [];

    if (isLoading) {
        return (
            <section className="w-full pt-5 md:pt-15 container">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-[260px] rounded-[20px] bg-white/10 animate-pulse"
                        />
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section className="w-full pt-5 md:pt-15 container">
            <VideoCarousel
                items={videos}
                autoPlay={false}
                onCardClick={(item) => console.log("clicked video:", item)}
            />
        </section>
    );
}