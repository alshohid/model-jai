"use client";

import AppDialog from "@/shared/components/modal/AppDialog";

interface MatchRulesModalProps {
    open: boolean;
    onClose: () => void;
    rules: string;
    message?: string;
}

export default function MatchRulesModal({
    open,
    onClose,
    rules,
    message,
}: MatchRulesModalProps) {
    return (
        <AppDialog open={open} onOpenChange={onClose} title="Match Rules">
            <div className="py-4 space-y-5">

                {/* Header badge */}
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg bg-[#FF2EC8]/10 border border-[#FF2EC8]/20">
                    <span className="shrink-0">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF2EC8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                        </svg>
                    </span>
                    <p className="text-[13px] text-[#FF2EC8] font-medium">
                        {message || "You have been selected for a new match!"}
                    </p>
                </div>

                {/* Rules content */}
                <div className="space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-white/40">
                        Match Rules
                    </p>
                    <div className="rounded-lg bg-white/5 border border-white/10 px-4 py-3.5 min-h-[80px]">
                        <p className="text-[14px] text-white/80 leading-relaxed whitespace-pre-wrap">
                            {rules}
                        </p>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-white/8" />

                {/* CTA */}
                <button
                    onClick={onClose}
                    className="w-full h-11 rounded-lg font-semibold text-sm tracking-wide transition-all duration-200 bg-[#FF2EC8] hover:bg-[#ff48d0] active:scale-[0.98] text-white shadow-[0_0_20px_rgba(255,46,200,0.3)] hover:shadow-[0_0_28px_rgba(255,46,200,0.45)] cursor-pointer"
                >
                    Got it!
                </button>

            </div>
        </AppDialog>
    );
}