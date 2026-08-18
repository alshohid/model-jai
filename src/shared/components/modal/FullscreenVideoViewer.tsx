"use client";

import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    ChevronLeft,
    ChevronRight,
    Play,
    Volume2,
    VolumeX,
    X,
} from "lucide-react";
import type { VideoCarouselItem } from "@/shared/UI/reusable/carousel/VideoCarousel";
import { cn } from "@/shared/lib/utils/cn";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    items: VideoCarouselItem[];
    currentIndex: number;
    onIndexChange: (index: number) => void;
};

type VideoSlideProps = {
    item: VideoCarouselItem;
    active: boolean;
    muted: boolean;
    onProgress: (percent: number) => void;
    onEnded: () => void;
    onAutoMute: () => void;
};

const VideoSlide = React.memo(function VideoSlide({
    item,
    active,
    muted,
    onProgress,
    onEnded,
    onAutoMute,
}: VideoSlideProps) {
    const videoRef = React.useRef<HTMLVideoElement | null>(null);
    const [paused, setPaused] = React.useState(false);
    const pausedRef = React.useRef(false);
    const prevActiveRef = React.useRef(active);
    const dragStartRef = React.useRef<{ x: number; y: number; t: number } | null>(null);
    const lastReportRef = React.useRef(-1);

    const play = React.useCallback(() => {
        const video = videoRef.current;
        if (!video) return;

        video.muted = muted;

        const promise = video.play();
        promise?.catch(() => {
            if (muted) return;

            // Autoplay with sound was blocked by the browser -> fall back to muted.
            video.muted = true;
            onAutoMute();
            void video.play().catch(() => {});
        });
    }, [muted, onAutoMute]);

    React.useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (active) {
            if (!prevActiveRef.current) {
                // Slide just became active -> start over.
                video.currentTime = 0;
                pausedRef.current = false;
                setPaused(false);
            }

            if (!pausedRef.current) {
                play();
            }
        } else {
            video.pause();
        }

        prevActiveRef.current = active;
    }, [active, play]);
    const togglePlay = React.useCallback(() => {
        const video = videoRef.current;
        if (!video) return;

        if (video.paused) {
            pausedRef.current = false;
            setPaused(false);
            void video.play().catch(() => {});
        } else {
            pausedRef.current = true;
            setPaused(true);
            video.pause();
        }
    }, []);

    const handleTimeUpdate = React.useCallback(() => {
        const video = videoRef.current;
        if (!video || !video.duration || !Number.isFinite(video.duration)) return;

        const percent = Math.min(100, (video.currentTime / video.duration) * 100);
        if (Math.abs(percent - lastReportRef.current) < 1) return;

        lastReportRef.current = percent;
        onProgress(percent);
    }, [onProgress]);

    const handleLoadedMetadata = React.useCallback(() => {
        lastReportRef.current = -1;
    }, []);

    const handlePointerDown = React.useCallback((event: React.PointerEvent) => {
        dragStartRef.current = {
            x: event.clientX,
            y: event.clientY,
            t: performance.now(),
        };
    }, []);

    const handlePointerUp = React.useCallback(
        (event: React.PointerEvent) => {
            const start = dragStartRef.current;
            dragStartRef.current = null;
            if (!start) return;

            const distance = Math.hypot(
                event.clientX - start.x,
                event.clientY - start.y
            );
            const elapsed = performance.now() - start.t;

            // Only treat as a tap when the pointer barely moved (not a swipe/drag).
            if (distance > 12 || elapsed > 400) return;

            togglePlay();
        },
        [togglePlay]
    );

    return (
        <div
            className="relative h-full w-full shrink-0 grow-0 basis-full select-none"
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
        >
            <video
                ref={videoRef}
                src={item.videoSrc}
                poster={item.posterSrc || "/images/home/cat_1.png"}
                className="size-full bg-black object-cover"
                muted={muted}
                playsInline
                preload={active ? "auto" : "metadata"}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={onEnded}
            />

            {paused ? (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <span className="flex size-20 items-center justify-center rounded-full bg-black/55 backdrop-blur-md">
                        <Play className="ml-1 size-9 fill-white text-white" />
                    </span>
                </div>
            ) : null}
        </div>
    );
});

export default function FullscreenVideoViewer({
    open,
    onOpenChange,
    items,
    currentIndex,
    onIndexChange,
}: Props) {
    const totalItems = items.length;
    const safeIndex =
        totalItems > 0 ? Math.min(Math.max(currentIndex, 0), totalItems - 1) : 0;
    const item = items[safeIndex] ?? null;

    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: "start",
        containScroll: false,
        loop: false,
    });

    const [activeProgress, setActiveProgress] = React.useState(0);
    const [muted, setMuted] = React.useState(true);
    const [isReady, setIsReady] = React.useState(false);
    const [canPrev, setCanPrev] = React.useState(false);
    const [canNext, setCanNext] = React.useState(false);
    const initRef = React.useRef(false);

    // Jump straight to the requested video whenever the dialog opens.
    React.useEffect(() => {
        if (!open) {
            initRef.current = false;
            return;
        }

        if (!emblaApi || initRef.current) return;

        initRef.current = true;
        setActiveProgress(0);
        emblaApi.scrollTo(safeIndex, true);

        const rafId = window.requestAnimationFrame(() => setIsReady(true));
        return () => window.cancelAnimationFrame(rafId);
    }, [open, emblaApi, safeIndex]);

    // Sync the active slide index back to the parent whenever it changes.
    React.useEffect(() => {
        if (!emblaApi) return;

        const handleSelect = () => {
            onIndexChange(emblaApi.selectedScrollSnap());
        };

        emblaApi.on("select", handleSelect);

        return () => {
            emblaApi.off("select", handleSelect);
        };
    }, [emblaApi, onIndexChange]);

    // Track whether prev/next is available (for chevron buttons).
    React.useEffect(() => {
        if (!emblaApi) return;

        const update = () => {
            setCanPrev(emblaApi.canScrollPrev());
            setCanNext(emblaApi.canScrollNext());
        };

        update();
        emblaApi.on("select", update);
        emblaApi.on("reInit", update);

        return () => {
            emblaApi.off("select", update);
            emblaApi.off("reInit", update);
        };
    }, [emblaApi]);

    // Reset the active progress bar whenever the slide changes.
    React.useEffect(() => {
        setActiveProgress(0);
    }, [safeIndex]);

    const goToPrev = React.useCallback(() => {
        if (totalItems < 2) return;
        emblaApi?.scrollPrev();
    }, [emblaApi, totalItems]);

    const goToNext = React.useCallback(() => {
        if (totalItems < 2) return;
        emblaApi?.scrollNext();
    }, [emblaApi, totalItems]);

    const handleAutoMute = React.useCallback(() => {
        setMuted(true);
    }, []);

    // Keyboard navigation (arrow keys).
    React.useEffect(() => {
        if (!open || totalItems < 2) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "ArrowLeft") {
                event.preventDefault();
                goToPrev();
            } else if (event.key === "ArrowRight") {
                event.preventDefault();
                goToNext();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [open, totalItems, goToPrev, goToNext]);

    const progressFor = (index: number) => {
        if (index < safeIndex) return 100;
        if (index > safeIndex) return 0;
        return activeProgress;
    };

    if (totalItems === 0) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                showCloseButton={false}
                overlayClassName="z-[200] bg-black/95 backdrop-blur-sm"
                className={cn(
                    "z-[200]",
                    "inset-0 h-dvh w-full max-w-none sm:max-w-none",
                    "translate-x-0 translate-y-0",
                    "overflow-hidden rounded-none border-0 bg-black p-0 shadow-none"
                )}
            >
                <DialogTitle className="sr-only">Video player</DialogTitle>



                <div
                    data-lenis-prevent
                    data-lenis-prevent-wheel
                    className={cn(
                        "relative h-full w-full bg-black transition-opacity duration-300",
                        isReady ? "opacity-100" : "opacity-0"
                    )}
                >
                    {/* Story-style progress bars */}
                    <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex gap-1.5 px-4 pt-[max(env(safe-area-inset-top),0.9rem)]">
                        {items.map((video, index) => (
                            <div
                                key={`${video.id}-${index}`}
                                className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/25"
                            >
                                <div
                                    className="h-full rounded-full bg-white transition-[width] duration-200 ease-linear"
                                    style={{ width: `${progressFor(index)}%` }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Embla swipe viewport (drag / swipe to change video) */}
                    <div className="h-full w-full overflow-hidden" ref={emblaRef}>
                        <div className="flex h-full">
                            {items.map((video, index) => (
                                <VideoSlide
                                    key={`${video.id}-${index}`}
                                    item={video}
                                    active={index === safeIndex}
                                    muted={muted}
                                    onProgress={setActiveProgress}
                                    onEnded={goToNext}
                                    onAutoMute={handleAutoMute}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Top-right controls */}
                    <div className="absolute right-4 top-[max(env(safe-area-inset-top),0.75rem)] z-30 flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setMuted((value) => !value)}
                            className="inline-flex size-10 items-center justify-center rounded-full border border-white/12 bg-black/55 text-white/85 backdrop-blur-md transition hover:bg-black/70 hover:text-white"
                            aria-label={muted ? "Unmute video" : "Mute video"}
                        >
                            {muted ? (
                                <VolumeX className="size-5" />
                            ) : (
                                <Volume2 className="size-5" />
                            )}
                        </button>

                        <DialogClose asChild>
                            <button
                                type="button"
                                className="inline-flex size-10 items-center justify-center rounded-full border border-white/12 bg-black/55 text-white/85 backdrop-blur-md transition hover:bg-black/70 hover:text-white"
                                aria-label="Close video"
                            >
                                <X className="size-5" />
                            </button>
                        </DialogClose>
                    </div>

                    {/* Desktop chevrons (mobile uses swipe) */}
                    {totalItems > 1 ? (
                        <>
                            <button
                                type="button"
                                onClick={goToPrev}
                                disabled={!canPrev}
                                className="absolute left-4 top-1/2 z-30 hidden -translate-y-1/2 items-center justify-center rounded-full border border-white/12 bg-black/55 p-3 text-white/85 backdrop-blur-md transition hover:bg-black/70 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 sm:inline-flex"
                                aria-label="Previous video"
                            >
                                <ChevronLeft className="size-6" />
                            </button>

                            <button
                                type="button"
                                onClick={goToNext}
                                disabled={!canNext}
                                className="absolute right-4 top-1/2 z-30 hidden -translate-y-1/2 items-center justify-center rounded-full border border-white/12 bg-black/55 p-3 text-white/85 backdrop-blur-md transition hover:bg-black/70 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 sm:inline-flex"
                                aria-label="Next video"
                            >
                                <ChevronRight className="size-6" />
                            </button>
                        </>
                    ) : null}

                    {/* Bottom info */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex items-end justify-between gap-4 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-5 pb-[max(env(safe-area-inset-bottom),1rem)] pt-16">
                        <p className="line-clamp-2 text-sm font-medium text-white/90 sm:text-base">
                            {item?.title || "Featured video"}
                        </p>
                        <p className="shrink-0 text-xs uppercase tracking-[0.24em] text-white/60 sm:text-sm">
                            {safeIndex + 1} / {totalItems}
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

