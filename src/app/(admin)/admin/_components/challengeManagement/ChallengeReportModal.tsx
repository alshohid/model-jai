/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User2, Loader2, Trophy, Eye, Calendar, ShieldAlert, DollarSign } from "lucide-react";
import { ChallengeItem } from "@/types/challenge/challengeTypes";
import { toast } from "sonner";
import {
    useWinnerSelectForChallengeByAdminMutation,
    useReleasePayoutMutation,
} from "@/redux/features/challenge/challengeManagement";

export interface ChallengeSubmission {
    user: {
        id: number;
        name: string;
        image: string | null;
    };
    player_type: "challenger" | "acceptor";
    evidence_image: string | null;
    evidence_video: string | null;
    created_at: string;
}

interface ChallengeReportModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    challenge: ChallengeItem & {
        submissions?: ChallengeSubmission[];
    };
}

export default function ChallengeReportModal({
    open,
    onOpenChange,
    challenge,
}: ChallengeReportModalProps) {
    const [selectWinner] = useWinnerSelectForChallengeByAdminMutation();
    const [releasePayout] = useReleasePayoutMutation();
    const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isPayoutLoading, setIsPayoutLoading] = useState(false);

    const submissions = challenge.submissions ?? [];
    const hasWinner = challenge.winner_id !== null && challenge.winner_id !== undefined;
    const winnerChanged = hasWinner && selectedPlayerId !== challenge.winner_id;

    useEffect(() => {
        if (open && challenge.winner_id) {
            setSelectedPlayerId(challenge.winner_id);
        } else if (open && !challenge.winner_id) {
            setSelectedPlayerId(null);
        }
    }, [open, challenge.winner_id]);

    const handleSelectWinner = (winnerId: number) => {
        setSelectedPlayerId((prev) => (prev === winnerId ? null : winnerId));
    };

    const handleSubmitWinner = async () => {
        if (!selectedPlayerId) return;
        setIsSubmitting(true);
        try {
            const response = await selectWinner({
                id: challenge.id,
                winner_id: selectedPlayerId,
            }).unwrap();

            toast.success(response?.message ?? "Winner selected successfully!");

        } catch (error) {
            const err = error as { data?: { message?: string }; message?: string };
            toast.error(
                err?.data?.message ?? err?.message ?? "Failed to select winner"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReleasePayout = async () => {
        setIsPayoutLoading(true);
        try {
            const response = await releasePayout({
                id: challenge.id,
            }).unwrap();
            toast.success(response?.message ?? "Payout released successfully!");
            onOpenChange(false);
        } catch (error) {
            const err = error as { data?: { message?: string }; message?: string };
            toast.error(
                err?.data?.message ?? err?.message ?? "Failed to release payout"
            );
        } finally {
            setIsPayoutLoading(false);
        }
    };

    // Determine the winner name for display
    const getWinnerName = () => {
        if (!challenge.winner_id) return null;
        if (challenge.challenger?.id === challenge.winner_id) return challenge.challenger.name;
        if (challenge.acceptor?.id === challenge.winner_id) return challenge.acceptor.name;
        return null;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-[#1C1F26]! text-white! border-gray-700 max-w-sm sm:max-w-2xl w-[95vw] sm:w-full max-h-[90vh] overflow-y-auto px-3 sm:px-6 py-4 sm:py-6">
                <DialogHeader>
                    <DialogTitle className="text-white text-base sm:text-xl font-bold flex items-center gap-2">
                        <Eye className="size-4 sm:size-5 text-pink-500 shrink-0" />
                        <span className="truncate">Challenge Submissions & Reports</span>
                    </DialogTitle>
                    <DialogDescription className="text-gray-400 text-xs sm:text-sm">
                        Review submissions from players and declare the final winner for Challenge #{challenge.challenge_no}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 sm:space-y-6 py-3 sm:py-4">
                    {/* Submissions Section */}
                    <div className="space-y-3 sm:space-y-4">
                        <h3 className="text-[11px] sm:text-sm font-semibold text-gray-300 uppercase tracking-wider">
                            Submitted Evidence
                        </h3>
                        {submissions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-4 sm:p-6 border border-gray-700/50 bg-[#15181F] rounded-xl text-gray-500">
                                <ShieldAlert className="size-6 sm:size-8 mb-2 text-gray-600" />
                                <p className="text-xs sm:text-sm">No evidence has been submitted yet.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                                {submissions.map((sub, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-col p-3 sm:p-4 border border-gray-700 bg-[#15181F] rounded-xl space-y-2 sm:space-y-3"
                                    >
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <div className="size-8 sm:size-10 rounded-full overflow-hidden bg-gray-800 shrink-0">
                                                {sub.user?.image ? (
                                                    <img
                                                        src={sub.user.image}
                                                        alt={sub.user.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <User2 className="size-4 sm:size-5 text-gray-500" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white text-xs sm:text-sm font-semibold truncate">
                                                    {sub.user?.name}
                                                </p>
                                                <span className={`inline-block text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full uppercase mt-0.5 ${sub.player_type === "challenger"
                                                    ? "bg-pink-500/10 text-pink-400 border border-pink-500/20"
                                                    : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                                    }`}>
                                                    {sub.player_type}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Evidence display */}
                                        <div className="flex-1 space-y-2">
                                            {sub.evidence_image && (
                                                <div className="relative group rounded-lg overflow-hidden border border-gray-700 bg-black/30">
                                                    <img
                                                        src={sub.evidence_image}
                                                        alt="Submission Evidence Image"
                                                        className="w-full max-h-32 sm:max-h-48 object-contain cursor-pointer hover:scale-[1.02] transition-transform duration-200"
                                                        onClick={() => window.open(sub.evidence_image!, "_blank")}
                                                    />
                                                    <div className="absolute bottom-1 sm:bottom-2 right-1 sm:right-2 bg-black/60 text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-md text-gray-300">
                                                        Tap to expand
                                                    </div>
                                                </div>
                                            )}

                                            {sub.evidence_video && (
                                                <div className="rounded-lg overflow-hidden border border-gray-700 bg-black/30">
                                                    <video
                                                        src={sub.evidence_video}
                                                        controls
                                                        className="w-full max-h-32 sm:max-h-48"
                                                    />
                                                </div>
                                            )}

                                            {!sub.evidence_image && !sub.evidence_video && (
                                                <div className="h-20 sm:h-24 flex items-center justify-center rounded-lg border border-gray-800 bg-black/10 text-[10px] sm:text-xs text-gray-500">
                                                    Text/Proof submission only
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-gray-500 pt-2 border-t border-gray-800">
                                            <Calendar className="size-3 sm:size-3.5 shrink-0" />
                                            <span className="truncate">
                                                {new Date(sub.created_at).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Winner Selection Section */}
                    <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4 border-t border-gray-800">
                        <h3 className="text-[11px] sm:text-sm font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                            <Trophy className="size-3 sm:size-4 text-yellow-500" />
                            {hasWinner ? "Winner Declared" : "Declare Match Winner"}
                        </h3>
                        <p className="text-[10px] sm:text-xs text-gray-400">
                            {hasWinner
                                ? `Winner has been declared. You can change the winner or release the payout.`
                                : "Based on the evidence above, select which user wins the challenge and receives the match payout."
                            }
                        </p>

                        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3 sm:gap-4">
                            {/* Challenger Option */}
                            <button
                                type="button"
                                onClick={() => handleSelectWinner(challenge.challenger.id)}
                                className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border text-left transition-all ${selectedPlayerId === challenge.challenger.id
                                    ? "border-yellow-500 bg-yellow-500/10"
                                    : "border-gray-700 hover:border-yellow-500/50 bg-[#15181F] hover:bg-[#1A1E26]"
                                    }`}
                            >
                                <div className="size-10 sm:size-12 rounded-full overflow-hidden bg-gray-800 shrink-0">
                                    {challenge.challenger.image ? (
                                        <img
                                            src={challenge.challenger.image}
                                            alt={challenge.challenger.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <User2 className="size-5 sm:size-6 text-gray-500" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white text-sm sm:text-base font-semibold truncate">
                                        {challenge.challenger.name}
                                    </p>
                                    <p className="text-pink-400 text-[10px] sm:text-xs font-semibold">Challenger</p>
                                </div>
                                {selectedPlayerId === challenge.challenger.id && (
                                    <div className="size-5 rounded-full bg-yellow-500 flex items-center justify-center shrink-0">
                                        <svg className="size-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                )}
                            </button>

                            {/* Acceptor Option */}
                            {challenge.acceptor && (
                                <button
                                    type="button"
                                    onClick={() => handleSelectWinner(challenge.acceptor!.id)}
                                    className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border text-left transition-all ${selectedPlayerId === challenge.acceptor.id
                                        ? "border-yellow-500 bg-yellow-500/10"
                                        : "border-gray-700 hover:border-yellow-500/50 bg-[#15181F] hover:bg-[#1A1E26]"
                                        }`}
                                >
                                    <div className="size-10 sm:size-12 rounded-full overflow-hidden bg-gray-800 shrink-0">
                                        {challenge.acceptor.image ? (
                                            <img
                                                src={challenge.acceptor.image}
                                                alt={challenge.acceptor.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <User2 className="size-5 sm:size-6 text-gray-500" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white text-sm sm:text-base font-semibold truncate">
                                            {challenge.acceptor.name}
                                        </p>
                                        <p className="text-blue-400 text-[10px] sm:text-xs font-semibold">Acceptor</p>
                                    </div>
                                    {selectedPlayerId === challenge.acceptor.id && (
                                        <div className="size-5 rounded-full bg-yellow-500 flex items-center justify-center shrink-0">
                                            <svg className="size-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}
                                </button>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                            {/* Submit / Update Winner Button */}
                            <Button
                                type="button"
                                onClick={handleSubmitWinner}
                                disabled={!selectedPlayerId || isSubmitting || (hasWinner && !winnerChanged)}
                                className={`w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all ${selectedPlayerId && !isSubmitting && (!hasWinner || winnerChanged)
                                    ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:from-yellow-400 hover:to-yellow-500 shadow-lg shadow-yellow-500/20"
                                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                                    }`}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2 className="size-3 sm:size-4 animate-spin" />
                                        Submitting...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        <Trophy className="size-3 sm:size-4" />
                                        {hasWinner ? "Update Winner" : "Submit Winner"}
                                    </span>
                                )}
                            </Button>

                            {/* Release Payout Button - only show if winner exists */}
                            {hasWinner && (
                                <Button
                                    type="button"
                                    onClick={handleReleasePayout}
                                    disabled={isPayoutLoading}
                                    className="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-400 hover:to-green-500 shadow-lg shadow-emerald-500/20"
                                >
                                    {isPayoutLoading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <Loader2 className="size-3 sm:size-4 animate-spin" />
                                            Releasing Payout...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            <DollarSign className="size-3 sm:size-4" />
                                            Release Payout
                                        </span>
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-3 sm:pt-4 border-t border-gray-800">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        disabled={isSubmitting || isPayoutLoading}
                        className="text-gray-400 hover:text-white hover:bg-white/10 text-xs sm:text-sm"
                    >
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}