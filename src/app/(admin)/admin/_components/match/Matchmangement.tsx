"use client";

import { ReactNode, useState } from "react";
import MatchListToolbar from "../reusable/MatchListToolbar";
import ReuseAbleTable from "@/shared/UI/reusable/table/ReuseAbleTable";
import AppPagination from "../topComponent/AppPagination";
import { IMatch } from "@/types/match/MatchManagementTypes";
import { useDeleteMatchMutation, useGetAllMatchesQuery } from "@/redux/features/match/matchManagement";
import CreateMatchModal from "./CreateMatchModal";
import ViewMatchModal from "./ViewMatchModal";
import EditMatchModal from "./EditMatchModal";
import WinnerSelectModal from "./WinnerSelectModal";
import Link from "next/link";
import { formateDate, formateTime } from "@/shared/lib/utils/dateFormater";
import MatchConfirmationModal from "./MatchConfirmationModal";


export default function MatchManagement() {
    const [page, setPage] = useState(1);
    const [matchType, setMatchType] = useState("all");
    const limit = 10;
    const [open, setOpen] = useState(false);
    const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);
    const [viewOpen, setViewOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [winnerModalOpen, setWinnerModalOpen] = useState(false);
    const [winnerMatchId, setWinnerMatchId] = useState<number | null>(null);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [confirmMatchId, setConfirmMatchId] = useState<number | null>(null);
    const handleConfirm = (id: number) => {
        setConfirmMatchId(id);
        setConfirmModalOpen(true);
    };
    const handleSelectWinner = (id: number) => {
        setWinnerMatchId(id);
        setWinnerModalOpen(true);
    };

    const { data, isLoading } = useGetAllMatchesQuery({
        page,
        limit,
        type: matchType,
    });
    const [deleteMatch] = useDeleteMatchMutation();
    const matches: IMatch[] = data?.data ?? [];
    const meta = {
        page: data?.meta?.current_page ?? 1,
        limit: data?.meta?.per_page ?? 10,
        total: data?.meta?.total ?? 0,
        prev: false,
        next: false
    };

    const tableHeader = [
        "Match No",
        "Player 01",
        "Player 02",
        "Game Name",
        "Live Link",
        "Match Date",
        "Match Time",
        "Players Bet",
        "Player One Total Support",
        "Player Two Total Support",
        "Confirm Match",
        "Winner",
        "Actions",
    ];
    const handleView = (id: number) => {
        setSelectedMatchId(id);
        setViewOpen(true);
    };

    const handleEdit = (id: number) => {
        setSelectedMatchId(id);
        setEditOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this match?")) return;

        try {
            await deleteMatch(id).unwrap();
        } catch (error) {
            console.error(error);
        }
    };
    const tableRowDataRenderers: ((item: IMatch, index: number) => ReactNode)[] = [

        (item) => <span className="text-white">{item.match_no}</span>,

        (item) => (
            <span className="text-white">{item.player_one?.name}</span>
        ),

        (item) => (
            <span className="text-white">{item.player_two?.name}</span>
        ),

        (item) => (
            <span className="text-white">{item.game?.name}</span>
        ),

        (item) => (
            <span>
                {item.tiktok_link ? (
                    <Link
                        href={item.tiktok_link}
                        target="_blank"
                        className="text-blue-500 font-semibold"
                    >
                        Live
                    </Link>
                ) : "N/A"}
            </span>
        ),


        (item) => (
            <span className="text-white">
                {formateDate(item.match_date!)}
            </span>
        ),


        (item) => (
            <span className="text-white">
                {formateTime(item.match_time!)}
            </span>
        ),
        (item) => {
            return (
                <span className="text-white">
                    {item.player_one_bet}
                </span>
            )
        },
        (item) => {
            return (
                <span className="text-white">
                    {item.player_one_total}
                </span>
            )
        },
        (item) => {
            return (
                <span className="text-white">
                    {item.player_two_total}
                </span>
            )
        },
        (item) => {
            if (item.confirmation_status === 0) {
                return (
                    <button
                        onClick={() => handleConfirm(item.id!)}
                        className="px-3 py-1 text-xs text-white bg-purple-600 hover:bg-purple-500 rounded-md"
                    >
                        Select Confirm
                    </button>
                )
            } else if (item.confirmation_status === 1) {
                return (
                    <span className="text-white bg-green-600 px-3 py-1 rounded-md">
                        Confirmed
                    </span>
                )
            } else {
                return (
                    <span className="text-white bg-red-600 px-3 py-1 rounded-md">
                        Cancelled
                    </span>
                )
            }
        },

        (item) => {

            if (item.confirmation_status === 1 && item.winner_id === null) {
                return (
                    <button
                        onClick={() => handleSelectWinner(item.id!)}
                        className="px-3 py-1 text-xs bg-purple-600 rounded-md text-white hover:bg-purple-500"
                    >
                        Select Winner
                    </button>
                );
            }

            return (
                <span className="text-white">
                    {item.winner?.name ?? "-"}
                </span>
            );
        },

        (item) => (
            <div className="flex gap-2">

                <button
                    onClick={() => handleView(item.id)}
                    className="px-3 py-1 text-xs bg-blue-600 rounded-md text-white hover:bg-blue-500"
                >
                    View
                </button>

                <button
                    onClick={() => handleEdit(item.id)}
                    className="px-3 py-1 text-xs bg-yellow-500 rounded-md text-black hover:bg-yellow-400"
                >
                    Edit
                </button>

                <button
                    onClick={() => handleDelete(item.id)}
                    className="px-3 py-1 text-xs bg-red-600 rounded-md text-white hover:bg-red-500"
                >
                    Delete
                </button>

            </div>
        ),
    ];
    return (
        <div>
            <MatchListToolbar
                title="Match List"
                matchType={matchType}
                selectPlaceholder="All"
                onMatchTypeChange={(v) => {
                    setMatchType(v);
                    setPage(1);
                }}
                matchTypeOptions={[
                    { label: "All", value: "all" },
                    { label: "Live", value: "live" },
                    { label: "Upcoming", value: "upcoming" },
                    { label: "Completed", value: "completed" },
                ]}
                onCreateMatch={() => setOpen(true)}
            />

            <div className="py-10">
                <ReuseAbleTable
                    isLoadings={isLoading}
                    currentItems={matches}
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
            <CreateMatchModal
                open={open}
                onClose={() => setOpen(false)}
            />
            <ViewMatchModal
                matchId={selectedMatchId}
                open={viewOpen}
                onClose={() => setViewOpen(false)}
            />
            <EditMatchModal
                matchId={selectedMatchId}
                open={editOpen}
                onClose={() => setEditOpen(false)}
            />
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