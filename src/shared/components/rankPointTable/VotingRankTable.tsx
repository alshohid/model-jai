/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { ReactNode } from "react";
import ReuseAbleTable from "@/shared/UI/reusable/table/ReuseAbleTable";
import { ITopVoterItem } from "@/types/match/MatchManagementTypes";

type VotingRankTableProps = {
    data: ITopVoterItem[];
    isLoading?: boolean;
};

export default function VotingRankTable({
    data,
    isLoading = false,
}: VotingRankTableProps) {
    const tableHeader = [
        "Rank Boss Voter",
        "Boss Voter Name",
        "User ID",
        "Total Votes",
        "Vote Breakdown",
    ];

    const currentItems: ITopVoterItem[] = data?.map((item) => ({
        user_id: item.user_id,
        serial_no: item.serial_no,
        total_votes: item.total_votes,
        vote_breakdown: item.vote_breakdown,
        user: {
            id: item.user?.id ?? item.user_id,
            name: item.user?.name ?? "N/A",
            image: item.user?.image,
        },
    })) ?? [];

    const tableRowDataRenderers: ((
        item: ITopVoterItem,
        index: number,
    ) => ReactNode)[] = [
            (item) => <span className="text-white">{item.serial_no}</span>,
            (item) => (
                <div className="flex items-center gap-3">
                    <div className="size-9 overflow-hidden rounded-full border border-white/10 bg-white/5">
                        <img
                            src={item.user?.image || "/images/home/avatar_img.png"}
                            alt={item.user?.name || "Voter"}
                            className="h-full w-full object-cover"
                        />
                    </div>
                    {item.user?.id || item.user_id ? (
                        <Link
                            href={`/artist/${item.user?.id ?? item.user_id}`}
                            className="text-white transition hover:text-[#24C3FF] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                        >
                            {item.user?.name ?? "N/A"}
                        </Link>
                    ) : (
                        <span className="text-white">{item.user?.name ?? "N/A"}</span>
                    )}
                </div>
            ),
            (item) => <span className="text-white">{item.user_id}</span>,
            (item) => <span className="text-white">{item.total_votes}</span>,
            (item) => <span className="text-white">{item.vote_breakdown || "N/A"}</span>,
        ];

    return (
        <ReuseAbleTable
            isLoadings={isLoading}
            currentItems={currentItems}
            tableHeader={tableHeader}
            tableRowDataRenderers={tableRowDataRenderers}
            isBg={false}
            minTableWidthPx={1080}
            variant="rank-dark"
        />
    );
}
