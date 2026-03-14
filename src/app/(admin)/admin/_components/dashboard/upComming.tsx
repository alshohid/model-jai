/* eslint-disable @next/next/no-img-element */
"use client";

import { ReactNode, useState } from "react";
import ReuseAbleTable from "@/shared/UI/reusable/table/ReuseAbleTable";
import { IMatch } from "@/types/match/MatchManagementTypes";
import WinnerSelectModal from "../match/WinnerSelectModal";
import MatchConfirmationModal from "../match/MatchConfirmationModal";
import { useGetUpcomingMatchDataQuery } from "@/redux/features/dashboard/dashboardManagement";
import PrimaryCtaButton from "../reusable/PrimaryCtaButton";
import LiveController from "./LiveController";



export default function UpComming() {
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

    const { data, isLoading } = useGetUpcomingMatchDataQuery({ page: 1, limit: 50 });
    const matches: IMatch[] = data?.data ?? [];


    const tableHeader = [

        "Player 01",
        "Player 02",
        "Players Bet",
        "Player One Total Support",
        "Player Two Total Support",
        "Confirm Match",
        "Winner",
    ];

    const tableRowDataRenderers: ((item: IMatch, index: number) => ReactNode)[] = [


        (item) => (
            <PlayerWithImage
                name={item.player_one?.name}
                image={item.player_one?.image_url || item.player_one?.image}
            />
        ),

        (item) => (
            <PlayerWithImage
                name={item.player_two?.name}
                image={item.player_two?.image_url || item.player_two?.image}
            />
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
            }
            else if (item.confirmation_status === 1 && item.winner_id === null) {
                return (
                    <span className="text-white bg-pink-600 px-3 py-2 rounded-md">
                        Running Match
                    </span>
                )
            }
            else if (item.confirmation_status === 1 && item.winner_id !== null) {
                return (
                    <span className="text-white bg-green-600 px-3 py-2 rounded-md">
                        Completed
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

    ];
    return (
        <div className="w-full">
            <div className="flex items-center justify-between">
                <h2 className="text-white text-2xl font-semibold">Upcoming Matches</h2>
                <LiveController />

            </div>


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
}: {
    name?: string;
    image?: string | null;
}) => {
    const imageSrc =
        image && image.startsWith("http")
            ? image
            : "/images/home/avatar_1.png";

    return (
        <div className="flex items-center gap-3 min-w-[180px]">
            <img
                src={imageSrc}
                alt={name || "player"}
                className="w-10 h-10 rounded-full object-cover border border-white/10"
                onError={(e) => {
                    e.currentTarget.src = "/images/home/avatar_1.png";
                }}
            />
            <span className="text-white font-medium truncate">
                {name || "N/A"}
            </span>
        </div>
    );
};