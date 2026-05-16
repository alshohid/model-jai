"use client";

import * as React from "react";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { VideoCarouselItem } from "@/shared/UI/reusable/carousel/VideoCarousel";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    items: VideoCarouselItem[];
    currentIndex: number;
    onIndexChange: (index: number) => void;
};

export default function VideoPreviewDialog({
    open,
    onOpenChange,
    items,
    currentIndex,
    onIndexChange,
}: Props) {
    const videoRef = React.useRef<HTMLVideoElement | null>(null);
    const totalItems = items.length;
    const safeIndex =
        totalItems > 0
            ? Math.min(Math.max(currentIndex, 0), totalItems - 1)
            : 0;
    const item = items[safeIndex] ?? null;

    const goToPrev = () => {
        if (totalItems < 2) {
            return;
        }

        onIndexChange((safeIndex - 1 + totalItems) % totalItems);
    };

    const goToNext = () => {
        if (totalItems < 2) {
            return;
        }

        onIndexChange((safeIndex + 1) % totalItems);
    };

    React.useEffect(() => {
        if (!open || !item) return;

        const video = videoRef.current;
        if (!video) return;

        video.currentTime = 0;
        video.muted = true;
        video.defaultMuted = true;

        const frame = window.requestAnimationFrame(() => {
            video.play().catch(() => { });
        });

        return () => {
            window.cancelAnimationFrame(frame);
            video.pause();
            video.currentTime = 0;
        };
    }, [open, item]);

    React.useEffect(() => {
        if (!open || totalItems < 2) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "ArrowLeft") {
                event.preventDefault();
                goToPrev();
            }

            if (event.key === "ArrowRight") {
                event.preventDefault();
                goToNext();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [goToNext, goToPrev, open, totalItems]);

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
                        <div className="flex items-center gap-1.5 sm:gap-3">
                            {totalItems > 1 ? (
                                <button
                                    type="button"
                                    onClick={goToPrev}
                                    className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-white/12 bg-black/55 text-white/85 backdrop-blur-md transition hover:bg-black/70 hover:text-white sm:size-11"
                                    aria-label="Previous video"
                                >
                                    <ChevronLeft className="size-5" />
                                </button>
                            ) : null}

                            <div className="min-w-0 flex-1 overflow-hidden rounded-[18px] border border-white/10 bg-black">
                                <video
                                    key={`${item.id}-${safeIndex}`}
                                    ref={videoRef}
                                    src={item.videoSrc}
                                    poster={item.posterSrc}
                                    className="max-h-[82dvh] w-full bg-black object-contain"
                                    controls
                                    autoPlay
                                    muted
                                    playsInline
                                    preload="auto"
                                />
                            </div>

                            {totalItems > 1 ? (
                                <button
                                    type="button"
                                    onClick={goToNext}
                                    className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-white/12 bg-black/55 text-white/85 backdrop-blur-md transition hover:bg-black/70 hover:text-white sm:size-11"
                                    aria-label="Next video"
                                >
                                    <ChevronRight className="size-5" />
                                </button>
                            ) : null}
                        </div>

                        <div className="flex items-center justify-between gap-4 px-1 pt-3 text-white/80">
                            <p className="line-clamp-2 text-sm sm:text-base">
                                {item.title || "Featured video"}
                            </p>
                            <p className="shrink-0 text-xs uppercase tracking-[0.24em] text-white/55 sm:text-sm">
                                {safeIndex + 1} / {totalItems}
                            </p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
