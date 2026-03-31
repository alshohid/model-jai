"use client";

import { ReactNode, useState } from "react";
import ReuseAbleTable from "@/shared/UI/reusable/table/ReuseAbleTable";
import { useGetUserTransactionsQuery } from "@/redux/features/support/supportManagement";
import { formateDate } from "@/shared/lib/utils/dateFormater";
import { IUserTransactionItem } from "@/types/support/supportmanagement";
import { Button } from "@/components/ui/button";

const STEP = 10;

type TransactionRow = Omit<IUserTransactionItem, "type"> & {
    type: IUserTransactionItem["type"] | "purchase" | "support" | "win" | "tip";
    invoice_pdf?: string | null;
};

export default function TransactionsContainer() {
    const [limit, setLimit] = useState(STEP);

    const { data, isLoading, isFetching } = useGetUserTransactionsQuery({
        page: 1,
        limit,
    });

    const currentItems: TransactionRow[] = (data?.data as TransactionRow[] | undefined) ?? [];
    const total = data?.meta?.total ?? 0;
    const hasMore = currentItems.length < total;

    const handleDownloadInvoice = (url: string, transactionId: number) => {
        const link = document.createElement("a");
        link.href = url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.download = `transaction-${transactionId}-invoice.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getTypeBadgeClass = (type: TransactionRow["type"]) => {
        if (type === "withdraw") return "bg-red-500/15 text-red-400 border border-red-500/20";
        // if (type === "match") return "bg-blue-500/15 text-blue-400 border border-blue-500/20";
        return "bg-green-500/15 text-green-400 border border-green-500/20";
    };

    const tableHeader = [
        "Transaction ID",
        "User ID",
        "Type",
        "Amount",
        "Balance After",
        "Reference",
        "Date",
        "Action"
    ];

    const tableRowDataRenderers: ((
        item: TransactionRow,
        index: number
    ) => ReactNode)[] = [
            (item) => <span className="text-white">#{item.id}</span>,
            (item) => <span className="text-white">#{item.user_id}</span>,
            (item) => (
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium capitalize ${getTypeBadgeClass(item.type)}`}>
                    {item.type}
                </span>
            ),
            (item) => <span className="text-white">${item.amount}</span>,
            (item) => <span className="text-white">${item.balance_after}</span>,
            (item) => (
                <span className="text-white/80 max-w-[220px] inline-block truncate">
                    {item.reference}
                </span>
            ),
            (item) => (
                <span className="text-white">{formateDate(item.created_at)}</span>
            ),
            (item) => (
                item.invoice_pdf ? (
                    <Button
                        type="button"
                        className="group h-10 rounded-full border border-[#D95AB0]/35 bg-gradient-to-r from-[#B02383] via-[#8D206B] to-[#63184D] px-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_10px_26px_rgba(176,35,131,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#F2A7D7]/45 hover:shadow-[0_14px_34px_rgba(176,35,131,0.38)]"
                        onClick={() => handleDownloadInvoice(item.invoice_pdf as string, item.id)}
                    >
                        <span className="flex items-center gap-2">
                            <span className="rounded-full border border-white/15 bg-white/10 px-2 py-1 text-[9px] font-bold tracking-[0.22em] text-white/80">
                                PDF
                            </span>
                            <span>Download</span>
                        </span>
                    </Button>
                ) : (
                    <span className="text-white">-</span>
                )
            )

        ];

    return (
        <div className="w-full">
            {/* Header */}
            <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-semibold text-white">Transactions</h2>
                    <p className="text-sm text-white/60 mt-1">
                        View all recharge and withdraw transaction history.
                    </p>
                </div>
                {total > 0 && (
                    <p className="text-[13px] text-white/40 flex-shrink-0">
                        Showing{" "}
                        <span className="text-white font-medium">{currentItems.length}</span>
                        {" "}of{" "}
                        <span className="text-white font-medium">{total}</span>
                    </p>
                )}
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

            {/* Load More */}
            {!isLoading && (
                <div className="mt-6 flex flex-col items-center gap-3">
                    {hasMore ? (
                        <button
                            onClick={() => setLimit((prev) => prev + STEP)}
                            disabled={isFetching}
                            className={`
                                h-11 px-8 rounded-xl text-sm font-semibold tracking-wide
                                border border-white/10 transition-all duration-200
                                ${isFetching
                                    ? "bg-white/5 text-white/30 cursor-not-allowed"
                                    : "bg-white/5 hover:bg-white/10 text-white cursor-pointer"
                                }
                            `}
                        >
                            {isFetching ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                                    Loading...
                                </span>
                            ) : (
                                "Load More"
                            )}
                        </button>
                    ) : (
                        total > 0 && (
                            <p className="text-[12px] text-white/25 tracking-wide">
                                All {total} transactions loaded
                            </p>
                        )
                    )}
                </div>
            )}
        </div>
    );
}
