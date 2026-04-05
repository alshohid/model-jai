/* eslint-disable @next/next/no-img-element */
"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import ReuseAbleTable from "@/shared/UI/reusable/table/ReuseAbleTable";
import { IMatch } from "@/types/match/MatchManagementTypes";
import WinnerSelectModal from "../match/WinnerSelectModal";
import MatchConfirmationModal from "../match/MatchConfirmationModal";
import { useGetUpcomingMatchDataQuery } from "@/redux/features/dashboard/dashboardManagement";
import LiveController from "./LiveController";
import { useStartAdminVotingMutation } from "@/redux/features/user/userManagement";
import { getErrorMessage } from "@/lib/utils";

function parseApiDateTime(value?: string | null) {
    if (!value) return null;

    const normalized = value.includes("T") ? value : value.replace(" ", "T");
    const date = new Date(normalized);

    return Number.isNaN(date.getTime()) ? null : date;
}

function getVotingEndTime(match: IMatch) {
    const startTime = parseApiDateTime(match.vote_start_time);
    const votingMinutes = Number(match.voting_time ?? 0);

    if (!startTime || !Number.isFinite(votingMinutes) || votingMinutes <= 0) {
        return null;
    }

    return new Date(startTime.getTime() + votingMinutes * 60 * 1000);
}

function formatCountdown(remainingMs: number) {
    const totalSeconds = Math.max(0, Math.floor(remainingMs / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

type VotingStatusCellProps = {
    item: IMatch;
    now: Date;
    isStarting: boolean;
    onStart: (matchId: number) => void;
};

function VotingStatusCell({
    item,
    now,
    isStarting,
    onStart,
}: VotingStatusCellProps) {
    const canStartVoting =
        item.type === "live" &&
        item.confirmation_status === 1 &&
        item.winner_id == null &&
        Number(item.voting_time ?? 0) > 0;

    if (!canStartVoting) {
        return <span className="text-white/40">-</span>;
    }

    const endTime = getVotingEndTime(item);

    if (!item.vote_start_time || !endTime) {
        return (
            <button
                type="button"
                onClick={() => onStart(item.id)}
                disabled={isStarting}
                className="rounded-md bg-[#0EA5E9] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#38BDF8] disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isStarting ? "Starting..." : "Start Voting"}
            </button>
        );
    }

    const remainingMs = endTime.getTime() - now.getTime();

    if (remainingMs <= 0) {
        return (
            <span className="inline-flex rounded-md bg-amber-500/20 px-3 py-2 text-xs font-semibold text-amber-200">
                Vote Finished
            </span>
        );
    }

    return (
        <div className="space-y-1 text-left">
            <span className="inline-flex rounded-md bg-emerald-500/15 px-3 py-2 text-xs font-semibold text-emerald-200">
                Voting Live
            </span>
            <p className="text-[11px] font-medium text-white/60">
                Ends in {formatCountdown(remainingMs)}
            </p>
        </div>
    );
}

export default function UpComming() {
    const [winnerModalOpen, setWinnerModalOpen] = useState(false);
    const [winnerMatchId, setWinnerMatchId] = useState<number | null>(null);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [confirmMatchId, setConfirmMatchId] = useState<number | null>(null);
    const [startingVoteMatchId, setStartingVoteMatchId] = useState<number | null>(
        null,
    );
    const [votingSessionOverrides, setVotingSessionOverrides] = useState<
        Record<number, Pick<IMatch, "vote_start_time" | "voting_time">>
    >({});
    const [currentTime, setCurrentTime] = useState(() => new Date());
    const [startAdminVoting] = useStartAdminVotingMutation();

    useEffect(() => {
        const timer = window.setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => window.clearInterval(timer);
    }, []);

    const handleConfirm = (id: number) => {
        setConfirmMatchId(id);
        setConfirmModalOpen(true);
    };

    const handleSelectWinner = (id: number) => {
        setWinnerMatchId(id);
        setWinnerModalOpen(true);
    };

    const handleStartVoting = async (matchId: number) => {
        try {
            setStartingVoteMatchId(matchId);
            const response = await startAdminVoting(matchId).unwrap();
            const startedMatch = response.data?.matchData;

            if (startedMatch?.id) {
                setVotingSessionOverrides((prev) => ({
                    ...prev,
                    [startedMatch.id]: {
                        vote_start_time: startedMatch.vote_start_time ?? null,
                        voting_time: startedMatch.voting_time ?? null,
                    },
                }));
            }

            toast.success(response.message || "Voting started successfully");
        } catch (error) {
            toast.error(getErrorMessage(error, "Failed to start voting"));
        } finally {
            setStartingVoteMatchId(null);
        }
    };

    const { data, isLoading } = useGetUpcomingMatchDataQuery({
        page: 1,
        limit: 50,
    });
    const matches: IMatch[] = useMemo(() => {
        const items = data?.data ?? [];

        return items.map((item) => ({
            ...item,
            ...votingSessionOverrides[item.id],
        }));
    }, [data?.data, votingSessionOverrides]);

    const tableHeader = [
        "Player 01",
        "Player 02",
        "Players Bet",
        "Player One Total Support",
        "Player Two Total Support",
        "Voting",
        "Confirm Match",
        "Winner",
    ];

    const tableRowDataRenderers: ((
        item: IMatch,
        index: number,
    ) => ReactNode)[] = [
            (item) => (
                <PlayerWithImage
                    name={item.player_one?.name}
                    logo={item.player_one_logo}
                    image={item.player_one?.image_url || item.player_one?.image}
                />
            ),

            (item) => (
                <PlayerWithImage
                    name={item.player_two?.name}
                    logo={item.player_two_logo}
                    image={item.player_two?.image_url || item.player_two?.image}
                />
            ),

            (item) => <span className="text-white">{item.player_one_bet}</span>,
            (item) => <span className="text-white">{item.player_one_total}</span>,
            (item) => <span className="text-white">{item.player_two_total}</span>,
            (item) => (
                <VotingStatusCell
                    item={item}
                    now={currentTime}
                    isStarting={startingVoteMatchId === item.id}
                    onStart={handleStartVoting}
                />
            ),
            (item) => {
                if (item.confirmation_status === 0) {
                    return (
                        <button
                            type="button"
                            onClick={() => handleConfirm(item.id)}
                            className="rounded-md bg-purple-600 px-3 py-1 text-xs text-white transition hover:bg-purple-500"
                        >
                            Select Confirm
                        </button>
                    );
                }

                if (item.confirmation_status === 1 && item.winner_id === null) {
                    return (
                        <span className="rounded-md bg-pink-600 px-3 py-2 text-white">
                            Running Match
                        </span>
                    );
                }

                if (item.confirmation_status === 1 && item.winner_id !== null) {
                    return (
                        <span className="rounded-md bg-green-600 px-3 py-2 text-white">
                            Completed
                        </span>
                    );
                }

                return (
                    <span className="rounded-md bg-red-600 px-3 py-1 text-white">
                        Cancelled
                    </span>
                );
            },
            (item) => {
                if (item.confirmation_status === 1 && item.winner_id === null) {
                    return (
                        <button
                            type="button"
                            onClick={() => handleSelectWinner(item.id)}
                            className="rounded-md bg-purple-600 px-3 py-1 text-xs text-white transition hover:bg-purple-500"
                        >
                            Select Winner
                        </button>
                    );
                }

                return <span className="text-white">{item.winner?.name ?? "-"}</span>;
            },
        ];

    return (
        <div className="w-full">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-white">
                    Upcoming Matches
                </h2>
                <LiveController />
            </div>

            <div className="py-10">
                <ReuseAbleTable
                    isLoadings={isLoading}
                    currentItems={matches}
                    tableHeader={tableHeader}
                    tableRowDataRenderers={tableRowDataRenderers}
                    isBg={false}
                    minTableWidthPx={1480}
                    variant="rank-dark"
                />
            </div>

            <WinnerSelectModal
                matchId={winnerMatchId}
                open={winnerModalOpen}
                onClose={() => setWinnerModalOpen(false)}
            />
            <MatchConfirmationModal
                matchId={confirmMatchId}
                open={confirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
            />
        </div>
    );
}

const PlayerWithImage = ({
    name,
    image,
    logo,
}: {
    name?: string;
    image?: string | null;
    logo?: string | null;
}) => {
    const imageSrc =
        (typeof logo === "string" && logo.startsWith("http") && logo) ||
        (typeof image === "string" && image.startsWith("http") && image) ||
        "/images/home/avatar_1.png";

    return (
        <div className="flex min-w-[180px] items-center gap-3">
            <img
                src={imageSrc}
                alt={name || "player"}
                className="h-10 w-10 rounded-xl border border-white/10 object-cover"
                onError={(event) => {
                    event.currentTarget.src = "/images/home/avatar_1.png";
                }}
            />
            <span className="truncate font-medium text-white">
                {name || "N/A"}
            </span>
        </div>
    );
};
