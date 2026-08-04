"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import GameCategoryTable from "./GameCategoryTable";
import CreateCategoryModal from "./CreateCategoryModal";
import PrimaryCtaButton from "../reusable/PrimaryCtaButton";


export default function GameCategoryContainer() {
    const [createOpen, setCreateOpen] = useState(false);

    return (
        <div>
            <div className="flex items-center justify-between mb-6 gap-4">
                <h2 className="text-2xl font-bold text-white">Game Categories</h2>

                <PrimaryCtaButton
                    onClick={() => setCreateOpen(true)}
                    className="h-12 sm:h-12 gap-2 rounded-[18px] px-6 sm:px-8 text-sm sm:text-sm"
                >
                    <PlusIcon className="size-4" />
                    Add Category
                </PrimaryCtaButton>
            </div>

            <GameCategoryTable />

            <CreateCategoryModal
                open={createOpen}
                onClose={() => setCreateOpen(false)}
            />
        </div>
    );
}