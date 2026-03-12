/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useMemo, useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import PublicNavbar from "@/app/(public)/_components/publicNavbar/PublicNavbar";
import FooterSection from "@/shared/components/home/FooterSection";
import SupportCard from "@/shared/components/card/SupportCard";
import { cn } from "@/shared/lib/utils/cn";
import { useGetSupportHistoryQuery } from "@/redux/features/support/supportManagement";
import { formateDate, formateTime } from "@/shared/lib/utils/dateFormater";
import { getSafeImageSrc } from "@/shared/lib/utils/imagesrcvalidator";
import AppPagination from "@/app/(admin)/admin/_components/topComponent/AppPagination";

const TABS = [
    { id: "live", label: "Live Now" },
    { id: "unsettled", label: "Unsettled" },
    { id: "settled", label: "Settled" },
    { id: "all", label: "All" },
] as const;

type SupportHistoryTab = (typeof TABS)[number]["id"];

const validTabs: SupportHistoryTab[] = ["live", "unsettled", "settled", "all"];

export default function SupportHistoryPage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const tabFromUrl = searchParams.get("tab") as SupportHistoryTab | null;
    const initialTab = validTabs.includes(tabFromUrl as SupportHistoryTab)
        ? (tabFromUrl as SupportHistoryTab)
        : "live";

    const [activeTab, setActiveTab] = useState<SupportHistoryTab>(initialTab);
    const [page, setPage] = useState(1);
    const limit = 9;

    useEffect(() => {
        const currentTab = searchParams.get("tab") as SupportHistoryTab | null;
        if (currentTab && validTabs.includes(currentTab)) {
            setActiveTab(currentTab);
        }
    }, [searchParams]);

    const handleTabChange = (tab: SupportHistoryTab) => {
        setActiveTab(tab);
        setPage(1);

        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", tab);
        params.set("page", "1");

        router.replace(`${pathname}?${params.toString()}`);
    };

    const { data, isLoading } = useGetSupportHistoryQuery({
        page,
        limit,
        type: activeTab,
    });

    const supports = data?.data ?? [];

    const meta = {
        page: data?.meta?.current_page ?? 1,
        limit: data?.meta?.per_page ?? limit,
        total: data?.meta?.total ?? 0,
        prev: data?.meta?.prev ?? false,
        next: data?.meta?.next ?? false,
    };

    const handlePageChange = (nextPage: number) => {
        setPage(nextPage);

        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", activeTab);
        params.set("page", String(nextPage));

        router.replace(`${pathname}?${params.toString()}`);
    };

    const mappedSupports = useMemo(() => {
        return supports.map((support, index) => {
            const result =
                support.result === "win"
                    ? "win"
                    : support.result === "lose"
                        ? "loss"
                        : undefined;

            return {
                id: `${support.match_id}-${index}`,
                matchId: support.match_id,
                status: activeTab,
                result,
                supporterName: "You",
                playerName: support.player_one?.name,
                amount: Number(support.coin_amount),
                dateText: formateDate(support.match_date),
                timeText: formateTime(support.match_time),
                leftPlayerImg:
                    getSafeImageSrc(support.player_one?.image) ||
                    "/images/home/leftPlayerImg.png",
                rightPlayerImg:
                    getSafeImageSrc(support.player_two?.image) ||
                    "/images/home/rightPlayerImg.png",
            };
        });
    }, [supports, activeTab]);

    return (
        <div className="min-h-screen bg-[#0d0d0d]">
            <PublicNavbar />

            <div className="container sticky top-0 z-10 border-b border-white/10 bg-[#0d0d0d]/95 backdrop-blur-lg">
                <div className="w-full max-w-[100vw] px-4 py-3 sm:px-6">
                    <div className="flex items-center gap-3 mb-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="text-white hover:text-white/80 transition shrink-0"
                            aria-label="Go back"
                        >
                            <ArrowLeft className="size-6" />
                        </button>
                        <h1 className="text-white font-bold text-xl">
                            Support History
                        </h1>
                    </div>

                    <div className="flex gap-1 overflow-x-auto pb-1 min-w-0 -mx-1 px-1">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => handleTabChange(tab.id)}
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

            <div className="container w-full py-6 sm:px-6 min-w-0 overflow-hidden">
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div
                                key={index}
                                className="h-[320px] rounded-[16px] bg-white/10 animate-pulse"
                            />
                        ))}
                    </div>
                ) : mappedSupports.length === 0 ? (
                    <div className="py-12 sm:py-16 text-center">
                        <p className="text-white font-semibold text-base sm:text-lg mb-2 break-words">
                            There are currently no support to display.
                        </p>
                        <p className="text-white/50 text-sm sm:text-base max-w-md mx-auto break-words">
                            Support history will appear here.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                            {mappedSupports.map((support) => (
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
                                    result={support.result}
                                    onWatch={() =>
                                        router.push(
                                            `/live-stream/match/${support.matchId}?platform=tiktok`
                                        )
                                    }
                                />
                            ))}
                        </div>

                        <div className="mt-8">
                            <AppPagination
                                meta={meta}
                                onPageChange={handlePageChange}
                                showSummary={false}
                            />
                        </div>
                    </>
                )}
            </div>

            <FooterSection />
        </div>
    );
}