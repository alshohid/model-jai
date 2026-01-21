"use client";

import VideoCarousel, { VideoCarouselItem } from "@/shared/UI/reusable/carousel/VideoCarousel";



const videos: VideoCarouselItem[] = [
    { id: "1", title: "", videoSrc: "/images/home/artist.mp4", posterSrc: "/images/poster1.jpg" },
    { id: "2", title: "video 2", videoSrc: "/videos/v2.mp4", posterSrc: "/images/poster2.jpg" },
    { id: "3", title: "video 3", videoSrc: "/videos/v3.mp4", posterSrc: "/images/poster3.jpg" },
];

export default function VideosSection() {
    return (
        <section className="w-full pt-5 md:pt-15 container">
            <VideoCarousel
                items={videos}
                onCardClick={(item) => console.log("clicked video:", item)}
            />
        </section>
    );
}
