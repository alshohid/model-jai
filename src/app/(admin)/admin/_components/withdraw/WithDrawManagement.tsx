"use client";

import { ReactNode, useState } from "react";
import MatchListToolbar from "../reusable/MatchListToolbar";
import ReuseAbleTable from "@/shared/UI/reusable/table/ReuseAbleTable";
import AppPagination from "../topComponent/AppPagination";
import { Button } from "@/components/ui/button";
import {
    useAllWithdrawRequestsListQuery,
    useAcceptWithdrawRequestMutation,
    useRejectWithdrawRequestMutation,
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
    const {
        data: allWithdrawRequestsList,
        isLoading,
    } = useAllWithdrawRequestsListQuery({ page, limit });


    const [acceptWithdraw, { isLoading: isAccepting }] = useAcceptWithdrawRequestMutation();
    const [rejectWithdraw, { isLoading: isRejecting }] = useRejectWithdrawRequestMutation();

    const [modal, setModal] = useState<ModalState>({
        open: false,
        type: "accept",
        item: null,
    });

    const tableHeader = [
        "Withdraw No",
        "User ID",
        "USD Amount",
        "Status",
        "Actions",
    ];

    const withdrawList: IWithdrawRequestData[] =
        allWithdrawRequestsList?.data ?? [];

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

    const closeModal = () => {
        setModal({ open: false, type: "accept", item: null });
    };

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
                <span className="text-white">
                    ${Number(item.usd_amount).toFixed(2)}
                </span>
            ),

            (item) => (
                <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(item.status)}`}
                >
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
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Withdraw List</h2>
            </div>
            {/* <MatchListToolbar
                title="Withdraw List"

                showSelect={false}
                onCreateMatch={() => { }}
            /> */}

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

            {/* Accept / Reject Confirmation Modal */}
            <AppDialog
                open={modal.open}
                onOpenChange={closeModal}
                title=""
            >
                <div className="space-y-6">
                    {/* Header */}
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center",
                                    modal.type === "accept"
                                        ? "bg-[#22CAAD]/20"
                                        : "bg-[#EB3D4D]/20"
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
                                    {modal.type === "accept"
                                        ? "Accept Withdraw Request"
                                        : "Decline Withdraw Request"}
                                </h3>
                                <p className="text-sm text-white/60">
                                    {modal.type === "accept"
                                        ? "This will approve the withdrawal and process the transfer."
                                        : "This will reject the withdrawal request."}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Withdraw Details Card */}
                    {modal.item && (
                        <div className="rounded-lg bg-white/5 border border-white/10 p-4 space-y-3">
                            <div className="flex justify-between">
                                <span className="text-white/60 text-sm">Withdraw No</span>
                                <span className="text-white text-sm font-medium">
                                    {modal.item.withdraw_no}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/60 text-sm">User ID</span>
                                <span className="text-white text-sm font-medium">
                                    #{modal.item.user_id}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/60 text-sm">Coin Amount</span>
                                <span className="text-white text-sm font-medium">
                                    {modal.item.coin_amount}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/60 text-sm">USD Amount</span>
                                <span className="text-white text-sm font-medium">
                                    ${Number(modal.item.usd_amount).toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/60 text-sm">Status</span>
                                <span
                                    className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusBadge(modal.item.status)}`}
                                >
                                    {modal.item.status}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-white/10">
                        <button
                            onClick={closeModal}
                            disabled={isProcessing}
                            className={cn(
                                "flex-1 h-11 px-6 py-3 rounded-lg text-sm font-medium",
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
                                "flex-1 h-11 px-6 py-3 rounded-lg text-sm font-medium",
                                "text-white transition-all flex items-center justify-center gap-2 cursor-pointer",
                                modal.type === "accept"
                                    ? "bg-[#22CAAD] hover:bg-[#22CAAD]/90"
                                    : "bg-[#EB3D4D] hover:bg-[#EB3D4D]/90",
                                isProcessing && "opacity-60 cursor-not-allowed"
                            )}
                        >
                            {isProcessing ? (
                                "Processing..."
                            ) : modal.type === "accept" ? (
                                <>
                                    <CheckCircle2 className="size-4" />
                                    Confirm Accept
                                </>
                            ) : (
                                <>
                                    <XCircle className="size-4" />
                                    Confirm Decline
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </AppDialog>
        </div>
    );
}