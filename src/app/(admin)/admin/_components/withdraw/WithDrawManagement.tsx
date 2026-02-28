"use client";

import { ReactNode, useMemo, useState } from "react";
import MatchListToolbar from "../reusable/MatchListToolbar";
import ReuseAbleTable from "@/shared/UI/reusable/table/ReuseAbleTable";
import AppPagination from "../topComponent/AppPagination";
import { useClientPagination } from "../../hook/useClientPagination";
import { Button } from "@/components/ui/button";
import { useAllWithdrawRequestsListQuery } from "@/redux/features/pointstore/buypoint";

type WithdrawApiItem = {
    id: number;
    user_id: number;
    withdraw_no: string;
    coin_amount: string;
    usd_amount: string;
    stripe_transfer_id: string | null;
    status: "paid" | "pending";
    created_at: string;
    updated_at: string;
};

export default function WithdrawManagement() {

    const {
        data: allWithdrawRequestsList,
        isLoading,
    } = useAllWithdrawRequestsListQuery();

    const [limit] = useState(8);

    const tableHeader = [
        "Withdraw No",
        "User ID",
        "USD Amount",
        "Status",
        "Actions",
    ];

    const withdrawList: WithdrawApiItem[] =
        allWithdrawRequestsList?.data ?? [];

    const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "paid">("all");

    const filteredItems = useMemo(() => {
        if (statusFilter === "all") return withdrawList;
        return withdrawList.filter((item) => item.status === statusFilter);
    }, [withdrawList, statusFilter]);

    const { currentItems, meta, setPage } = useClientPagination({
        items: filteredItems,
        limit,
    });


    const tableRowDataRenderers: ((
        item: WithdrawApiItem,
        index: number
    ) => ReactNode)[] = [
            (item) => <span className="text-white">{item.withdraw_no}</span>,

            (item) => <span className="text-white">#{item.user_id}</span>,

            (item) => (
                <span className="text-white">
                    ${Number(item.usd_amount).toFixed(2)}
                </span>
            ),

            (item) => (
                <span
                    className={`px-2 py-1 rounded text-xs font-medium ${item.status === "paid"
                        ? "bg-green-600 text-white"
                        : "bg-yellow-500 text-black"
                        }`}
                >
                    {item.status}
                </span>
            ),

            (item) => (
                <div className="flex items-center gap-2">
                    <Button
                        disabled={item.status === "paid"}
                        className="!bg-[#22CAAD] !text-white"
                    >
                        Accept
                    </Button>

                    <Button
                        disabled={item.status === "paid"}
                        className="!bg-[#EB3D4D] !text-white"
                    >
                        Decline
                    </Button>
                </div>
            ),
        ];

    return (
        <div>
            <MatchListToolbar
                title="Withdraw List"

                showSelect={false}
                onCreateMatch={() => { }}
            />

            <div className="py-10">
                <ReuseAbleTable
                    isLoadings={isLoading}
                    currentItems={currentItems}
                    tableHeader={tableHeader}
                    tableRowDataRenderers={tableRowDataRenderers}
                    isBg={false}
                    minTableWidthPx={1320}
                    variant="rank-dark"
                />

                <div className="mt-6">
                    <AppPagination
                        meta={meta}
                        onPageChange={setPage}
                        showSummary={false}
                    />
                </div>
            </div>
        </div>
    );
}