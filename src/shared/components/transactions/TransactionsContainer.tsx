"use client";

import { ReactNode } from "react";
import ReuseAbleTable from "@/shared/UI/reusable/table/ReuseAbleTable";
import { useGetUserTransactionsQuery } from "@/redux/features/support/supportManagement";
import { formateDate } from "@/shared/lib/utils/dateFormater";
import { IUserTransactionItem } from "@/types/support/supportmanagement";
import { useState } from "react";

export default function TransactionsContainer() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(50);
    const { data, isLoading } = useGetUserTransactionsQuery({
        page: page,
        limit: limit,
    });

    const tableHeader = [
        "Transaction ID",
        "User ID",
        "Type",
        "Amount",
        "Balance After",
        "Reference",
        "Date",
    ];

    const currentItems: IUserTransactionItem[] = data?.data ?? [];


    const getTypeBadgeClass = (type: IUserTransactionItem["type"]) => {
        if (type === "withdraw") {
            return "bg-red-500/15 text-red-400 border border-red-500/20";
        }
        return "bg-green-500/15 text-green-400 border border-green-500/20";
    };

    const tableRowDataRenderers: ((
        item: IUserTransactionItem,
        index: number
    ) => ReactNode)[] = [
            (item) => <span className="text-white">#{item.id}</span>,

            (item) => <span className="text-white">#{item.user_id}</span>,

            (item) => (
                <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-medium capitalize ${getTypeBadgeClass(
                        item.type
                    )}`}
                >
                    {item.type}
                </span>
            ),

            (item) => <span className="text-white">${item.amount}</span>,

            (item) => <span className="text-white">${item.balance_after}</span>,

            (item) => (
                <span className="text-white/80 break-all max-w-[220px] inline-block truncate">
                    {item.reference}
                </span>
            ),

            (item) => (
                <span className="text-white truncate">
                    {formateDate(item.created_at)}
                </span>
            ),


        ];

    return (
        <div className="w-full">
            <div className="mb-6">
                <h2 className="text-2xl font-semibold text-white">Transactions</h2>
                <p className="text-sm text-white/60 mt-1">
                    View all recharge and withdraw transaction history.
                </p>
            </div>

            <ReuseAbleTable
                isLoadings={isLoading}
                currentItems={currentItems}
                tableHeader={tableHeader}
                tableRowDataRenderers={tableRowDataRenderers}
                isBg={false}
                minTableWidthPx={1400}
                variant="rank-dark"
            />
        </div>
    );
}