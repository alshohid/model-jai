/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import AppDialog from "@/shared/components/modal/AppDialog";
import { cn } from "@/shared/lib/utils/cn";
import { useUpdateGalleryMutation, useViewSingleGalleryQuery } from "@/redux/features/settings/gallery/galleryManagement";

interface Props {
    galleryId: number | null;
    open: boolean;
    onClose: () => void;
}

function EditGallerySkeleton() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 py-4 animate-pulse">
            <div className="space-y-4">
                <div className="space-y-2">
                    <div className="h-3 w-28 bg-white/20 rounded" />
                    <div className="h-11 w-full bg-white/10 rounded-lg" />
                </div>
                <div className="space-y-2">
                    <div className="h-3 w-28 bg-white/20 rounded" />
                    <div className="h-11 w-full bg-white/10 rounded-lg" />
                </div>
                <div className="space-y-2">
                    <div className="h-3 w-28 bg-white/20 rounded" />
                    <div className="h-28 w-full bg-white/10 rounded-lg" />
                </div>
                <div className="h-5 w-36 bg-white/10 rounded" />
            </div>
            <div className="space-y-4">
                <div className="h-64 w-full bg-white/10 rounded-2xl" />
                <div className="h-52 w-full bg-white/10 rounded-2xl" />
            </div>
        </div>
    );
}

export default function EditGalleryModal({
    galleryId,
    open,
    onClose,
}: Props) {
    const { data, isLoading: isViewLoading } = useViewSingleGalleryQuery(galleryId!, {
        skip: !galleryId || !open,
    });

    const [updateGallery, { isLoading }] = useUpdateGalleryMutation();

    const [shortVideo, setShortVideo] = useState<File | null>(null);
    const [shortVideoThumb, setShortVideoThumb] = useState<File | null>(null);
    const [description, setDescription] = useState("");
    const [isFeatured, setIsFeatured] = useState(false);
    const [error, setError] = useState("");

    const gallery = data?.data;

    useEffect(() => {
        if (gallery) {
            setDescription(gallery.description || "");
            setIsFeatured(Boolean(gallery.is_featured));
            setShortVideo(null);
            setShortVideoThumb(null);
            setError("");
        }
    }, [gallery]);

    const localVideoPreview = useMemo(
        () => (shortVideo ? URL.createObjectURL(shortVideo) : ""),
        [shortVideo]
    );
    const localThumbPreview = useMemo(
        () => (shortVideoThumb ? URL.createObjectURL(shortVideoThumb) : ""),
        [shortVideoThumb]
    );

    useEffect(() => {
        return () => {
            if (localVideoPreview) URL.revokeObjectURL(localVideoPreview);
            if (localThumbPreview) URL.revokeObjectURL(localThumbPreview);
        };
    }, [localVideoPreview, localThumbPreview]);

    const handleSubmit = async () => {
        if (!galleryId || !description.trim()) {
            setError("Description is required.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("description", description);
            formData.append("is_featured", isFeatured ? "1" : "0");

            if (shortVideo) formData.append("short_video", shortVideo);
            if (shortVideoThumb) formData.append("short_video_thumb", shortVideoThumb);

            await updateGallery({
                id: galleryId,
                body: formData,
            }).unwrap();

            onClose();
        } catch (err: any) {
            setError(err?.data?.message || "Failed to update gallery.");
        }
    };

    return (
        <AppDialog open={open} onOpenChange={onClose} title="Edit Gallery">
            {isViewLoading ? (
                <EditGallerySkeleton />
            ) : (
                <div className="space-y-5 py-4">
                    {error ? (
                        <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-sm text-red-400">
                            {error}
                        </div>
                    ) : null}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-sm text-white/70">Replace Video</label>
                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={(e) => setShortVideo(e.target.files?.[0] ?? null)}
                                    className="w-full rounded-lg bg-[#1F1F23] border border-white/10 text-white file:bg-[#FF2EC8] file:text-white file:border-0 file:px-3 file:py-2 file:mr-3"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm text-white/70">Replace Thumbnail</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setShortVideoThumb(e.target.files?.[0] ?? null)}
                                    className="w-full rounded-lg bg-[#1F1F23] border border-white/10 text-white file:bg-[#FF2EC8] file:text-white file:border-0 file:px-3 file:py-2 file:mr-3"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm text-white/70">Description *</label>
                                <textarea
                                    rows={5}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Write gallery description..."
                                    className="w-full rounded-lg bg-[#1F1F23] border border-white/10 text-white placeholder:text-white/35 px-3 py-3 outline-none focus:ring-1 focus:ring-[#FF2EC8]"
                                />
                            </div>

                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isFeatured}
                                    onChange={(e) => setIsFeatured(e.target.checked)}
                                    className="w-4 h-4 accent-[#FF2EC8]"
                                />
                                <span className="text-sm text-white/80">Mark as featured</span>
                            </label>
                        </div>

                        <div className="space-y-4">
                            <div className="rounded-2xl border border-white/10 bg-[#171717] p-4">
                                <p className="text-sm text-white/60 mb-3">Video Preview</p>
                                <div className="aspect-[9/16] w-full overflow-hidden rounded-xl bg-black/40 border border-white/10 flex items-center justify-center">
                                    {localVideoPreview || gallery?.short_video ? (
                                        <video
                                            src={localVideoPreview || gallery?.short_video}
                                            controls
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-sm text-white/40">No video available</span>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-[#171717] p-4">
                                <p className="text-sm text-white/60 mb-3">Thumbnail Preview</p>
                                <div className="aspect-video w-full overflow-hidden rounded-xl bg-black/40 border border-white/10 flex items-center justify-center">
                                    {localThumbPreview || gallery?.short_video_thumb ? (
                                        <img
                                            src={localThumbPreview || gallery?.short_video_thumb}
                                            alt="thumbnail preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-sm text-white/40">No thumbnail available</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={onClose}
                            className="flex-1 h-11 rounded-lg bg-white/10 hover:bg-white/15 text-white"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className={cn(
                                "flex-1 h-11 rounded-lg text-white",
                                isLoading
                                    ? "bg-gray-500 cursor-not-allowed"
                                    : "bg-[#FF2EC8] hover:bg-[#FF2EC8]/90"
                            )}
                        >
                            {isLoading ? "Updating..." : "Update Gallery"}
                        </button>
                    </div>
                </div>
            )}
        </AppDialog>
    );
}