"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import PublicNavbar from "@/app/(public)/_components/publicNavbar/PublicNavbar";
import FooterSection from "@/shared/components/home/FooterSection";
import SupportCard from "@/shared/components/card/SupportCard";
import { cn } from "@/shared/lib/utils/cn";

const TABS = [
    { id: "live", label: "Live Now" },
    { id: "unsettled", label: "Unsettled" },
    { id: "settled", label: "Settled" },
    { id: "all", label: "All" },
] as const;

type Support = {
    id: string;
    status: "live" | "unsettled" | "settled";
    supporterName: string;
    playerName: string;
    amount: number;
    dateText: string;
    timeText: string;
    leftPlayerImg: string;
    rightPlayerImg: string;
};

const MOCK_SUPPORTS: Support[] = [
    {
        id: "1",
        status: "live",
        supporterName: "John Doe",
        playerName: "ShadowR",
        amount: 5000,
        dateText: "November 15, 2024",
        timeText: "2:30 pm",
        leftPlayerImg: "/images/home/leftPlayerImg.png",
        rightPlayerImg: "/images/home/rightPlayerImg.png",
    },
    {
        id: "2",
        status: "live",
        supporterName: "Jane Smith",
        playerName: "Phoenix Force",
        amount: 3500,
        dateText: "November 15, 2024",
        timeText: "1:45 pm",
        leftPlayerImg: "/images/home/leftPlayerImg.png",
        rightPlayerImg: "/images/home/rightPlayerImg.png",
    },
    {
        id: "3",
        status: "unsettled",
        supporterName: "Michael Chen",
        playerName: "ShadowR",
        amount: 8000,
        dateText: "November 14, 2024",
        timeText: "6:15 pm",
        leftPlayerImg: "/images/home/leftPlayerImg.png",
        rightPlayerImg: "/images/home/rightPlayerImg.png",
    },
    {
        id: "4",
        status: "unsettled",
        supporterName: "Sarah Williams",
        playerName: "Phoenix Force",
        amount: 2500,
        dateText: "November 14, 2024",
        timeText: "3:30 pm",
        leftPlayerImg: "/images/home/leftPlayerImg.png",
        rightPlayerImg: "/images/home/rightPlayerImg.png",
    },
    {
        id: "5",
        status: "settled",
        supporterName: "Alex Rodriguez",
        playerName: "ShadowR",
        amount: 12000,
        dateText: "November 13, 2024",
        timeText: "5:00 pm",
        leftPlayerImg: "/images/home/leftPlayerImg.png",
        rightPlayerImg: "/images/home/rightPlayerImg.png",
    },
    {
        id: "6",
        status: "settled",
        supporterName: "Emma Davis",
        playerName: "Phoenix Force",
        amount: 6500,
        dateText: "November 13, 2024",
        timeText: "2:20 pm",
        leftPlayerImg: "/images/home/leftPlayerImg.png",
        rightPlayerImg: "/images/home/rightPlayerImg.png",
    },
    {
        id: "7",
        status: "settled",
        supporterName: "Chris Wilson",
        playerName: "ShadowR",
        amount: 4200,
        dateText: "November 12, 2024",
        timeText: "7:45 pm",
        leftPlayerImg: "/images/home/leftPlayerImg.png",
        rightPlayerImg: "/images/home/rightPlayerImg.png",
    },
];

export default function SupportHistoryPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<(typeof TABS)[number]["id"]>("live");

    // Filter supports based on active tab
    const filteredSupports =
        activeTab === "all"
            ? MOCK_SUPPORTS
            : MOCK_SUPPORTS.filter((s) => s.status === activeTab);

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
            <div className="container w-full  py-6 sm:px-6 min-w-0 overflow-hidden">
                {filteredSupports.length === 0 ? (
                    <div className="py-12 sm:py-16 text-center">
                        <p className="text-white font-semibold text-base sm:text-lg mb-2 wrap-break-word">
                            There are currently no support to display.
                        </p>
                        <p className="text-white/50 text-sm sm:text-base max-w-md mx-auto wrap-break-word">
                            Support that can be cashed out appear here.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                        {filteredSupports.map((support) => (
                            <SupportCard
                                key={support.id}
                                status={support.status}
                                supporterName={support.supporterName}
                                playerName={support.playerName}
                                amount={support.amount}
                                dateText={support.dateText}
                                timeText={support.timeText}
                                leftPlayerImg={support.leftPlayerImg}
                                rightPlayerImg={support.rightPlayerImg}
                                versusImg="/images/home/versus.png"
                            />
                        ))}
                    </div>
                )}
            </div>

            <FooterSection />
        </div>
    );
}
