"use client";

import { ReactNode,useState } from "react";
import MatchListToolbar from "../reusable/MatchListToolbar";
import ReuseAbleTable from "@/shared/UI/reusable/table/ReuseAbleTable";
import AppPagination from "../topComponent/AppPagination";
import { useClientPagination } from "../../hook/useClientPagination";
import ActionIconButton from "../reusable/ActionIconButton";
import { Eye, Pencil, Trash2 } from "lucide-react";


type RankRowItem = {
    id: number;
    match_no?: string;
    player_1?: string;
    player_2?: string;
    game_name?: string;
    winner?: string;
    referral_no?: string;
    referral_used_by?: string;
    actions?: any;
    user_name: string;
};
const allItems: RankRowItem[] = [
    { id: 1, user_name:"Cameron Williamson", referral_no: "0sdagasgSDRG12513", referral_used_by: "Cameron Williamson", player_2: "Cameron Williamson", game_name: "FC 26", actions: "" },
    { id: 2, user_name: "Cameron Williamson", referral_no: "sdagasgSDRG12513", referral_used_by: "Leslie Alexander", player_2: "Cameron Williamson", game_name: "FC 26", actions: "" },
    { id: 3, user_name: "Cameron Williamson", referral_no: "sdagasgSDRG12513", referral_used_by: "Floyd Miles", player_2: "Cameron Williamson", game_name: "FC 26", actions: "" },
    { id: 4, user_name: "Cameron Williamson", referral_no: "sdagasgSDRG12513", referral_used_by: "Arlene McCoy", player_2: "Cameron Williamson", game_name: "FC 26", actions: "" },
    { id: 5, user_name: "Cameron Williamson", referral_no: "sdagasgSDRG12513", referral_used_by: "Jerome Bell", player_2: "Cameron Williamson", game_name: "FC 26", actions: "" },
    { id: 6, user_name: "Cameron Williamson", referral_no: "sdagasgSDRG12513", referral_used_by: "Ralph Edwards", player_2: "Cameron Williamson", game_name: "FC 26", actions: "" },
    { id: 7, user_name: "Cameron Williamson", referral_no: "sdagasgSDRG12513", referral_used_by: "Guy Hawkins", player_2: "Cameron Williamson", game_name: "FC 26", actions: "" },
    { id: 8, user_name: "Cameron Williamson", referral_no: "sdagasgSDRG12513", referral_used_by: "Eleanor Pena", player_2: "Cameron Williamson", game_name: "FC 26", actions: "" },
    { id: 9, user_name: "Cameron Williamson", referral_no: "sdagasgSDRG12513", referral_used_by: "Jacob Jones", player_2: "Cameron Williamson", game_name: "FC 26", actions: "" },
    { id: 10, user_name: "Cameron Williamson", referral_no: "sdagasgSDRG12513", referral_used_by: "Courtney Henry", player_2: "Cameron Williamson", game_name: "FC 26", actions: "" },
    { id: 11, user_name: "Cameron Williamson", referral_no: "sdagasgSDRG12513", referral_used_by: "Arlene McCoy", player_2: "Cameron Williamson", game_name: "FC 26", actions: "" },
    { id: 12, user_name: "Cameron Williamson", referral_no: "sdagasgSDRG12513", referral_used_by: "Jerome Bell", player_2: "Cameron Williamson", game_name: "FC 26", actions: "" },
    { id: 13, user_name: "Cameron Williamson", referral_no: "sdagasgSDRG12513", referral_used_by: "Ralph Edwards", player_2: "Cameron Williamson", game_name: "FC 26", actions: "" },
    { id: 14, user_name: "Cameron Williamson", referral_no: "sdagasgSDRG12513", referral_used_by: "Guy Hawkins", player_2: "Cameron Williamson", game_name: "FC 26", actions: "" },
    { id: 15, user_name: "Cameron Williamson", referral_no: "sdagasgSDRG12513", referral_used_by: "Eleanor Pena", player_2: "Cameron Williamson", game_name: "FC 26", actions: "" },
    { id: 16, user_name: "Cameron Williamson", referral_no: "sdagasgSDRG12513", referral_used_by: "Jacob Jones", player_2: "Cameron Williamson", game_name: "FC 26", actions: "" },
    { id: 17, user_name: "Cameron Williamson", referral_no: "sdagasgSDRG12513", referral_used_by: "Courtney Henry", player_2: "Cameron Williamson", game_name: "FC 26", actions: "" },
];

export default function UserManagement() {
    const [matchType, setMatchType] = useState("all");
    const [limit] = useState(10); 
    const tableHeader = ["User Name", "Referral No", "Referral Used By", "Game Name", "Actions"];
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
        (item) => <span className="text-[#FFFFFF]">{item.user_name}</span>,
        (item) => <span className="text-[#FFFFFF]">{item.referral_no}</span>,
        (item) => <span className="text-[#FFFFFF]">{item.referral_used_by}</span>,
        (item) => <span className="text-[#FFFFFF]">{item.game_name}</span>,
        (item) => <span className="text-[#FFFFFF]">{
            <div className="flex items-center gap-2">
                <ActionIconButton
                    label="View"
                    icon={<Eye className="h-4 w-4" />}
                    onClick={() => console.log("view")}
                />
                <ActionIconButton
                    label="Edit"
                    icon={<Pencil className="h-4 w-4" />}
                    onClick={() => console.log("edit")}
                />
                <ActionIconButton
                    label="Delete"
                    tone="danger"
                    icon={<Trash2 className="h-4 w-4" />}
                    onClick={() => console.log("delete")}
                />
            </div>
        }</span>,
    ];

    return (
        <div>
            <MatchListToolbar
                title="User List"
                ctaLabel="create new User"
                matchType={matchType}
                onMatchTypeChange={(v) => {
                    setMatchType(v);
                    setPage(1); 
                    console.log("slect box match type ", v)
                }}
                matchTypeOptions={[
                    { label: "User Type", value: "all" },
                    { label: "Live", value: "live" },
                    { label: "Upcoming", value: "upcoming" },
                    { label: "Completed", value: "completed" },
                ]}
                onCreateMatch={() => console.log("create new User")}
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
