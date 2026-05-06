"use client";

import { useState } from "react";
import { useGetFeaturedGalleryListQuery } from "@/redux/features/settings/gallery/galleryManagement";
import VideoCarousel, {
    VideoCarouselItem,
} from "@/shared/UI/reusable/carousel/VideoCarousel";
import VideoPreviewDialog from "@/shared/components/modal/VideoPreviewDialog";
import { getSafeImageSrc } from "@/shared/lib/utils/imagesrcvalidator";

export default function VideosSection() {
    const limit = 20;
    const [page] = useState(1);
    const [selectedVideo, setSelectedVideo] = useState<VideoCarouselItem | null>(null);

    const { data, isLoading } = useGetFeaturedGalleryListQuery({
        page,
        limit,
    });

    const videos: VideoCarouselItem[] =
        data?.data?.map((video) => ({
            id: String(video.id),
            title: video.description || "",
            videoSrc: video.short_video,
            posterSrc: getSafeImageSrc(video.short_video_thumb, "/images/home/cat_1.png"),
        })) ?? [];

    if (isLoading) {
        return (
            <section className="w-full pt-5 md:pt-15 container">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={index}
                            className="aspect-[10/16] rounded-[24px] bg-white/10 animate-pulse"
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
                autoPlay={true}
                muted={true}
                suspendPlayback={Boolean(selectedVideo)}
                onCardClick={(item) => setSelectedVideo(item)}
            />
            <VideoPreviewDialog
                open={Boolean(selectedVideo)}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedVideo(null);
                    }
                }}
                item={selectedVideo}
            />
        </section>
    );
}
