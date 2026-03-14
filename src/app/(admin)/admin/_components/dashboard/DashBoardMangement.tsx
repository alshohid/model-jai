"use client";

import { cn } from "@/shared/lib/utils/cn";
import PrimaryCtaButton from "../reusable/PrimaryCtaButton";
import { FiSearch } from "react-icons/fi";
import EarningsAnalyticsChart from "../dashboardIcons/EarningsAnalyticsChart";
import RecentStreamsCard, { RecentStreamItem } from "./RecentStreamsCard";
import UpComming from "./upComming";
import { useGetRecentMatchDataQuery } from "@/redux/features/dashboard/dashboardManagement";

const DashBoardManagement = () => {
    const { data: recentMatchData, isLoading: isRecentMatchDataLoading } = useGetRecentMatchDataQuery();
    console.log(recentMatchData?.data);
    const recentStreams: RecentStreamItem[] = [
        { id: "1", title: "Match Name", subtitle: "Bundle", amount: "$4500.99", timeAgo: "12 Min Ago" },
        { id: "2", title: "Match Name", subtitle: "Bundle", amount: "$4500.99", timeAgo: "12 Min Ago" },
        { id: "3", title: "Match Name", subtitle: "Bundle", amount: "$4500.99", timeAgo: "12 Min Ago" },
        { id: "4", title: "Match Name", subtitle: "Bundle", amount: "$4500.99", timeAgo: "12 Min Ago" },
    ];

    return (
        <div className="w-full">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 py-6 sm:py-10">
                <form className="flex items-center relative w-full sm:w-[320px] lg:w-[420px]">
                    <input
                        type="text"
                        placeholder="Search"
                        className={cn(
                            "w-full h-10 rounded-[12px]",
                            "bg-white/5 border border-white/10",
                            "text-white/85 placeholder:text-white/40",
                            "pl-10 pr-3 outline-none",
                            "focus:border-[#FF2EC8]/40"
                        )}
                    />
                    <FiSearch className="absolute left-3 text-white/55" />
                </form>

                {/* <PrimaryCtaButton
                    onClick={() => console.log("create new match")}
                    className={cn("h-10 rounded-[14px]", "w-full sm:w-auto", "px-6 sm:px-10")}
                >
                    Create New Match
                </PrimaryCtaButton> */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[8fr_4fr] gap-4">
                <EarningsAnalyticsChart year="2026" />

                <RecentStreamsCard
                    items={recentStreams}
                    className="md:sticky md:top-6"
                    maxHeightClassName="max-h-[420px] md:max-h-[320px] lg:max-h-[400px]"
                />
            </div>
            <div className="py-8">
                <UpComming />
            </div>
        </div>
    );
};

export default DashBoardManagement;
