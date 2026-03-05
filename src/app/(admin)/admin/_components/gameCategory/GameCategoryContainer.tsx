"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import GameCategoryTable from "./GameCategoryTable";
import CreateCategoryModal from "./CreateCategoryModal";


export default function GameCategoryContainer() {
    const [createOpen, setCreateOpen] = useState(false);

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Game Categories</h2>

                <Button onClick={() => setCreateOpen(true)}>
                    <PlusIcon className="mr-2 size-4" />
                    Add Category
                </Button>
            </div>

            <GameCategoryTable />

            <CreateCategoryModal
                open={createOpen}
                onClose={() => setCreateOpen(false)}
            />
        </div>
    );
}