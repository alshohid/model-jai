"use client";

import * as React from "react";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export type ImagePreviewItem = {
    id: string;
    title: string;
    imageSrc: string;
};

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    items: ImagePreviewItem[];
    currentIndex: number;
    onIndexChange: (index: number) => void;
    fallbackSrc?: string;
};

const SWIPE_THRESHOLD_PX = 48;

const navButtonClassName =
    "inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/14 bg-[#120B14]/85 text-white/85 backdrop-blur-xl transition hover:border-[#FF00C8]/35 hover:bg-[#1A101C] hover:text-white sm:size-11";

export default function ImagePreviewDialog({
    open,
    onOpenChange,
    items,
    currentIndex,
    onIndexChange,
    fallbackSrc,
}: Props) {
    const touchStartXRef = React.useRef<number | null>(null);
    const touchStartYRef = React.useRef<number | null>(null);

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

    const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
        const touch = event.changedTouches[0];
        if (!touch) return;

        touchStartXRef.current = touch.clientX;
        touchStartYRef.current = touch.clientY;
    };

    const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
        const touch = event.changedTouches[0];
        const startX = touchStartXRef.current;
        const startY = touchStartYRef.current;

        touchStartXRef.current = null;
        touchStartYRef.current = null;

        if (!touch || startX === null || startY === null || totalItems < 2) {
            return;
        }

        const deltaX = touch.clientX - startX;
        const deltaY = touch.clientY - startY;

        if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) return;
        if (Math.abs(deltaX) <= Math.abs(deltaY)) return;

        if (deltaX < 0) {
            goToNext();
            return;
        }

        goToPrev();
    };

    if (!item) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                showCloseButton={false}
                overlayClassName="bg-black/70 supports-[backdrop-filter]:bg-black/55 backdrop-blur-xl"
                className="w-[calc(100vw-16px)] max-w-[min(94vw,980px)] border-0 bg-transparent p-0 shadow-none"
            >
                <DialogTitle className="sr-only">
                    {item.title || "Image preview"}
                </DialogTitle>

                <div className="relative overflow-hidden rounded-[26px] border border-white/12 bg-[#110B14]/96 shadow-[0_40px_140px_rgba(0,0,0,0.6)] ring-1 ring-[#FF00C8]/15">
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#FF00C8]/10 to-transparent" />

                    <DialogClose asChild>
                        <button
                            type="button"
                            className="absolute right-3 top-3 z-20 inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-white/14 bg-black/55 text-white/85 backdrop-blur-md transition hover:border-white/25 hover:bg-black/75 hover:text-white"
                            aria-label="Close image"
                        >
                            <X className="size-5" />
                        </button>
                    </DialogClose>

                    <div
                        className="relative"
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                    >
                        <div className="relative w-full overflow-hidden bg-[#050507]">
                            <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_52%,rgba(0,0,0,0.35)_100%)]" />

                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                key={`${item.id}-${safeIndex}`}
                                src={item.imageSrc}
                                alt={item.title || "Image preview"}
                                draggable={false}
                                className="max-h-[78dvh] w-full animate-in fade-in-0 zoom-in-95 duration-300 bg-[#050507] object-contain"
                                onError={(event) => {
                                    if (!fallbackSrc) return;
                                    event.currentTarget.onerror = null;
                                    event.currentTarget.src = fallbackSrc;
                                }}
                            />

                            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-20 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />

                            {totalItems > 1 ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={goToPrev}
                                        className={`absolute left-2 top-1/2 z-20 -translate-y-1/2 sm:left-4 ${navButtonClassName}`}
                                        aria-label="Previous image"
                                    >
                                        <ChevronLeft className="size-5" />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={goToNext}
                                        className={`absolute right-2 top-1/2 z-20 -translate-y-1/2 sm:right-4 ${navButtonClassName}`}
                                        aria-label="Next image"
                                    >
                                        <ChevronRight className="size-5" />
                                    </button>
                                </>
                            ) : null}
                        </div>

                        <div className="flex items-end justify-between gap-4 border-t border-white/8 px-3 py-3.5 sm:px-5">
                            <div className="min-w-0 flex-1">
                                <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#FF00C8]/80">
                                    Post gallery
                                </p>
                                <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-white/85 sm:text-[15px]">
                                    {item.title || "Post image"}
                                </p>
                            </div>

                            <div className="flex shrink-0 flex-col items-end gap-2.5">
                                {totalItems > 1 && totalItems <= 12 ? (
                                    <div className="hidden items-center gap-1.5 sm:flex">
                                        {items.map((galleryItem, index) => (
                                            <button
                                                key={galleryItem.id}
                                                type="button"
                                                onClick={() => onIndexChange(index)}
                                                aria-label={`Go to image ${index + 1}`}
                                                className={
                                                    index === safeIndex
                                                        ? "h-1.5 w-5 cursor-pointer rounded-full bg-[#FF00C8] transition"
                                                        : "size-1.5 cursor-pointer rounded-full bg-white/30 transition hover:bg-white/55"
                                                }
                                            />
                                        ))}
                                    </div>
                                ) : null}

                                <span className="rounded-full border border-white/12 bg-white/6 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-white/65 sm:text-xs">
                                    {safeIndex + 1} / {totalItems}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
