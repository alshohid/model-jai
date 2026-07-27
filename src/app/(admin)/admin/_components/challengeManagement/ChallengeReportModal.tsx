/* eslint-disable @next/next/no-img-element */
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
import { User2, Loader2, Trophy, Eye, Calendar, ShieldAlert } from "lucide-react";
import { ChallengeItem } from "@/types/challenge/challengeTypes";
import { toast } from "sonner";
import { useWinnerSelectForChallengeByAdminMutation } from "@/redux/features/challenge/challengeManagement";

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
    const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submissions = challenge.submissions ?? [];

    const handleSelectWinner = async (winnerId: number) => {
        setSelectedPlayerId(winnerId);
        setIsSubmitting(true);
        try {
            const response = await selectWinner({
                id: challenge.id,
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
            <DialogContent className="bg-[#1C1F26]! text-white! border-gray-700 max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-white text-xl font-bold flex items-center gap-2">
                        <Eye className="size-5 text-pink-500" />
                        Challenge Submissions & Reports
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Review submissions from players and declare the final winner for Challenge #{challenge.challenge_no}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Submissions Section */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                            Submitted Evidence
                        </h3>
                        {submissions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-6 border border-gray-700/50 bg-[#15181F] rounded-xl text-gray-500">
                                <ShieldAlert className="size-8 mb-2 text-gray-600" />
                                <p className="text-sm">No evidence has been submitted yet.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {submissions.map((sub, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-col p-4 border border-gray-700 bg-[#15181F] rounded-xl space-y-3"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-full overflow-hidden bg-gray-800 shrink-0">
                                                {sub.user?.image ? (
                                                    <img
                                                        src={sub.user.image}
                                                        alt={sub.user.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <User2 className="size-5 text-gray-500" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white text-sm font-semibold truncate">
                                                    {sub.user?.name}
                                                </p>
                                                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full uppercase mt-0.5 ${
                                                    sub.player_type === "challenger"
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
                                                        className="w-full max-h-48 object-contain cursor-pointer hover:scale-[1.02] transition-transform duration-200"
                                                        onClick={() => window.open(sub.evidence_image!, "_blank")}
                                                    />
                                                    <div className="absolute bottom-2 right-2 bg-black/60 text-[10px] px-2 py-0.5 rounded-md text-gray-300">
                                                        Click to expand
                                                    </div>
                                                </div>
                                            )}

                                            {sub.evidence_video && (
                                                <div className="rounded-lg overflow-hidden border border-gray-700 bg-black/30">
                                                    <video
                                                        src={sub.evidence_video}
                                                        controls
                                                        className="w-full max-h-48"
                                                    />
                                                </div>
                                            )}

                                            {!sub.evidence_image && !sub.evidence_video && (
                                                <div className="h-24 flex items-center justify-center rounded-lg border border-gray-800 bg-black/10 text-xs text-gray-500">
                                                    Text/Proof submission only
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-1.5 text-xs text-gray-500 pt-2 border-t border-gray-800">
                                            <Calendar className="size-3.5" />
                                            <span>
                                                {new Date(sub.created_at).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Winner Selection Section */}
                    <div className="space-y-4 pt-4 border-t border-gray-800">
                        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                            <Trophy className="size-4 text-yellow-500" />
                            Declare Match Winner
                        </h3>
                        <p className="text-xs text-gray-400">
                            Based on the evidence above, select which user wins the challenge and receives the match payout.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Challenger Option */}
                            <button
                                type="button"
                                onClick={() => handleSelectWinner(challenge.challenger.id)}
                                disabled={isSubmitting}
                                className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                                    selectedPlayerId === challenge.challenger.id && isSubmitting
                                        ? "border-yellow-500 bg-yellow-500/10"
                                        : "border-gray-700 hover:border-yellow-500/50 bg-[#15181F] hover:bg-[#1A1E26]"
                                } disabled:opacity-60 disabled:cursor-not-allowed`}
                            >
                                <div className="size-12 rounded-full overflow-hidden bg-gray-800 shrink-0">
                                    {challenge.challenger.image ? (
                                        <img
                                            src={challenge.challenger.image}
                                            alt={challenge.challenger.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <User2 className="size-6 text-gray-500" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-semibold truncate">
                                        {challenge.challenger.name}
                                    </p>
                                    <p className="text-pink-400 text-xs font-semibold">Challenger</p>
                                </div>
                                {selectedPlayerId === challenge.challenger.id && isSubmitting && (
                                    <Loader2 className="size-5 animate-spin text-yellow-500" />
                                )}
                            </button>

                            {/* Acceptor Option */}
                            {challenge.acceptor && (
                                <button
                                    type="button"
                                    onClick={() => handleSelectWinner(challenge.acceptor!.id)}
                                    disabled={isSubmitting}
                                    className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                                        selectedPlayerId === challenge.acceptor.id && isSubmitting
                                            ? "border-yellow-500 bg-yellow-500/10"
                                            : "border-gray-700 hover:border-yellow-500/50 bg-[#15181F] hover:bg-[#1A1E26]"
                                    } disabled:opacity-60 disabled:cursor-not-allowed`}
                                >
                                    <div className="size-12 rounded-full overflow-hidden bg-gray-800 shrink-0">
                                        {challenge.acceptor.image ? (
                                            <img
                                                src={challenge.acceptor.image}
                                                alt={challenge.acceptor.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <User2 className="size-6 text-gray-500" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-semibold truncate">
                                            {challenge.acceptor.name}
                                        </p>
                                        <p className="text-blue-400 text-xs font-semibold">Acceptor</p>
                                    </div>
                                    {selectedPlayerId === challenge.acceptor.id && isSubmitting && (
                                        <Loader2 className="size-5 animate-spin text-yellow-500" />
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-800">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        disabled={isSubmitting}
                        className="text-gray-400 hover:text-white hover:bg-white/10"
                    >
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
