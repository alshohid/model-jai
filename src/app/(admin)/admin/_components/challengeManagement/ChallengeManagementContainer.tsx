/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ReactNode, useState } from "react";
import ReuseAbleTable from "@/shared/UI/reusable/table/ReuseAbleTable";
import AppPagination from "../topComponent/AppPagination";
import { Button } from "@/components/ui/button";
import { Gamepad2, User2, Loader2, CheckCircle2, XCircle, Trophy, View } from "lucide-react";
import { ChallengeItem } from "@/types/challenge/challengeTypes";
import {
    useAdminAcceptChallengeMutation,
    useAdminDeclineChallengeMutation,
    useGetAllChallengesListQuery,
    useGetAutoAcceptChallengeQuery,
    useToggleAutoAcceptChallengeMutation,
} from "@/redux/features/challenge/challengeManagement";
import WinnerSelectModal from "./WinnerSelectModal";
import MakeOfficialModal from "./MakeOfficialModal";
import ChallengeReportModal from "./ChallengeReportModal";
import { toast } from "sonner";
import ToggleCard from "@/features/challenge-match/components/ToggleCard";
import Link from "next/link";

export default function ChallengeManagementContainer() {
    const [page, setPage] = useState(1);
    const [isToggling, setIsToggling] = useState(false);
    const [processingChallengeId, setProcessingChallengeId] = useState<number | null>(
        null
    );
    const [processingAction, setProcessingAction] = useState<"accept" | "decline" | null>(
        null
    );
    const [winnerModalOpen, setWinnerModalOpen] = useState(false);
    const [selectedChallengeForWinner, setSelectedChallengeForWinner] = useState<ChallengeItem | null>(null);
    const [officialModalOpen, setOfficialModalOpen] = useState(false);
    const [selectedChallengeForOfficial, setSelectedChallengeForOfficial] = useState<number | null>(null);
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [selectedChallengeForReport, setSelectedChallengeForReport] = useState<ChallengeItem | null>(null);

    const limit = 10;

    const { data: challengeList, isLoading } = useGetAllChallengesListQuery({
        page,
        limit,
    });
    const { data, isLoading: isAutoAcceptLoading } = useGetAutoAcceptChallengeQuery();
    const [toggleAutoAcceptChallenge] = useToggleAutoAcceptChallengeMutation();
    const [acceptChallenge, { isLoading: isAcceptLoading }] = useAdminAcceptChallengeMutation();
    const [declineChallenge, { isLoading: isDeclineLoading }] = useAdminDeclineChallengeMutation();

    const tableHeader = [
        "Challenge No",
        "Game",
        "Challenger",
        "Target Player",
        "Amount",
        "Status",
        "winner",
        "Make Official",
        "Actions",
    ];
    const isAutoAcceptOn = data?.data?.value === "true";
    const challenges: ChallengeItem[] = challengeList?.data ?? []

    const meta = {
        page: challengeList?.meta?.current_page ?? 1,
        limit: challengeList?.meta?.per_page ?? 10,
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
    const handleAutoAcceptToggle = async () => {
        try {
            setIsToggling(true);

            await toggleAutoAcceptChallenge({
                value: isAutoAcceptOn ? "false" : "true",
            }).unwrap();

            toast.success(
                `Auto Accept ${!isAutoAcceptOn ? "Enabled" : "Disabled"
                } successfully`
            );
        } catch (error: any) {
            toast.error(
                error?.data?.message || "Failed to update setting"
            );
        } finally {
            setIsToggling(false);
        }
    };
    const handleMakeOfficial = (id: number) => {
        setSelectedChallengeForOfficial(id);
        setOfficialModalOpen(true);
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
                const isAccepted = item.status?.toLowerCase() === "accepted" && item.is_published === false;

                const winnerName = item.winner_id
                    ? item.challenger?.id === item.winner_id
                        ? item.challenger?.name
                        : item.acceptor?.id === item.winner_id
                            ? item.acceptor?.name
                            : null
                    : null;

                if (winnerName) {
                    return (
                        <span className="text-yellow-400 font-medium text-sm">
                            {winnerName}
                        </span>
                    );
                }

                return (
                    <div className="flex items-center gap-2">
                        {item.status === "under_review" &&
                            <Button
                                type="button"
                                onClick={() => {
                                    setSelectedChallengeForReport(item);
                                    setReportModalOpen(true);
                                }}
                                className="bg-pink-500! text-black! text-xs! px-3! py-1! h-auto! hover:bg-pink-400!"
                            >
                                <View className="size-3.5 mr-1" />
                                View Reports
                            </Button>
                        }
                        {isAccepted ? (
                            <Button
                                type="button"
                                onClick={() => {
                                    setSelectedChallengeForWinner(item);
                                    setWinnerModalOpen(true);
                                }}
                                className="!bg-yellow-500 !text-black !text-xs !px-3 !py-1 !h-auto hover:!bg-yellow-400"
                            >
                                <Trophy className="size-3.5 mr-1" />
                                Select Winner
                            </Button>
                        ) : (<>
                            {item.published_match_id ? (
                                <Link href={`/admin/dashboard/matches?search=${item.published_match_id}`}><Button className="!text-white !bg-white/20 !border !border-white/20 !hover:!bg-white/30"> Go to Match Management </Button></Link>
                            ) : (
                                <span className="text-white"></span>
                            )}
                        </>
                        )}
                    </div>
                );
            },
            (item) => {
                const isMakeOfficialEnabled = item.status?.toLowerCase() === "accepted" && item.is_published === false;
                return (
                    <Button
                        className="text-white bg-white/20 border border-white/20 hover:bg-white/30
                        px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200
                        flex items-center gap-2 hover:scale-105 active:scale-95"
                        disabled={!isMakeOfficialEnabled}
                        onClick={() => handleMakeOfficial(item.id)}
                    >
                        Make Official
                    </Button>
                )
            },
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
                <ToggleCard
                    title="Auto Accept"
                    description={
                        isAutoAcceptOn
                            ? "Challenges are accepted automatically"
                            : "Manual acceptance required"
                    }
                    checked={isAutoAcceptOn}
                    loading={isToggling}
                    disabled={isAutoAcceptLoading}
                    onToggle={handleAutoAcceptToggle}
                />
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
                {selectedChallengeForWinner && (
                    <WinnerSelectModal
                        open={winnerModalOpen}
                        onOpenChange={(open) => {
                            setWinnerModalOpen(open);
                            if (!open) setSelectedChallengeForWinner(null);
                        }}
                        challengeId={selectedChallengeForWinner.id}
                        challenger={selectedChallengeForWinner.challenger}
                        acceptor={selectedChallengeForWinner.acceptor!}
                    />
                )}
                {selectedChallengeForReport && (
                    <ChallengeReportModal
                        open={reportModalOpen}
                        onOpenChange={(open) => {
                            setReportModalOpen(open);
                            if (!open) setSelectedChallengeForReport(null);
                        }}
                        challenge={selectedChallengeForReport}
                    />
                )}
                {selectedChallengeForOfficial && (
                    <MakeOfficialModal
                        open={officialModalOpen}
                        onOpenChange={(open) => {
                            setOfficialModalOpen(open);
                            if (!open) setSelectedChallengeForOfficial(null);
                        }}
                        challengeId={selectedChallengeForOfficial}
                    />
                )}
            </div>
        </div>
    );
}