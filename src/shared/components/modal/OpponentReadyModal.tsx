"use client";


import AppDialog from "@/shared/components/modal/AppDialog";

interface OpponentReadyModalProps {
    open: boolean;
    onClose: () => void;
    message?: string;
}

export default function OpponentReadyModal({
    open,
    onClose,
    message,
}: OpponentReadyModalProps) {
    return (
        <AppDialog open={open} onOpenChange={onClose} title="Opponent Ready!">
            <div className="py-4 space-y-5">
                {/* Header badge */}
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg bg-[#22CAAD]/10 border border-[#22CAAD]/20">
                    <span className="shrink-0">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22CAAD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                    </span>
                    <p className="text-[13px] text-[#22CAAD] font-medium">
                        {message || "Your opponent is ready!"}
                    </p>
                </div>

                {/* Ready info */}
                <div className="space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-white/40">
                        Ready Status
                    </p>
                    <div className="rounded-lg bg-white/5 border border-white/10 px-4 py-3.5">
                        <p className="text-[14px] text-white/80 leading-relaxed">
                            Your opponent has confirmed they are ready. You now have{" "}
                            <span className="text-[#22CAAD] font-semibold">10 minutes</span>{" "}
                            to ready up as well. If you don&apos;t ready up in time, the challenge
                            will expire.
                        </p>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-white/8" />

                {/* CTA */}
                <button
                    onClick={onClose}
                    className="w-full h-11 rounded-lg font-semibold text-sm tracking-wide transition-all duration-200 bg-[#22CAAD] hover:bg-[#2dd4bf] active:scale-[0.98] text-white shadow-[0_0_20px_rgba(34,202,173,0.3)] hover:shadow-[0_0_28px_rgba(34,202,173,0.45)] cursor-pointer"
                >
                    Got it!
                </button>
            </div>
        </AppDialog>
    );
}