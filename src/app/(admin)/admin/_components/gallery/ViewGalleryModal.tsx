/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useViewSingleGalleryQuery } from "@/redux/features/settings/gallery/galleryManagement";
import AppDialog from "@/shared/components/modal/AppDialog";
import { cn } from "@/shared/lib/utils/cn";

interface Props {
    galleryId: number | null;
    open: boolean;
    onClose: () => void;
}

function ViewGallerySkeleton() {
    return (
        <div className="space-y-5 py-4 animate-pulse">
            <div className="h-72 w-full bg-white/10 rounded-2xl" />
            <div className="h-48 w-full bg-white/10 rounded-2xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="rounded-lg bg-white/5 p-4 space-y-2">
                        <div className="h-3 w-24 bg-white/20 rounded" />
                        <div className="h-4 w-full bg-white/10 rounded" />
                    </div>
                ))}
            </div>
        </div>
    );
}

function InfoCard({
    label,
    value,
    className,
}: {
    label: string;
    value: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={cn("rounded-lg bg-white/5 p-4", className)}>
            <p className="text-sm text-white/55 mb-1">{label}</p>
            <div className="text-white truncate">{value}</div>
        </div>
    );
}

export default function ViewGalleryModal({
    galleryId,
    open,
    onClose,
}: Props) {
    const { data, isLoading } = useViewSingleGalleryQuery(galleryId!, {
        skip: !galleryId || !open,
    });

    const gallery = data?.data;

    return (
        <AppDialog open={open} onOpenChange={onClose} title="Gallery Details">
            {isLoading ? (
                <ViewGallerySkeleton />
            ) : (
                <div className="space-y-5 py-4">
                    <div className="rounded-2xl border border-white/10 bg-[#171717] p-4">
                        <p className="text-sm text-white/60 mb-3">Video Preview</p>
                        <div className="aspect-[9/16] w-full overflow-hidden rounded-xl bg-black/40 border border-white/10">
                            {gallery?.short_video ? (
                                <video
                                    src={gallery.short_video}
                                    controls
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="h-full flex items-center justify-center text-white/40">
                                    No video found
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-[#171717] p-4">
                        <p className="text-sm text-white/60 mb-3">Thumbnail Preview</p>
                        <div className="aspect-video w-full overflow-hidden rounded-xl bg-black/40 border border-white/10">
                            {gallery?.short_video_thumb ? (
                                <img
                                    src={gallery.short_video_thumb}
                                    alt="gallery thumbnail"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="h-full flex items-center justify-center text-white/40">
                                    No thumbnail found
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoCard
                            label="Featured"
                            value={
                                <span
                                    className={cn(
                                        "inline-flex px-2.5 py-1 rounded-md text-xs font-medium",
                                        gallery?.is_featured
                                            ? "bg-green-600 text-white"
                                            : "bg-gray-600 text-white"
                                    )}
                                >
                                    {gallery?.is_featured ? "Featured" : "Normal"}
                                </span>
                            }
                        />

                        <InfoCard
                            label="Created At"
                            value={gallery?.created_at || "-"}
                        />

                        <InfoCard
                            label="Description"
                            value={gallery?.description || "-"}
                            className="md:col-span-2"
                        />
                    </div>
                </div>
            )}
        </AppDialog>
    );
}