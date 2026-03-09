/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import AppDialog from "@/shared/components/modal/AppDialog";
import { useCreateMatchConformationMutation } from "@/redux/features/match/matchManagement";

export default function MatchConfirmationModal({ matchId, open, onClose }: any) {
    const [confirmMatch, { isLoading }] = useCreateMatchConformationMutation();
    const [confirmationStatus, setConfirmationStatus] = useState<number | null>(null);

    const handleConfirm = async () => {
        if (confirmationStatus === null) return;

        try {
            await confirmMatch({
                id: matchId,
                confirmation_status: confirmationStatus
            }).unwrap();

            onClose();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <AppDialog open={open} onOpenChange={onClose} title="Confirm Match Status">
            <div className="space-y-6 py-6">
                <div className="flex gap-6">

                    <button
                        onClick={() => setConfirmationStatus(1)}
                        className={`w-1/2 h-40 rounded-lg ${confirmationStatus === 1 ? " border border-green-500" : "bg-gray-500"} text-white`}
                    >
                        Confirm Match
                    </button>

                    <button
                        onClick={() => setConfirmationStatus(2)}
                        className={`w-1/2 h-40 rounded-lg ${confirmationStatus === 2 ? " border border-red-500" : "bg-gray-500"} text-white`}
                    >
                        Cancel Match
                    </button>
                </div>

                <div className="flex gap-3">
                    <button
                        disabled={isLoading || confirmationStatus === null}
                        onClick={handleConfirm}
                        className="w-full h-11 bg-blue-600 rounded-lg text-white hover:bg-blue-500"
                    >
                        {isLoading ? "Processing..." : "Submit"}
                    </button>
                </div>
            </div>
        </AppDialog>
    );
}