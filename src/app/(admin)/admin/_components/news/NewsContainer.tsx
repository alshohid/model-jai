"use client";

import { ReactNode, useState } from "react";
import MatchListToolbar from "../reusable/MatchListToolbar";
import ReuseAbleTable from "@/shared/UI/reusable/table/ReuseAbleTable";
import AppPagination from "../topComponent/AppPagination";

import {
    useDeleteNewsMutation,
    useGetAllNewsListQuery,
} from "@/redux/features/settings/news/newsManagement";

import { INews } from "@/types/settings/news/newsManagementTypes";
import CreateNewsModal from "./CreateNewsModal";
import ViewNewsModal from "./ViewNewsModal";
import EditNewsModal from "./EditNewsModal";



export default function NewsContainer() {

    const [page, setPage] = useState(1);
    const limit = 10;

    const [open, setOpen] = useState(false);
    const [selectedNewsId, setSelectedNewsId] = useState<number | null>(null);
    const [viewOpen, setViewOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);

    const { data, isLoading } = useGetAllNewsListQuery({
        page,
        limit,
    });

    const [deleteNews] = useDeleteNewsMutation();

    const newsList: INews[] = data?.data ?? [];

    const meta = {
        page: data?.meta?.current_page ?? 1,
        limit: data?.meta?.per_page ?? 10,
        total: data?.meta?.total ?? 0,
        prev: false,
        next: false,
    };

    const handleView = (id: number) => {
        setSelectedNewsId(id);
        setViewOpen(true);
    };

    const handleEdit = (id: number) => {
        setSelectedNewsId(id);
        setEditOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this news?")) return;

        try {
            await deleteNews(id).unwrap();
        } catch (err) {
            console.error(err);
        }
    };

    const tableHeader = [
        "Image",
        "Title",
        "Status",
        "Featured",
        "Created",
        "Actions",
    ];

    const tableRowDataRenderers: ((item: INews, index: number) => ReactNode)[] = [

        (item) => (
            <img
                src={item.image ?? "/images/home/avatar_1.png"}
                className="w-12 h-12 rounded-md object-cover"
            />
        ),

        (item) => (
            <span className="text-white font-medium">
                {item.title}
            </span>
        ),

        (item) => (
            <span
                className={`px-2 py-1 text-xs rounded-md ${item.status === "published"
                    ? "bg-green-600 text-white"
                    : "bg-yellow-500 text-black"
                    }`}
            >
                {item.status}
            </span>
        ),

        (item) => (
            <span
                className={`px-2 py-1 text-xs rounded-md ${item.is_featured
                    ? "bg-purple-600 text-white"
                    : "bg-gray-500 text-white"
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
                title="News List"
                ctaLabel="Add News"
                onCreateMatch={() => setOpen(true)}
                showSelect={false}
            />

            <div className="py-10">

                <ReuseAbleTable
                    isLoadings={isLoading}
                    currentItems={newsList}
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

            <CreateNewsModal open={open} onClose={() => setOpen(false)} />

            <ViewNewsModal
                newsId={selectedNewsId}
                open={viewOpen}
                onClose={() => setViewOpen(false)}
            />

            <EditNewsModal
                newsId={selectedNewsId}
                open={editOpen}
                onClose={() => setEditOpen(false)}
            />

        </div>
    );
}