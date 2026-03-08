"use client";

import { ReactNode, useState } from "react";
import MatchListToolbar from "../reusable/MatchListToolbar";
import ReuseAbleTable from "@/shared/UI/reusable/table/ReuseAbleTable";
import AppPagination from "../topComponent/AppPagination";
import { useDeleteGalleryMutation, useGetAllGalleryListQuery } from "@/redux/features/settings/gallery/galleryManagement";
import { IGallery } from "@/types/settings/gallery/galleryManagementTypes";
import CreateGalleryModal from "./CreateGalleryModal";
import ViewGalleryModal from "./ViewGalleryModal";
import EditGalleryModal from "./EditGalleryModal";



export default function GalleryManagementContainer() {

    const [page, setPage] = useState(1);
    const limit = 10;

    const [open, setOpen] = useState(false);
    const [selectedGalleryId, setSelectedGalleryId] = useState<number | null>(null);

    const [viewOpen, setViewOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);

    const { data, isLoading } = useGetAllGalleryListQuery({
        page,
        limit,
    });

    const [deleteGallery] = useDeleteGalleryMutation();

    const galleries: IGallery[] = data?.data ?? [];

    const meta = {
        page: data?.meta?.current_page ?? 1,
        limit: data?.meta?.per_page ?? 10,
        total: data?.meta?.total ?? 0,
        prev: false,
        next: false,
    };

    const handleView = (id: number) => {
        setSelectedGalleryId(id);
        setViewOpen(true);
    };

    const handleEdit = (id: number) => {
        setSelectedGalleryId(id);
        setEditOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this gallery?")) return;

        try {
            await deleteGallery(id).unwrap();
        } catch (error) {
            console.error(error);
        }
    };

    const tableHeader = [
        "Thumbnail",
        "Description",
        "Featured",
        "Created At",
        "Actions",
    ];

    const tableRowDataRenderers: ((item: IGallery, index: number) => ReactNode)[] = [

        (item) => (
            <div className="relative w-14 h-16 overflow-hidden rounded-md border border-white/10">
                <img
                    src={item.short_video_thumb}
                    alt="thumb"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <span className="text-white text-xs font-semibold">▶</span>
                </div>
            </div>

        ),
        (item) => (
            <span className="text-white line-clamp-2 max-w-[300px]">
                {item.description}
            </span>
        ),

        (item) => (
            <span
                className={`px-2 py-1 text-xs rounded-md ${item.is_featured ? "bg-green-600 text-white" : "bg-gray-600 text-white"
                    }`}
            >
                {item.is_featured ? "Featured" : "Normal"}
            </span>
        ),

        (item) => (
            <span className="text-white">
                {new Date(item.created_at).toLocaleDateString()}
            </span>
        ),

        (item) => (
            <div className="flex gap-2">

                <button
                    onClick={() => handleView(item.id)}
                    className="px-3 py-1 text-xs bg-blue-600 rounded-md text-white"
                >
                    View
                </button>

                <button
                    onClick={() => handleEdit(item.id)}
                    className="px-3 py-1 text-xs bg-yellow-500 rounded-md text-black"
                >
                    Edit
                </button>

                <button
                    onClick={() => handleDelete(item.id)}
                    className="px-3 py-1 text-xs bg-red-600 rounded-md text-white"
                >
                    Delete
                </button>

            </div>
        ),
    ];

    return (
        <div>

            <MatchListToolbar
                title="Gallery List"
                ctaLabel="Add Gallery"
                showSelect={false}
                onCreateMatch={() => setOpen(true)}
            />

            <div className="py-10">

                <ReuseAbleTable
                    isLoadings={isLoading}
                    currentItems={galleries}
                    tableHeader={tableHeader}
                    tableRowDataRenderers={tableRowDataRenderers}
                    isBg={false}
                    minTableWidthPx={1200}
                    variant="rank-dark"
                />

                <div className="mt-6">
                    <AppPagination
                        meta={meta}
                        onPageChange={setPage}
                        showSummary={false}
                    />
                </div>

            </div>

            <CreateGalleryModal
                open={open}
                onClose={() => setOpen(false)}
            />

            <ViewGalleryModal
                galleryId={selectedGalleryId}
                open={viewOpen}
                onClose={() => setViewOpen(false)}
            />

            <EditGalleryModal
                galleryId={selectedGalleryId}
                open={editOpen}
                onClose={() => setEditOpen(false)}
            />

        </div>
    );
}