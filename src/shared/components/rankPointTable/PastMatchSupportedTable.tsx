/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import ReuseAbleTable from "@/shared/UI/reusable/table/ReuseAbleTable";
import LiveSectionHeader from "@/app/(auth)/_components/watchLive/LiveSectionHeader";
import StartStreamingButton from "@/shared/UI/button/StartStreamingButton";
import Image from "next/image";
import { useGetPastMatchSupportListQuery } from "@/redux/features/support/supportManagement";
import { IPastSupportItem } from "@/types/support/supportmanagement";


const PastMatchSupportedTable = () => {
    const [page, setPage] = useState(1);
    const limit = 10;
    const [allItems, setAllItems] = useState<IPastSupportItem[]>([]);

    const { data, isLoading, isFetching } = useGetPastMatchSupportListQuery({
        page,
        limit,
    });

    useEffect(() => {
        if (!data?.data) return;

        if (page === 1) {
            setAllItems(data?.data);
            return;
        }

        setAllItems((prev) => {
            const existingKeys = new Set(
                prev.map(
                    (item) =>
                        `${item.rank_no}-${item.match_no}-${item.supported_player}`
                )
            );

            const newItems = data.data.filter(
                (item) =>
                    !existingKeys.has(
                        `${item.rank_no}-${item.match_no}-${item.supported_player}`
                    )
            );

            return [...prev, ...newItems];
        });
    }, [data, page]);

    const tableHeader = [
        "Rank No",
        "Player Name",
        "Game Name",
        "Result",
        "Range Point Match Support From Highest to Lowest",
    ];

    const currentItems = useMemo(() => allItems, [allItems]);

    const tableRowDataRenderers: ((
        item: IPastSupportItem,
        index: number
    ) => ReactNode)[] = [
            (item) => <span className="text-[#FFFFFF]">{item.rank_no}</span>,

            (item) => (
                <span className="text-[#FFFFFF]">{item.supported_player}</span>
            ),

            (item) => <span className="text-[#FFFFFF]">{item.game_name}</span>,

            (item) => (
                <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-medium capitalize ${item.result === "win"
                            ? "bg-green-500/15 text-green-400 border border-green-500/20"
                            : item.result === "loss"
                                ? "bg-red-500/15 text-red-400 border border-red-500/20"
                                : "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20"
                        }`}
                >
                    {item.result}
                </span>
            ),

            (item) => (
                <span className="text-[#FFFFFF]">
                    {item.range_points?.join(", ") || "N/A"}
                </span>
            ),
        ];

    const hasMore = data?.meta?.next ?? false;

    return (
        <div className="relative">
            <div className="pointer-events-none absolute right-0 bottom-0 -z-10 translate-y-1/2">
                <Image
                    src="/images/home/bottom_right.png"
                    width={702}
                    height={702}
                    alt="elips"
                    className="w-[1700px] h-[1400px]"
                />
            </div>

            <div className="container space-y-6">
                <LiveSectionHeader
                    title="Past Match Supported"
                    className="mb-8 md:mb-10 tracking-wide lg:text-[48px]"
                />

                <ReuseAbleTable
                    isLoadings={isLoading && page === 1}
                    currentItems={currentItems}
                    tableHeader={tableHeader}
                    tableRowDataRenderers={tableRowDataRenderers}
                    isBg={false}
                    minTableWidthPx={1320}
                    variant="rank-dark"
                />

                {hasMore && (
                    <div className="py-6 flex items-center justify-center">
                        <StartStreamingButton
                            onClick={() => setPage((prev) => prev + 1)}
                            disabled={isFetching}
                        >
                            {isFetching ? "Loading..." : "View More"}
                        </StartStreamingButton>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PastMatchSupportedTable;