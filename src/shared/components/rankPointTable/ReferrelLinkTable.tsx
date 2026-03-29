/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ReactNode, useMemo, useState } from "react";
import ReuseAbleTable from "@/shared/UI/reusable/table/ReuseAbleTable";
import LiveSectionHeader from "@/app/(auth)/_components/watchLive/LiveSectionHeader";
import { useGetReferralLinkUsedUserQuery } from "@/redux/features/user/userManagement";


type RankRowItem = {
    id: number;
    rankNo: string;
    name: string;
    matchPoints: string;
};

const LOAD_MORE_STEP = 10;

const ReferrelLinkTable = () => {
    const [limit, setLimit] = useState(LOAD_MORE_STEP);

    const { data, isLoading, isFetching, isError, error } =
        useGetReferralLinkUsedUserQuery({
            page: 1,
            limit,
        });

    const tableHeader = [
        "Rank No",
        "Name",
        "Range Point Match Support From Highest to Lowest",
    ];

    const currentItems: RankRowItem[] = useMemo(() => {
        return (data?.data ?? []).map((item, index) => ({
            id: index + 1,
            rankNo: item.rank_no,
            name: item.user_name,
            matchPoints:
                item.range_points && item.range_points.length > 0
                    ? item.range_points.map((point) => `${point} pt`).join(", ")
                    : "N/A",
        }));
    }, [data]);

    const tableRowDataRenderers: ((
        item: RankRowItem,
        index: number
    ) => ReactNode)[] = [
            (item) => <span className="text-[#FFFFFF]">{item.rankNo}</span>,
            (item) => <span className="text-[#FFFFFF]">{item.name}</span>,
            (item) => <span className="text-[#FFFFFF]">{item.matchPoints}</span>,
        ];

    const hasMore = Boolean(data?.meta?.next);

    const handleLoadMore = () => {
        if (!hasMore || isFetching) return;
        setLimit((prev) => prev + LOAD_MORE_STEP);
    };



    return (
        <div className="container py-8 md:py-10 lg:py-15 xl:py-20">
            <LiveSectionHeader
                title="Referral Link Used By"
                className="mb-8 md:mb-10 tracking-wide text-[40px] md:text-[48px]"
            />

            {isError ? (
                <div className="text-red-500">
                    {(error as any)?.data?.message || "Something went wrong"}
                </div>
            ) : (
                <>
                    <ReuseAbleTable
                        isLoadings={isLoading}
                        currentItems={currentItems}
                        tableHeader={tableHeader}
                        tableRowDataRenderers={tableRowDataRenderers}
                        isBg={false}
                        minTableWidthPx={1320}
                        variant="rank-dark"
                    />

                    <div className="mt-6 flex flex-col items-center gap-3">
                        <p className="text-sm text-white/70">
                            Showing {currentItems.length} of {data?.meta?.total ?? 0} users
                        </p>

                        {hasMore && (
                            <button
                                onClick={handleLoadMore}
                                disabled={isFetching}
                                className="rounded-md bg-primary border border-primary px-6 py-2 text-white disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isFetching ? "Loading..." : "Load More"}
                            </button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default ReferrelLinkTable;