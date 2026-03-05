"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import GameListTable from "./GameListTable";
import CreateGameModal from "./CreateGameModal";



export default function GamePageContainer() {

    const [createOpen, setCreateOpen] = useState(false);

    return (
        <div>

            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Games</h2>

                <Button onClick={() => setCreateOpen(true)}>
                    <PlusIcon className="mr-2 size-4" />
                    Add Game
                </Button>
            </div>

            <GameListTable />

            <CreateGameModal
                open={createOpen}
                onClose={() => setCreateOpen(false)}
            />

        </div>
    );
}