"use client";

import { ReactNode,useState } from "react";
import MatchListToolbar from "../reusable/MatchListToolbar";
import ReuseAbleTable from "@/shared/UI/reusable/table/ReuseAbleTable";
import AppPagination from "../topComponent/AppPagination";
import { useClientPagination } from "../../hook/useClientPagination";


type RankRowItem = {
    id: number;
    match_no?: string;
    player_1?: string;
    player_2?: string;
    game_name?: string;
    winner?: string;
};
const allItems: RankRowItem[] = [
    { id: 1, match_no: "001", player_1: "Cameron Williamson", player_2: "Cameron Williamson", game_name: "FC 26", winner: "Player 01" },
    { id: 2, match_no: "002", player_1: "Leslie Alexander", player_2: "Cameron Williamson", game_name: "FC 26", winner: "Player 01" },
    { id: 3, match_no: "003", player_1: "Floyd Miles", player_2: "Cameron Williamson", game_name: "FC 26", winner: "Player 01" },
    { id: 4, match_no: "004", player_1: "Arlene McCoy", player_2: "Cameron Williamson", game_name: "FC 26", winner: "Player 01" },
    { id: 5, match_no: "005", player_1: "Jerome Bell", player_2: "Cameron Williamson", game_name: "FC 26", winner: "Player 01" },
    { id: 6, match_no: "006", player_1: "Ralph Edwards", player_2: "Cameron Williamson", game_name: "FC 26", winner: "Player 01" },
    { id: 7, match_no: "007", player_1: "Guy Hawkins", player_2: "Cameron Williamson", game_name: "FC 26", winner: "Player 01" },
    { id: 8, match_no: "008", player_1: "Eleanor Pena", player_2: "Cameron Williamson", game_name: "FC 26", winner: "Player 01" },
    { id: 9, match_no: "009", player_1: "Jacob Jones", player_2: "Cameron Williamson", game_name: "FC 26", winner: "Player 01" },
    { id: 10, match_no: "010", player_1: "Courtney Henry", player_2: "Cameron Williamson", game_name: "FC 26", winner: "Player 01" },
    { id: 11, match_no: "011", player_1: "Arlene McCoy", player_2: "Cameron Williamson", game_name: "FC 26", winner: "Player 01" },
    { id: 12, match_no: "012", player_1: "Jerome Bell", player_2: "Cameron Williamson", game_name: "FC 26", winner: "Player 01" },
    { id: 13, match_no: "013", player_1: "Ralph Edwards", player_2: "Cameron Williamson", game_name: "FC 26", winner: "Player 01" },
    { id: 14, match_no: "014", player_1: "Guy Hawkins", player_2: "Cameron Williamson", game_name: "FC 26", winner: "Player 01" },
    { id: 15, match_no: "015", player_1: "Eleanor Pena", player_2: "Cameron Williamson", game_name: "FC 26", winner: "Player 01" },
    { id: 16, match_no: "016", player_1: "Jacob Jones", player_2: "Cameron Williamson", game_name: "FC 26", winner: "Player 01" },
    { id: 17, match_no: "017", player_1: "Courtney Henry", player_2: "Cameron Williamson", game_name: "FC 26", winner: "Player 01" },
];

export default function Matchmangement() {
    const [matchType, setMatchType] = useState("all");
    const [limit] = useState(10); 
    const tableHeader = ["Match No", "Player 01", "Player 02", "Game Name", "Winner"];
    const { currentItems, meta, setPage } = useClientPagination({
        items: allItems,
        limit,
        filterFn: (item) => {
            if (matchType === "all") return true;
            // TODO: item.type থাকবে তখন এখানে filter করবে
            return true;
        },
        resetKey: matchType, 
    });

    const tableRowDataRenderers: ((item: RankRowItem, index: number) => ReactNode)[] = [
        (item) => <span className="text-[#FFFFFF]">{item.match_no}</span>,
        (item) => <span className="text-[#FFFFFF]">{item.player_1}</span>,
        (item) => <span className="text-[#FFFFFF]">{item.player_2}</span>,
        (item) => <span className="text-[#FFFFFF]">{item.game_name}</span>,
        (item) => <span className="text-[#FFFFFF]">{item.winner}</span>,
    ];

    return (
        <div>
            <MatchListToolbar
                title="Match List"
                matchType={matchType}
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
                onCreateMatch={() => console.log("create new match")}
            />

            <div className="py-10">
                <ReuseAbleTable
                    isLoadings={false}
                    currentItems={currentItems} 
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
        </div>
    );
}
