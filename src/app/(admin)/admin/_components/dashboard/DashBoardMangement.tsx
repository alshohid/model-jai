"use client";

import { cn } from "@/shared/lib/utils/cn";
import { FiSearch } from "react-icons/fi";
import EarningsAnalyticsChart from "../dashboardIcons/EarningsAnalyticsChart";
import RecentStreamsCard, { RecentStreamItem } from "./RecentStreamsCard";
import UpComming from "./upComming";
import { useGetRecentMatchDataQuery } from "@/redux/features/dashboard/dashboardManagement";

const DashBoardManagement = () => {
    const { data: recentMatchData, isLoading: isRecentMatchDataLoading } = useGetRecentMatchDataQuery();
    const recentStreams: RecentStreamItem[] = (recentMatchData?.data || []).map((item) => ({
        id: Number(item?.match_no) || 0,
        title: String(item?.match_no || ""),
        subtitle: "Bundle",
        amount: String(item?.total_earnings || "0"),
        timeAgo: String(item?.end_time || ""),
    }));
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

            </div>

            <div className="grid grid-cols-1 md:grid-cols-[8fr_4fr] gap-4">
                <EarningsAnalyticsChart />

                <RecentStreamsCard
                    items={recentStreams}
                    isLoading={isRecentMatchDataLoading}
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
