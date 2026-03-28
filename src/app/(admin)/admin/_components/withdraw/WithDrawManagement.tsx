"use client";

import { ReactNode, useState } from "react";
import ReuseAbleTable from "@/shared/UI/reusable/table/ReuseAbleTable";
import AppPagination from "../topComponent/AppPagination";
import { Button } from "@/components/ui/button";
import {
    useAllWithdrawRequestsListQuery,
    useAcceptWithdrawRequestMutation,
    useRejectWithdrawRequestMutation,
    useGetAutoAcceptStatusQuery,
    useToggleAutoAcceptStatusMutation,
} from "@/redux/features/pointstore/buypoint";
import { IWithdrawRequestData } from "@/types/user/point";
import AppDialog from "@/shared/components/modal/AppDialog";
import { cn } from "@/shared/lib/utils/cn";
import { CheckCircle2, XCircle } from "lucide-react";

type ModalState = {
    open: boolean;
    type: "accept" | "reject";
    item: IWithdrawRequestData | null;
};

export default function WithdrawManagement() {
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data: allWithdrawRequestsList, isLoading } =
        useAllWithdrawRequestsListQuery({ page, limit });

    const { data: autoAcceptData, isLoading: isAutoAcceptLoading } =
        useGetAutoAcceptStatusQuery(undefined);

    const [toggleAutoAccept, { isLoading: isToggling }] =
        useToggleAutoAcceptStatusMutation();

    const isAutoAcceptOn = autoAcceptData?.data?.value === "true";

    const handleToggleAutoAccept = async () => {
        await toggleAutoAccept({ value: (isAutoAcceptOn ? "false" : "true") });
    };

    const [acceptWithdraw, { isLoading: isAccepting }] =
        useAcceptWithdrawRequestMutation();
    const [rejectWithdraw, { isLoading: isRejecting }] =
        useRejectWithdrawRequestMutation();

    const [modal, setModal] = useState<ModalState>({
        open: false,
        type: "accept",
        item: null,
    });

    const tableHeader = ["Withdraw No", "User ID", "USD Amount", "Status", "Actions"];
    const withdrawList: IWithdrawRequestData[] = allWithdrawRequestsList?.data ?? [];

    const meta = {
        page: allWithdrawRequestsList?.meta?.current_page ?? 1,
        limit: allWithdrawRequestsList?.meta?.per_page ?? 10,
        total: allWithdrawRequestsList?.meta?.total ?? 0,
        prev: !!allWithdrawRequestsList?.meta?.prev_page_url,
        next: !!allWithdrawRequestsList?.meta?.next_page_url,
    };

    const openModal = (type: "accept" | "reject", item: IWithdrawRequestData) => {
        setModal({ open: true, type, item });
    };

    const closeModal = () => setModal({ open: false, type: "accept", item: null });

    const handleConfirm = async () => {
        if (!modal.item) return;
        try {
            if (modal.type === "accept") {
                await acceptWithdraw({ id: modal.item.id.toString() }).unwrap();
            } else {
                await rejectWithdraw({ id: modal.item.id.toString() }).unwrap();
            }
            closeModal();
        } catch (error) {
            console.error("Withdraw action failed:", error);
        }
    };

    const getStatusBadge = (status: IWithdrawRequestData["status"]) => {
        const styles: Record<IWithdrawRequestData["status"], string> = {
            paid: "bg-green-600 text-white",
            pending: "bg-yellow-500 text-black",
            accepted: "bg-blue-600 text-white",
            declined: "bg-red-600 text-white",
        };
        return styles[status] ?? "bg-gray-500 text-white";
    };

    const tableRowDataRenderers: ((
        item: IWithdrawRequestData,
        index: number
    ) => ReactNode)[] = [
            (item) => <span className="text-white">{item.withdraw_no}</span>,
            (item) => <span className="text-white">#{item.user_id}</span>,
            (item) => (
                <span className="text-white">${Number(item.usd_amount).toFixed(2)}</span>
            ),
            (item) => (
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(item.status)}`}>
                    {item.status}
                </span>
            ),
            (item) => (
                <div className="flex items-center gap-2">
                    <Button
                        disabled={item.status !== "pending"}
                        className="!bg-[#22CAAD] !text-white"
                        onClick={() => openModal("accept", item)}
                    >
                        Accept
                    </Button>
                    <Button
                        disabled={item.status !== "pending"}
                        className="!bg-[#EB3D4D] !text-white"
                        onClick={() => openModal("reject", item)}
                    >
                        Decline
                    </Button>
                </div>
            ),
        ];

    const isProcessing = isAccepting || isRejecting;

    return (
        <div>
            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-white">Withdraw List</h2>

                {/* Auto Accept Toggle */}
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 w-fit">
                    <div className="space-y-0.5">
                        <p className="text-[13px] font-semibold text-white leading-none">
                            Auto Accept
                        </p>
                        <p className="text-[11px] text-white/40 leading-none">
                            {isAutoAcceptOn ? "Withdrawals approved automatically" : "Manual approval required"}
                        </p>
                    </div>

                    {/* Toggle switch */}
                    <button
                        type="button"
                        disabled={isToggling || isAutoAcceptLoading}
                        onClick={handleToggleAutoAccept}
                        className={cn(
                            "relative w-12 h-6 rounded-full transition-all duration-300 flex-shrink-0 cursor-pointer",
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                            isAutoAcceptOn
                                ? "bg-[#22CAAD] shadow-[0_0_12px_rgba(34,202,173,0.4)]"
                                : "bg-white/15"
                        )}
                        aria-label="Toggle auto accept"
                    >
                        <span
                            className={cn(
                                "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300",
                                isAutoAcceptOn ? "left-6" : "left-0.5"
                            )}
                        />
                        {/* Spinner overlay while toggling */}
                        {isToggling && (
                            <span className="absolute inset-0 flex items-center justify-center">
                                <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            </span>
                        )}
                    </button>
                </div>
            </div>

            <div className="py-10">
                <ReuseAbleTable
                    isLoadings={isLoading}
                    currentItems={withdrawList}
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

            {/* ── Confirm Modal ── */}
            <AppDialog open={modal.open} onOpenChange={closeModal} title="">
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center",
                                    modal.type === "accept" ? "bg-[#22CAAD]/20" : "bg-[#EB3D4D]/20"
                                )}
                            >
                                {modal.type === "accept" ? (
                                    <CheckCircle2 className="size-5 text-[#22CAAD]" />
                                ) : (
                                    <XCircle className="size-5 text-[#EB3D4D]" />
                                )}
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">
                                    {modal.type === "accept" ? "Accept Withdraw Request" : "Decline Withdraw Request"}
                                </h3>
                                <p className="text-sm text-white/60">
                                    {modal.type === "accept"
                                        ? "This will approve the withdrawal and process the transfer."
                                        : "This will reject the withdrawal request."}
                                </p>
                            </div>
                        </div>
                    </div>

                    {modal.item && (
                        <div className="rounded-lg bg-white/5 border border-white/10 p-4 space-y-3">
                            {[
                                { label: "Withdraw No", value: modal.item.withdraw_no },
                                { label: "User ID", value: `#${modal.item.user_id}` },
                                { label: "Coin Amount", value: modal.item.coin_amount },
                                { label: "USD Amount", value: `$${Number(modal.item.usd_amount).toFixed(2)}` },
                            ].map(({ label, value }) => (
                                <div key={label} className="flex justify-between">
                                    <span className="text-white/60 text-sm">{label}</span>
                                    <span className="text-white text-sm font-medium">{value}</span>
                                </div>
                            ))}
                            <div className="flex justify-between">
                                <span className="text-white/60 text-sm">Status</span>
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusBadge(modal.item.status)}`}>
                                    {modal.item.status}
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-white/10">
                        <button
                            onClick={closeModal}
                            disabled={isProcessing}
                            className={cn(
                                "flex-1 h-11 px-6 rounded-lg text-sm font-medium",
                                "bg-white/10 hover:bg-white/15 border border-white/20 text-white",
                                "transition-all cursor-pointer"
                            )}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={isProcessing}
                            className={cn(
                                "flex-1 h-11 px-6 rounded-lg text-sm font-medium",
                                "text-white transition-all flex items-center justify-center gap-2 cursor-pointer",
                                modal.type === "accept"
                                    ? "bg-[#22CAAD] hover:bg-[#22CAAD]/90"
                                    : "bg-[#EB3D4D] hover:bg-[#EB3D4D]/90",
                                isProcessing && "opacity-60 cursor-not-allowed"
                            )}
                        >
                            {isProcessing ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Processing...
                                </span>
                            ) : modal.type === "accept" ? (
                                <><CheckCircle2 className="size-4" /> Confirm Accept</>
                            ) : (
                                <><XCircle className="size-4" /> Confirm Decline</>
                            )}
                        </button>
                    </div>
                </div>
            </AppDialog>
        </div>
    );
}