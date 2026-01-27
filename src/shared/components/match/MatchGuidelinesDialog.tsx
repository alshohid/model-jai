"use client";

import { Info } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/shared/lib/utils/cn";

interface MatchGuidelinesProps {
    matchId: string;
    guidelines?: {
        completionRule?: string;
        scoringRule?: string;
        unexpectedEventRule?: string;
        refundPolicy?: string;
    };
    className?: string;
}

export default function MatchGuidelinesDialog({
    matchId,
    guidelines,
    className,
}: MatchGuidelinesProps) {
    const defaultGuidelines = {
        completionRule:
            "This match must be finished completely. The system will count the score or the vote of TikTok to accept the winner player.",
        scoringRule:
            "The winner is determined by counting scores or TikTok votes. The player with the highest score/votes wins.",
        unexpectedEventRule:
            "If something unexpected happens during the match, we will continue the match as it was, so that nothing happened. If somebody reports an issue, the system will hold everybody's money until the match is complete and the winner is realized.",
        refundPolicy:
            "The system may decide to refund everybody because of circumstances beyond our control. All refunds will be processed within 7-10 business days.",
    };

    const finalGuidelines = { ...defaultGuidelines, ...guidelines };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button
                    type="button"
                    className={cn(
                        "inline-flex items-center justify-center",
                        "size-8 md:size-10 rounded-full",
                        "bg-white/10 hover:bg-white/15 border border-white/20",
                        "text-white/80 hover:text-white transition-all",
                        "focus:outline-none focus:ring-2 focus:ring-[#00C3FF]/50",
                        className
                    )}
                    aria-label="View match guidelines"
                >
                    <Info className="size-4 md:size-5" />
                </button>
            </DialogTrigger>
            <DialogContent
                className={cn(
                    "max-w-[90vw] sm:max-w-lg md:max-w-xl",
                    "bg-[#0F0F0F] border-white/10",
                    "text-white"
                )}
            >
                <DialogHeader>
                    <DialogTitle className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                        <Info className="size-5 md:size-6 text-[#00C3FF]" />
                        Match Guidelines
                    </DialogTitle>
                    <DialogDescription className="text-white/70 text-sm">
                        Rules and requirements for this match
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-4 max-h-[60vh] overflow-y-auto custom-scroll">
                    <div className="space-y-3">
                        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                            <h3 className="text-[#00C3FF] font-semibold text-sm md:text-base mb-2">
                                Match Completion
                            </h3>
                            <p className="text-white/80 text-xs md:text-sm leading-relaxed">
                                {finalGuidelines.completionRule}
                            </p>
                        </div>

                        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                            <h3 className="text-[#00C3FF] font-semibold text-sm md:text-base mb-2">
                                Scoring & Winning Criteria
                            </h3>
                            <p className="text-white/80 text-xs md:text-sm leading-relaxed">
                                {finalGuidelines.scoringRule}
                            </p>
                        </div>

                        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                            <h3 className="text-[#00C3FF] font-semibold text-sm md:text-base mb-2">
                                Unexpected Events
                            </h3>
                            <p className="text-white/80 text-xs md:text-sm leading-relaxed">
                                {finalGuidelines.unexpectedEventRule}
                            </p>
                        </div>

                        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                            <h3 className="text-[#00C3FF] font-semibold text-sm md:text-base mb-2">
                                Refund Policy
                            </h3>
                            <p className="text-white/80 text-xs md:text-sm leading-relaxed">
                                {finalGuidelines.refundPolicy}
                            </p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
