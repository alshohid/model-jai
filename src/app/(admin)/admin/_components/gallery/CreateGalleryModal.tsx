/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import AppDialog from "@/shared/components/modal/AppDialog";
import { cn } from "@/shared/lib/utils/cn";
import { useCreateGalleryMutation } from "@/redux/features/settings/gallery/galleryManagement";

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function CreateGalleryModal({ open, onClose }: Props) {
    const [createGallery, { isLoading }] = useCreateGalleryMutation();

    const [shortVideo, setShortVideo] = useState<File | null>(null);
    const [shortVideoThumb, setShortVideoThumb] = useState<File | null>(null);
    const [description, setDescription] = useState("");
    const [isFeatured, setIsFeatured] = useState(false);
    const [error, setError] = useState("");

    const videoPreview = useMemo(
        () => (shortVideo ? URL.createObjectURL(shortVideo) : ""),
        [shortVideo]
    );

    const thumbPreview = useMemo(
        () => (shortVideoThumb ? URL.createObjectURL(shortVideoThumb) : ""),
        [shortVideoThumb]
    );

    useEffect(() => {
        return () => {
            if (videoPreview) URL.revokeObjectURL(videoPreview);
            if (thumbPreview) URL.revokeObjectURL(thumbPreview);
        };
    }, [videoPreview, thumbPreview]);

    const resetForm = () => {
        setShortVideo(null);
        setShortVideoThumb(null);
        setDescription("");
        setIsFeatured(false);
        setError("");
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSubmit = async () => {
        if (!shortVideo || !shortVideoThumb || !description.trim()) {
            setError("Video, thumbnail and description are required.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("short_video", shortVideo);
            formData.append("short_video_thumb", shortVideoThumb);
            formData.append("description", description);
            formData.append("is_featured", isFeatured ? "1" : "0");

            await createGallery(formData).unwrap();
            handleClose();
        } catch (err: any) {
            setError(err?.data?.message || "Failed to create gallery.");
        }
    };

    return (
        <AppDialog open={open} onOpenChange={handleClose} title="Create Gallery">
            <div className="space-y-5 py-4">
                {error ? (
                    <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-sm text-red-400">
                        {error}
                    </div>
                ) : null}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-sm text-white/70">Short Video *</label>
                            <input
                                type="file"
                                accept="video/*"
                                onChange={(e) => setShortVideo(e.target.files?.[0] ?? null)}
                                className="w-full rounded-lg bg-[#1F1F23] border border-white/10 text-white file:bg-[#FF2EC8] file:text-white file:border-0 file:px-3 file:py-2 file:mr-3"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm text-white/70">Thumbnail *</label>
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
                                {videoPreview ? (
                                    <video
                                        src={videoPreview}
                                        controls
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-sm text-white/40">No video selected</span>
                                )}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-[#171717] p-4">
                            <p className="text-sm text-white/60 mb-3">Thumbnail Preview</p>
                            <div className="aspect-video w-full overflow-hidden rounded-xl bg-black/40 border border-white/10 flex items-center justify-center">
                                {thumbPreview ? (
                                    <img
                                        src={thumbPreview}
                                        alt="thumbnail preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-sm text-white/40">No thumbnail selected</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 pt-2">
                    <button
                        onClick={handleClose}
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
                        {isLoading ? "Creating..." : "Create Gallery"}
                    </button>
                </div>
            </div>
        </AppDialog>
    );
}