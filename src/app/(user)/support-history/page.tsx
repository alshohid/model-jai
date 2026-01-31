"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import PublicNavbar from "@/app/(public)/_components/publicNavbar/PublicNavbar";
import FooterSection from "@/shared/components/home/FooterSection";
import { cn } from "@/shared/lib/utils/cn";

const TABS = [
    { id: "live", label: "Live Now" },
    { id: "unsettled", label: "Unsettled" },
    { id: "settled", label: "Settled" },
    { id: "all", label: "All" },
] as const;

export default function SupportHistoryPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<(typeof TABS)[number]["id"]>("live");

    // TODO: Replace with real data from API
    const supports: unknown[] = [];

    return (
        <div className="min-h-screen bg-[#0d0d0d]">
            <PublicNavbar />

            {/* Header */}
            <div className="sticky top-0 z-10 border-b border-white/10 bg-[#0d0d0d]/95 backdrop-blur-lg">
                <div className="container w-full md:container max-w-[100vw] px-4 py-3 sm:px-6">
                    <div className="flex items-center gap-3 mb-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="text-white hover:text-white/80 transition shrink-0"
                            aria-label="Go back"
                        >
                            <ArrowLeft className="size-6" />
                        </button>
                        <h1 className="text-white font-bold text-xl">Support History</h1>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 overflow-x-auto pb-1 min-w-0 -mx-1 px-1">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "shrink-0 px-4 py-2.5 rounded-lg text-sm font-medium transition",
                                    activeTab === tab.id
                                        ? "bg-white/15 text-white"
                                        : "text-white/60 hover:text-white hover:bg-white/5"
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container w-full max-w-[100vw] px-4 py-6 sm:px-6 min-w-0 overflow-hidden">
                {supports.length === 0 ? (
                    <div className="py-12 sm:py-16 text-center">
                        <p className="text-white font-semibold text-base sm:text-lg mb-2 wrap-break-word">
                            There are currently no bets to display.
                        </p>
                        <p className="text-white/50 text-sm sm:text-base max-w-md mx-auto wrap-break-word">
                            Bets that can be cashed out appear here.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {/* TODO: List support/bet cards when data exists */}
                    </div>
                )}
            </div>

            <FooterSection />
        </div>
    );
}
