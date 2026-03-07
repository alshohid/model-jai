/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import AppDialog from "@/shared/components/modal/AppDialog";
import {
    useCreateMatchConformationMutation,
    useGetSelectedTwoPlayerByMatchIdQuery
} from "@/redux/features/match/matchManagement";
import { useState } from "react";

export default function WinnerSelectModal({ matchId, open, onClose }: any) {

    const { data, isLoading } =
        useGetSelectedTwoPlayerByMatchIdQuery(matchId, {
            skip: !matchId || !open
        });

    const [confirmMatch, { isLoading: confirmLoading }] =
        useCreateMatchConformationMutation();

    const [selectedWinner, setSelectedWinner] = useState<number | null>(null);

    const handleConfirm = async (status: number) => {

        try {

            await confirmMatch({
                id: matchId,
                confirmation_status: status
            }).unwrap();

            onClose();

        } catch (err) {
            console.error(err);
        }

    };

    const p1 = data?.data?.player_one;
    const p2 = data?.data?.player_two;

    return (
        <AppDialog open={open} onOpenChange={onClose} title="Select Match Result">

            <div className="py-6 space-y-6">

                {isLoading ? (
                    <div className="text-white text-center">Loading players...</div>
                ) : (

                    <div className="grid grid-cols-2 gap-6">

                        {/* Player 1 */}
                        <div
                            onClick={() => setSelectedWinner(p1?.id)}
                            className={`cursor-pointer border rounded-xl p-6 text-center transition 
              ${selectedWinner === p1?.id
                                    ? "border-green-500 bg-green-500/10"
                                    : "border-white/10 bg-[#1F1F23]"
                                }`}
                        >
                            <div className="text-lg font-semibold text-white">
                                {p1?.name}
                            </div>

                            {selectedWinner === p1?.id && (
                                <div className="text-green-400 text-sm mt-2">
                                    Selected Winner
                                </div>
                            )}
                        </div>

                        {/* Player 2 */}
                        <div
                            onClick={() => setSelectedWinner(p2?.id)}
                            className={`cursor-pointer border rounded-xl p-6 text-center transition 
              ${selectedWinner === p2?.id
                                    ? "border-green-500 bg-green-500/10"
                                    : "border-white/10 bg-[#1F1F23]"
                                }`}
                        >
                            <div className="text-lg font-semibold text-white">
                                {p2?.name}
                            </div>

                            {selectedWinner === p2?.id && (
                                <div className="text-green-400 text-sm mt-2">
                                    Selected Winner
                                </div>
                            )}
                        </div>

                    </div>
                )}

                {/* Buttons */}

                <div className="flex gap-3">

                    <button
                        disabled={!selectedWinner || confirmLoading}
                        onClick={() => handleConfirm(1)}
                        className="flex-1 h-11 bg-green-600 rounded-lg text-white hover:bg-green-500"
                    >
                        Confirm Winner
                    </button>

                    <button
                        disabled={confirmLoading}
                        onClick={() => handleConfirm(2)}
                        className="flex-1 h-11 bg-red-600 rounded-lg text-white hover:bg-red-500"
                    >
                        Match Cancel
                    </button>

                </div>

            </div>

        </AppDialog>
    );
}