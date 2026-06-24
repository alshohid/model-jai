"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User2, Loader2, Trophy } from "lucide-react";
import { PlayerInfo } from "@/types/challenge/challengeTypes";
import { toast } from "sonner";
import { useWinnerSelectForChallengeByAdminMutation } from "@/redux/features/challenge/challengeManagement";

interface WinnerSelectModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    challengeId: number;
    challenger: PlayerInfo;
    acceptor: PlayerInfo;
}

export default function WinnerSelectModal({
    open,
    onOpenChange,
    challengeId,
    challenger,
    acceptor,
}: WinnerSelectModalProps) {
    const [selectWinner] =
        useWinnerSelectForChallengeByAdminMutation();
    const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSelectWinner = async (winnerId: number) => {
        setSelectedPlayerId(winnerId);
        setIsSubmitting(true);
        try {
            const response = await selectWinner({
                id: challengeId,
                winner_id: winnerId,
            }).unwrap();
            toast.success(response?.message ?? "Winner selected successfully!");
            onOpenChange(false);
        } catch (error) {
            const err = error as { data?: { message?: string }; message?: string };
            toast.error(
                err?.data?.message ?? err?.message ?? "Failed to select winner"
            );
        } finally {
            setIsSubmitting(false);
            setSelectedPlayerId(null);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="!bg-[#1C1F26] !text-white border-gray-700 max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-white text-xl font-bold flex items-center gap-2">
                        <Trophy className="size-5 text-yellow-400" />
                        Select Winner
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Choose the winner for this challenge
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-3 py-4">
                    {/* Challenger Option */}
                    <button
                        type="button"
                        onClick={() => handleSelectWinner(challenger.id)}
                        disabled={isSubmitting}
                        className={`w-full flex items-center gap-4 p-4 rounded-lg border transition-all ${selectedPlayerId === challenger.id && isSubmitting
                            ? "border-yellow-500 bg-yellow-500/10"
                            : "border-gray-600 hover:border-yellow-500/50 hover:bg-white/5"
                            } disabled:opacity-60 disabled:cursor-not-allowed`}
                    >
                        <div className="size-12 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
                            {challenger.image ? (
                                <img
                                    src={challenger.image}
                                    alt={challenger.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <User2 className="size-6 text-gray-400" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 text-left">
                            <p className="text-white font-medium">
                                {challenger.name}
                            </p>
                            <p className="text-gray-400 text-sm">Challenger</p>
                        </div>
                        {selectedPlayerId === challenger.id && isSubmitting && (
                            <Loader2 className="size-5 animate-spin text-yellow-400" />
                        )}
                    </button>

                    {/* Acceptor Option */}
                    <button
                        type="button"
                        onClick={() => handleSelectWinner(acceptor.id)}
                        disabled={isSubmitting}
                        className={`w-full flex items-center gap-4 p-4 rounded-lg border transition-all ${selectedPlayerId === acceptor.id && isSubmitting
                            ? "border-yellow-500 bg-yellow-500/10"
                            : "border-gray-600 hover:border-yellow-500/50 hover:bg-white/5"
                            } disabled:opacity-60 disabled:cursor-not-allowed`}
                    >
                        <div className="size-12 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
                            {acceptor.image ? (
                                <img
                                    src={acceptor.image}
                                    alt={acceptor.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <User2 className="size-6 text-gray-400" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 text-left">
                            <p className="text-white font-medium">
                                {acceptor.name}
                            </p>
                            <p className="text-gray-400 text-sm">Acceptor</p>
                        </div>
                        {selectedPlayerId === acceptor.id && isSubmitting && (
                            <Loader2 className="size-5 animate-spin text-yellow-400" />
                        )}
                    </button>
                </div>

                <div className="flex justify-end">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        disabled={isSubmitting}
                        className="text-gray-400 hover:text-white hover:bg-white/10"
                    >
                        Cancel
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}