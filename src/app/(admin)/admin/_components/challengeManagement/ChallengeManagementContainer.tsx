/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ReactNode, useState } from "react";
import ReuseAbleTable from "@/shared/UI/reusable/table/ReuseAbleTable";
import AppPagination from "../topComponent/AppPagination";
import { Button } from "@/components/ui/button";
import { Eye, Gamepad2, User2, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { ChallengeItem } from "@/types/challenge/challengeTypes";
import {
    useAdminAcceptChallengeMutation,
    useAdminDeclineChallengeMutation,
    useGetAllChallengesListQuery,
} from "@/redux/features/challenge/challengeManagement";
import { toast } from "sonner";

export default function ChallengeManagementContainer() {
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data: challengeList, isLoading } = useGetAllChallengesListQuery({
        page,
        limit,
    });

    const [acceptChallenge, { isLoading: isAcceptLoading }] =
        useAdminAcceptChallengeMutation();
    const [declineChallenge, { isLoading: isDeclineLoading }] =
        useAdminDeclineChallengeMutation();

    const [processingChallengeId, setProcessingChallengeId] = useState<number | null>(
        null
    );
    const [processingAction, setProcessingAction] = useState<"accept" | "decline" | null>(
        null
    );

    const tableHeader = [
        "Challenge No",
        "Game",
        "Challenger",
        "Target Player",
        "Amount",
        "Status",
        "Actions",
    ];

    const challenges: ChallengeItem[] = challengeList?.data ?? [];

    const meta = {
        page: challengeList?.meta?.currentPage ?? 1,
        limit: challengeList?.meta?.perPage ?? 10,
        total: challengeList?.meta?.total ?? 0,
        prev: challengeList?.meta?.prev ?? false,
        next: challengeList?.meta?.next ?? false,
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            pending: "bg-yellow-500 text-black",
            offered: "bg-blue-600 text-white",
            accepted: "bg-green-600 text-white",
            completed: "bg-emerald-600 text-white",
            cancelled: "bg-gray-500 text-white",
            rejected: "bg-red-600 text-white",
        };

        return styles[status?.toLowerCase()] ?? "bg-gray-500 text-white";
    };

    const handleAcceptChallenge = async (id: number) => {
        try {
            setProcessingChallengeId(id);
            setProcessingAction("accept");

            const response = await acceptChallenge({ id }).unwrap();
            toast.success(response?.message);
        } catch (error: any) {
            toast.error(error?.data?.message ?? error?.message ?? "Failed to accept challenge");
        } finally {
            setProcessingChallengeId(null);
            setProcessingAction(null);
        }
    };

    const handleDeclineChallenge = async (id: number) => {
        try {
            setProcessingChallengeId(id);
            setProcessingAction("decline");

            const response = await declineChallenge({ id }).unwrap();
            toast.success(response?.message);
        } catch (error: any) {
            toast.error(error?.data?.message ?? error?.message ?? "Failed to decline challenge");
        } finally {
            setProcessingChallengeId(null);
            setProcessingAction(null);
        }
    };

    const isGlobalProcessing = isAcceptLoading || isDeclineLoading;

    const tableRowDataRenderers: ((item: ChallengeItem, index: number) => ReactNode)[] =
        [
            (item) => <span className="text-white">#{item.challenge_no}</span>,

            (item) => (
                <div className="flex items-center gap-2">
                    <Gamepad2 className="size-4 text-white/70" />
                    <span className="text-white">{item.game?.name}</span>
                </div>
            ),

            (item) => (
                <div className="flex items-center gap-2">
                    <User2 className="size-4 text-white/70" />
                    <span className="text-white">{item.challenger?.name}</span>
                </div>
            ),

            (item) => (
                <div className="flex items-center gap-2">
                    <User2 className="size-4 text-white/70" />
                    <span className="text-white">{item.target_player?.name ?? "Global"}</span>
                </div>
            ),

            (item) => <span className="text-white">${item.amount}</span>,

            (item) => (
                <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(
                        item.status
                    )}`}
                >
                    {item.status}
                </span>
            ),

            (item) => {
                const isCurrentRowProcessing = processingChallengeId === item.id;
                const canAct = item.status?.toLowerCase() === "pending";

                return (
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            onClick={() => handleAcceptChallenge(item.id)}
                            disabled={!canAct || isGlobalProcessing}
                            className="!bg-[#22CAAD] !text-white disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isCurrentRowProcessing && processingAction === "accept" ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="size-4 animate-spin" />
                                    Accepting...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <CheckCircle2 className="size-4" />
                                    Accept
                                </span>
                            )}
                        </Button>

                        <Button
                            type="button"
                            onClick={() => handleDeclineChallenge(item.id)}
                            disabled={!canAct || isGlobalProcessing}
                            className="!bg-[#EB3D4D] !text-white disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isCurrentRowProcessing && processingAction === "decline" ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="size-4 animate-spin" />
                                    Declining...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <XCircle className="size-4" />
                                    Decline
                                </span>
                            )}
                        </Button>
                    </div>
                );
            },
        ];

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-white">Challenge List</h2>
            </div>

            <div className="py-10">
                <ReuseAbleTable
                    isLoadings={isLoading}
                    currentItems={challenges}
                    tableHeader={tableHeader}
                    tableRowDataRenderers={tableRowDataRenderers}
                    isBg={false}
                    minTableWidthPx={1320}
                    variant="rank-dark"
                />

                <div className="mt-6">
                    <AppPagination meta={meta} onPageChange={setPage} showSummary={false} />
                </div>
            </div>
        </div>
    );
}