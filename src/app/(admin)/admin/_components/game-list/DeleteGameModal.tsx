/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import AppDialog from "@/shared/components/modal/AppDialog";
import { useDeleteGameListMutation } from "@/redux/features/game/gameListManagement";

export default function DeleteGameModal({ item, open, onClose }: any) {

    const [deleteGame, { isLoading }] =
        useDeleteGameListMutation();

    const handleDelete = async () => {

        await deleteGame(item.id).unwrap();

        onClose();
    };

    return (
        <AppDialog open={open} onOpenChange={onClose} title="Delete Game">

            <div className="space-y-4 py-4">

                <p className="text-white">
                    Are you sure you want to delete <b>{item?.name}</b> ?
                </p>

                <button
                    disabled={isLoading}
                    onClick={handleDelete}
                    className={`w-full h-10 rounded-md ${isLoading ? "bg-gray-500 cursor-not-allowed" : "bg-red-500 cursor-pointer"} text-white`}
                >
                    {isLoading ? "Deleting..." : "Delete"}
                </button>

            </div>

        </AppDialog>
    );
}