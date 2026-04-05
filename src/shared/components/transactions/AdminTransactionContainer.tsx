"use client";


import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import ReuseAbleTable from "@/shared/UI/reusable/table/ReuseAbleTable";
import { formateDate } from "@/shared/lib/utils/dateFormater";
import { useDebounce } from "@/app/(admin)/admin/hook/useDebounce";
import { useGetAdminTransactionQuery } from "@/redux/features/support/supportManagement";
import { IUserTransactionItem } from "@/types/support/supportmanagement";

const STEP = 10;
const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
});

type AdminTransactionRow = Omit<IUserTransactionItem, "type"> & {
    type:
    | IUserTransactionItem["type"]
    | "purchase"
    | "support"
    | "win"
    | "tip";
    invoice_pdf?: string | null;
    user: {
        name: string;
        email: string;
    };
};

function formatCurrency(value?: string | number | null) {
    const numericValue = Number(value ?? 0);

    return currencyFormatter.format(Number.isFinite(numericValue) ? numericValue : 0);
}

function SummaryCard({
    label,
    value,
    caption,
    accent,
}: {
    label: string;
    value: string;
    caption: string;
    accent: "pink" | "cyan";
}) {
    const accentStyles =
        accent === "pink"
            ? {
                glow: "shadow-[0_20px_45px_rgba(255,46,200,0.18)]",
                ring: "from-[#FF2EC8]/28 via-[#FF7ADB]/16 to-transparent",
                badge: "border-[#FF8AE1]/30 bg-[#FF2EC8]/14 text-[#FF9BE7]",
                dot: "from-[#FF2EC8] to-[#FF7ADB]",
            }
            : {
                glow: "shadow-[0_20px_45px_rgba(53,216,255,0.18)]",
                ring: "from-[#35D8FF]/24 via-[#7BF1FF]/12 to-transparent",
                badge: "border-[#7BF1FF]/25 bg-[#35D8FF]/12 text-[#8BF4FF]",
                dot: "from-[#35D8FF] to-[#7BF1FF]",
            };

    return (
        <div
            className={`relative overflow-hidden rounded-[24px] border border-white/10 bg-[#0D1018] p-5 ${accentStyles.glow}`}
        >
            <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accentStyles.ring}`} />
            <div className="pointer-events-none absolute right-[-36px] top-[-36px] h-24 w-24 rounded-full bg-white/6 blur-2xl" />

            <div className="relative">
                <div className="flex items-center justify-between gap-3">
                    <span className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${accentStyles.badge}`}>
                        {label}
                    </span>
                    <span className={`h-3 w-3 rounded-full bg-gradient-to-br ${accentStyles.dot}`} />
                </div>

                <p className="mt-5 text-[30px] font-semibold tracking-[-0.03em] text-white">
                    {value}
                </p>
                <p className="mt-2 text-sm leading-6 text-white/58">
                    {caption}
                </p>
            </div>
        </div>
    );
}

export default function AdminTransactionContainer() {
    const [limit, setLimit] = useState(STEP);
    const [search, setSearch] = useState("");

    const debouncedSearch = useDebounce(search.trim(), 500);

    const { data, isLoading, isFetching } = useGetAdminTransactionQuery({
        page: 1,
        limit,
        search: debouncedSearch || undefined,
    });

    const currentItems: AdminTransactionRow[] =
        (data?.data as AdminTransactionRow[] | undefined) ?? [];
    const total = data?.meta?.total ?? 0;
    const hasMore = currentItems.length < total;
    const totalRecharge = formatCurrency(data?.total_recharge);
    const totalEarning = formatCurrency(data?.total_earning);

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

    const getTypeBadgeClass = (type: AdminTransactionRow["type"]) => {
        if (type === "withdraw") {
            return "bg-red-500/15 text-red-400 border border-red-500/20";
        }

        if (type === "support" || type === "tip") {
            return "bg-blue-500/15 text-blue-400 border border-blue-500/20";
        }

        return "bg-green-500/15 text-green-400 border border-green-500/20";
    };

    const tableHeader = [
        "Transaction ID",
        "User",
        "Type",
        "Amount",
        "Balance After",
        "Reference",
        "Date",
        "Action",
    ];

    const tableRowDataRenderers: ((
        item: AdminTransactionRow,
        index: number
    ) => ReactNode)[] = [
            (item) => <span className="text-white">#{item.id}</span>,
            (item) => (
                <div className="flex flex-col gap-1">
                    <span className="text-white">{item?.user?.name}</span>
                    <span className="text-white">{item?.user?.email}</span>

                </div>
            ),
            (item) => (
                <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium capitalize ${getTypeBadgeClass(item.type)}`}>
                    {item.type}
                </span>
            ),
            (item) => <span className="text-white">${item.amount}</span>,
            (item) => <span className="text-white">${item.balance_after}</span>,
            (item) => (
                <span className="inline-block max-w-[220px] truncate text-white/80">
                    {item.reference || "-"}
                </span>
            ),
            (item) => <span className="text-white">{formateDate(item.created_at)}</span>,
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
            ),
        ];

    return (
        <div className="w-full">
            {/* Header */}
            <div className="mb-6 rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
                <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                    <div className="max-w-xl">
                        <h2 className="text-2xl font-semibold text-white">Transactions</h2>
                        <p className="mt-1 text-sm text-white/60">
                        View all recharge and withdraw transaction history.
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 xl:min-w-[560px] xl:max-w-[620px]">
                        <SummaryCard
                            label="Total Recharge"
                            value={totalRecharge}
                            caption="Combined value of all successful wallet recharge transactions."
                            accent="pink"
                        />
                        <SummaryCard
                            label="Total Earning"
                            value={totalEarning}
                            caption="Net earnings recorded from platform activity and transaction flow."
                            accent="cyan"
                        />
                    </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-3">
                        <input
                            type="text"
                            value={search}
                            placeholder="Search by user ID or reference"
                            onChange={(e) => setSearch(e.target.value)}
                            className="min-w-[260px] rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white outline-none placeholder:text-white/35 focus:border-[#FF2EC8]"
                        />
                    </div>
                    {total > 0 && (
                        <p className="shrink-0 text-[13px] text-white/40">
                            Showing{" "}
                            <span className="font-medium text-white">{currentItems.length}</span> of{" "}
                            <span className="font-medium text-white">{total}</span>
                        </p>
                    )}
                </div>
            </div>

            {/* Table */}
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
