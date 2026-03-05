/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useDeleteGameCategoryMutation } from "@/redux/features/game/gameCategoryManagement";
import AppDialog from "@/shared/components/modal/AppDialog";


export default function DeleteCategoryModal({ item, open, onClose }: any) {

    const [deleteCategory, { isLoading }] =
        useDeleteGameCategoryMutation();

    const handleDelete = async () => {

        await deleteCategory(item.id).unwrap();
        onClose();
    };

    return (
        <AppDialog open={open} onOpenChange={onClose} title="Delete Category">

            <div className="space-y-4 py-4">

                <p className="text-white">
                    Are you sure you want to delete <b>{item?.name}</b> ?
                </p>

                <button
                    onClick={handleDelete}
                    className="w-full h-10 bg-red-500 rounded-md text-white"
                >
                    {isLoading ? "Deleting..." : "Delete"}
                </button>

            </div>

        </AppDialog>
    );
}