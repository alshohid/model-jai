"use client";

import { useEffect, useRef, useState } from "react";
import { useGetFeaturedGalleryListQuery } from "@/redux/features/settings/gallery/galleryManagement";
import VideoCarousel, {
    VideoCarouselItem,
} from "@/shared/UI/reusable/carousel/VideoCarousel";
import VideoPreviewDialog from "@/shared/components/modal/VideoPreviewDialog";
import { getSafeImageSrc } from "@/shared/lib/utils/imagesrcvalidator";

export default function VideosSection() {
    const limit = 20;
    const [page] = useState(1);
    const [selectedVideoIndex, setSelectedVideoIndex] = useState<number | null>(null);
    const preloadCacheRef = useRef<Map<string, HTMLVideoElement>>(new Map());

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

    const isPreviewOpen =
        selectedVideoIndex !== null &&
        selectedVideoIndex >= 0 &&
        selectedVideoIndex < videos.length;

    const warmVideoByIndex = (index: number, preload: "metadata" | "auto" = "metadata") => {
        const item = videos[index];

        if (!item?.videoSrc || typeof document === "undefined") {
            return;
        }

        const existingVideo = preloadCacheRef.current.get(item.videoSrc);

        if (existingVideo) {
            if (preload === "auto" && existingVideo.preload !== "auto") {
                existingVideo.preload = "auto";
                existingVideo.load();
            }

            return;
        }

        const preloadVideo = document.createElement("video");
        preloadVideo.src = item.videoSrc;
        preloadVideo.preload = preload;
        preloadVideo.muted = true;
        preloadVideo.defaultMuted = true;
        preloadVideo.playsInline = true;
        preloadVideo.load();

        preloadCacheRef.current.set(item.videoSrc, preloadVideo);
    };

    useEffect(() => {
        videos.slice(0, 4).forEach((_, index) => {
            warmVideoByIndex(index, "metadata");
        });
    }, [videos]);

    useEffect(() => {
        if (!isPreviewOpen || selectedVideoIndex === null) {
            return;
        }

        warmVideoByIndex(selectedVideoIndex, "auto");
        warmVideoByIndex(selectedVideoIndex - 1, "metadata");
        warmVideoByIndex(selectedVideoIndex + 1, "metadata");
    }, [isPreviewOpen, selectedVideoIndex, videos]);

    if (isLoading) {
        return (
            <section className="w-full pt-5 md:pt-15 container">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={index}
                            className="aspect-video rounded-[24px] bg-white/10 animate-pulse"
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
                onCardIntent={(_, index) => {
                    warmVideoByIndex(index, "auto");
                    warmVideoByIndex(index - 1, "metadata");
                    warmVideoByIndex(index + 1, "metadata");
                }}
                onCardClick={(_, index) => setSelectedVideoIndex(index)}
            />
            <VideoPreviewDialog
                open={isPreviewOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedVideoIndex(null);
                    }
                }}
                items={videos}
                currentIndex={selectedVideoIndex ?? 0}
                onIndexChange={setSelectedVideoIndex}
            />
        </section>
    );
}
