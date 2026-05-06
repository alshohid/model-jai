"use client";

import * as React from "react";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import type { VideoCarouselItem } from "@/shared/UI/reusable/carousel/VideoCarousel";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    item: VideoCarouselItem | null;
};

export default function VideoPreviewDialog({
    open,
    onOpenChange,
    item,
}: Props) {
    const videoRef = React.useRef<HTMLVideoElement | null>(null);

    React.useEffect(() => {
        if (!open || !item) return;

        const video = videoRef.current;
        if (!video) return;

        video.currentTime = 0;
        video.muted = false;
        video.volume = 1;

        const frame = window.requestAnimationFrame(() => {
            video.play().catch(() => { });
        });

        return () => {
            window.cancelAnimationFrame(frame);
            video.pause();
            video.currentTime = 0;
        };
    }, [open, item]);

    if (!item) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                showCloseButton={false}
                className="w-[calc(100vw-16px)] max-w-[min(92vw,960px)] border-0 bg-transparent p-0 shadow-none"
            >
                <DialogTitle className="sr-only">
                    {item.title || "Video preview"}
                </DialogTitle>

                <div className="relative overflow-hidden rounded-[22px] border border-white/10 bg-[#050507]/95 shadow-[0_32px_120px_rgba(0,0,0,0.48)]">
                    <DialogClose asChild>
                        <button
                            type="button"
                            className="absolute right-3 top-3 z-20 inline-flex size-10 items-center justify-center rounded-full border border-white/12 bg-black/55 text-white/85 backdrop-blur-md transition hover:bg-black/70 hover:text-white"
                            aria-label="Close video"
                        >
                            <X className="size-5" />
                        </button>
                    </DialogClose>

                    <div className="bg-black p-2 sm:p-3">
                        <div className="overflow-hidden rounded-[18px] border border-white/10 bg-black">
                            <video
                                key={item.id}
                                ref={videoRef}
                                src={item.videoSrc}
                                poster={item.posterSrc}
                                className="max-h-[82dvh] w-full bg-black object-contain"
                                controls
                                autoPlay
                                playsInline
                                preload="auto"
                            />
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
