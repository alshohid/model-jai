"use client";

import AppDialog from "@/shared/components/modal/AppDialog";
import { Star, Trophy, ShieldCheck, Info, AlertTriangle } from "lucide-react";

interface PromotionalTermsModalProps {
    open: boolean;
    onClose: () => void;
}

export default function PromotionalTermsModal({
    open,
    onClose,
}: PromotionalTermsModalProps) {
    return (
        <AppDialog
            open={open}
            onOpenChange={onClose}
            title="Promotional Terms & Conditions"
            className="w-[calc(100vw-16px)] sm:w-[92vw] max-w-[500px]"
            bodyClassName="px-4 pb-4 sm:px-5 sm:pb-5"
        >
            <div className="py-4 space-y-5">

                {/* Header badge */}
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg bg-[#ff49ff]/10 border border-[#ff49ff]/20">
                    <span className="shrink-0">
                        <Trophy className="h-4 w-4 fill-[#ffb31a] text-[#ffb31a]" />
                    </span>
                    <p className="text-[13px] text-[#ff49ff] font-medium">
                        Special limited-time promotional pricing offer
                    </p>
                </div>

                {/* Price highlight */}
                <div className="rounded-lg bg-white/5 border border-white/10 px-4 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col items-center text-[#ffb31a]">
                            <Trophy className="h-8 w-8 fill-[#ffb31a] drop-shadow-[0_0_8px_rgba(255,179,26,0.7)]" />
                            <Star className="mt-0.5 h-3 w-3 fill-[#ffb31a]" />
                        </div>
                        <div>
                            <p className="text-sm font-bold leading-none text-white">Promotional Price:</p>
                            <div className="mt-1 flex items-end gap-1">
                                <span className="text-3xl font-black leading-none text-[#fff200] [text-shadow:0_0_8px_rgba(255,242,0,0.65)]">
                                    1000
                                </span>
                                <span className="pb-1 text-xs font-black uppercase tracking-[0.08em] text-white">
                                    Points
                                </span>
                            </div>
                            <p className="mt-0.5 text-xs font-medium text-white/86">
                                any user is a winner
                            </p>
                        </div>
                        <Star className="ml-auto mt-auto h-4 w-4 fill-[#ffb31a] text-[#ffb31a]" />
                    </div>
                </div>

                {/* Terms & Conditions */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Info className="h-3.5 w-3.5 text-[#ff49ff]" />
                        <p className="text-[11px] font-semibold uppercase tracking-widest text-white/40">
                            Terms & Conditions
                        </p>
                    </div>
                    <div className="rounded-lg bg-white/5 border border-white/10 px-4 py-3.5 space-y-3">
                        <div className="flex items-start gap-2.5">
                            <span className="shrink-0 mt-0.5 h-1.5 w-1.5 rounded-full bg-[#ff49ff]" />
                            <p className="text-[13px] text-white/80 leading-relaxed">
                                This promotional offer is available for a limited time only and may be withdrawn or modified at any time without prior notice.
                            </p>
                        </div>
                        <div className="flex items-start gap-2.5">
                            <span className="shrink-0 mt-0.5 h-1.5 w-1.5 rounded-full bg-[#ff49ff]" />
                            <p className="text-[13px] text-white/80 leading-relaxed">
                                Each user is eligible for this promotional price offer only once. Subsequent purchases will be charged at the standard rate.
                            </p>
                        </div>
                        <div className="flex items-start gap-2.5">
                            <span className="shrink-0 mt-0.5 h-1.5 w-1.5 rounded-full bg-[#ff49ff]" />
                            <p className="text-[13px] text-white/80 leading-relaxed">
                                Promotional points are non-transferable and cannot be exchanged for cash or other currencies.
                            </p>
                        </div>
                        <div className="flex items-start gap-2.5">
                            <span className="shrink-0 mt-0.5 h-1.5 w-1.5 rounded-full bg-[#ff49ff]" />
                            <p className="text-[13px] text-white/80 leading-relaxed">
                                In case of any abuse or fraudulent activity, ModalJai reserves the right to cancel the promotion and deduct any points awarded.
                            </p>
                        </div>
                        <div className="flex items-start gap-2.5">
                            <span className="shrink-0 mt-0.5 h-1.5 w-1.5 rounded-full bg-[#ff49ff]" />
                            <p className="text-[13px] text-white/80 leading-relaxed">
                                By availing this offer, you agree to all terms and conditions set forth by ModalJai.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Important note */}
                <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-lg bg-[#fff200]/5 border border-[#fff200]/15">
                    <AlertTriangle className="shrink-0 mt-0.5 h-4 w-4 text-[#fff200]" />
                    <p className="text-[12px] text-white/70 leading-relaxed">
                        This offer is valid while supplies last. ModalJai reserves the right to modify or discontinue this promotion at any time.
                    </p>
                </div>

                {/* Divider */}
                <div className="border-t border-white/8" />

                {/* CTA */}
                <button
                    onClick={onClose}
                    className="w-full h-11 rounded-lg font-semibold text-sm tracking-wide transition-all duration-200 bg-[#ff49ff] hover:bg-[#ff6aff] active:scale-[0.98] text-white shadow-[0_0_20px_rgba(255,73,255,0.3)] hover:shadow-[0_0_28px_rgba(255,73,255,0.45)] cursor-pointer"
                >
                    Got it!
                </button>

            </div>
        </AppDialog>
    );
}