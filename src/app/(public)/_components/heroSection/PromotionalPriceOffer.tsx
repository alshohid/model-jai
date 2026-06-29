
"use client";

import { useState } from "react";
import { Star, Trophy } from "lucide-react";
import PromotionalTermsModal from "./PromotionalTermsModal";
import { useGetPublicPromotionalOffersQuery } from "@/redux/features/promotinalOffers/promotionalOffers";

export default function PromotionalPriceOffer() {
    const [modalOpen, setModalOpen] = useState(false);
    const { data } = useGetPublicPromotionalOffersQuery();

    return (
        <>
            <div onClick={() => setModalOpen(true)} className="w-[260px] md:w-[317px] mx-auto cursor-pointer">
                <div className="text-[13px] text-center  font-black text-[#fff200] [text-shadow:0_1px_0_#000,0_0_8px_rgba(255,242,0,0.75)]">
                    -Promotional Price offer-
                </div>
                <div className="rounded-[12px] border-2 border-[#ff49ff] bg-black/72 px-4 py-3 text-left">
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col items-center text-[#ffb31a]">
                            <Trophy className="h-12 w-12 fill-[#ffb31a] drop-shadow-[0_0_8px_rgba(255,179,26,0.7)]" />
                            <Star className="mt-0.5 h-4 w-4 fill-[#ffb31a]" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-bold leading-none text-white">Price:</p>
                            <div className="mt-1 flex items-end gap-1">
                                <span className="text-4xl font-black leading-none text-[#fff200] [text-shadow:0_0_8px_rgba(255,242,0,0.65)]">
                                    {data?.prize}
                                </span>
                                <span className="pb-1 text-xs font-black uppercase tracking-[0.08em] text-white">
                                    Points
                                </span>
                            </div>
                            <p className="mt-0.5 text-xs font-medium text-white/86">
                                any user is a winner
                            </p>
                        </div>
                        <Star className="mt-auto h-4 w-4 fill-[#ffb31a] text-[#ffb31a]" />
                    </div>
                </div>

            </div>

            <PromotionalTermsModal
                data={data}
                open={modalOpen}
                onClose={() => setModalOpen(false)}
            />
        </>
    );
}
