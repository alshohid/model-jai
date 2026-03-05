/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ReactNode, useState } from "react";
import ReuseAbleTable from "@/shared/UI/reusable/table/ReuseAbleTable";
import AppPagination from "../topComponent/AppPagination";
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import { useGetAllGameCategoriesQuery } from "@/redux/features/game/gameCategoryManagement";
import EditCategoryModal from "./EditCategoryModal";
import DeleteCategoryModal from "./DeleteCategoryModal";
import { getSafeImageSrc } from "@/shared/lib/utils/imagesrcvalidator";


export default function GameCategoryTable() {

    const [page, setPage] = useState(1);

    const { data, isLoading } =
        useGetAllGameCategoriesQuery({ page, limit: 10 });

    const [editItem, setEditItem] = useState<any>(null);
    const [deleteItem, setDeleteItem] = useState<any>(null);

    const categories = data?.data ?? [];

    const meta = {
        page: data?.meta?.current_page ?? 1,
        limit: data?.meta?.per_page ?? 10,
        total: data?.meta?.total ?? 0,
        prev: false,
        next: false,
    };

    const tableHeader = ["Image", "Category Name", "Created At", "Actions"];

    const tableRowDataRenderers: ((item: any) => ReactNode)[] = [

        (item) => (
            <Image
                src={getSafeImageSrc(item?.image) || "/images/home/avatar_1.png"}
                alt={item.name}
                width={40}
                height={40}
                className="rounded-md"
            />
        ),

        (item) => <span className="text-white">{item.name}</span>,

        (item) => (
            <span className="text-white/70">
                {new Date(item.created_at).toLocaleDateString()}
            </span>
        ),

        (item) => (
            <div className="flex gap-2">

                <button
                    onClick={() => setEditItem(item)}
                    className="p-2 rounded-md bg-blue-500/20 text-blue-400"
                >
                    <Pencil size={16} />
                </button>

                <button
                    onClick={() => setDeleteItem(item)}
                    className="p-2 rounded-md bg-red-500/20 text-red-400"
                >
                    <Trash2 size={16} />
                </button>

            </div>
        ),
    ];

    return (
        <>
            <ReuseAbleTable
                isLoadings={isLoading}
                currentItems={categories}
                tableHeader={tableHeader}
                tableRowDataRenderers={tableRowDataRenderers}
                variant="rank-dark"
                minTableWidthPx={1000}
            />

            <div className="mt-6">
                <AppPagination meta={meta} onPageChange={setPage} />
            </div>

            <EditCategoryModal
                item={editItem}
                open={!!editItem}
                onClose={() => setEditItem(null)}
            />

            <DeleteCategoryModal
                item={deleteItem}
                open={!!deleteItem}
                onClose={() => setDeleteItem(null)}
            />
        </>
    );
}