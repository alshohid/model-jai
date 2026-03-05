/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ReactNode, useState } from "react";
import ReuseAbleTable from "@/shared/UI/reusable/table/ReuseAbleTable";
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";

import {
    useGetAllGameListQuery
} from "@/redux/features/game/gameListManagement";
import AppPagination from "../topComponent/AppPagination";
import EditGameModal from "./EditGameModal";
import DeleteGameModal from "./DeleteGameModal";



export default function GameListTable() {

    const [page, setPage] = useState(1);

    const { data, isLoading } =
        useGetAllGameListQuery({ page, limit: 10 });

    const [editItem, setEditItem] = useState<any>(null);
    const [deleteItem, setDeleteItem] = useState<any>(null);

    const games = data?.data ?? [];

    const tableHeader = [
        "Image",
        "Game Name",
        "Category",
        "Created",
        "Actions"
    ];

    const tableRowDataRenderers: ((item: any) => ReactNode)[] = [

        (item) => (
            <Image
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${item.image}`}
                alt={item.name}
                width={40}
                height={40}
                className="rounded-md"
                unoptimized
            />
        ),

        (item) => <span className="text-white">{item.name}</span>,

        (item) => <span className="text-white/70">{item.category?.name}</span>,

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
                currentItems={games}
                tableHeader={tableHeader}
                tableRowDataRenderers={tableRowDataRenderers}
                variant="rank-dark"
                minTableWidthPx={1100}
            />

            <div className="mt-6">
                <AppPagination
                    meta={{
                        page: 1,
                        limit: 10,
                        total: games.length,
                        prev: false,
                        next: false,
                    }}
                    onPageChange={setPage}
                    showSummary={false}
                />
            </div>

            <EditGameModal
                item={editItem}
                open={!!editItem}
                onClose={() => setEditItem(null)}
            />

            <DeleteGameModal
                item={deleteItem}
                open={!!deleteItem}
                onClose={() => setDeleteItem(null)}
            />
        </>
    );
}