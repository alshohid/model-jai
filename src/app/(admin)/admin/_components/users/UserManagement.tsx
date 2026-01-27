"use client";

import { ReactNode, useState } from "react";
import MatchListToolbar from "../reusable/MatchListToolbar";
import ReuseAbleTable from "@/shared/UI/reusable/table/ReuseAbleTable";
import AppPagination from "../topComponent/AppPagination";
import { useClientPagination } from "../../hook/useClientPagination";
import ActionIconButton from "../reusable/ActionIconButton";
import { Eye, Pencil, Trash2, UserPlus, MoreVertical } from "lucide-react";
import SelectUserAsPlayerDialog from "./SelectUserAsPlayerDialog";
import AppDropdownMenu from "@/shared/components/dropdown/AppDropdownMenu";
import SuspendUserModal from "./SuspendUserModal";
import DisableUserModal from "./DisableUserModal";


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
    const [showSelectPlayerDialog, setShowSelectPlayerDialog] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    
    // Suspend/Disable modals state
    const [suspendModalOpen, setSuspendModalOpen] = useState(false);
    const [disableModalOpen, setDisableModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<RankRowItem | null>(null);
    
    // Dropdown open state for each row (using item id as key)
    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

    // Mock users data - in real app, fetch from API
    const allUsers = [
        { id: "1", name: "Cameron Williamson", email: "cameron@example.com", isPlayer: false },
        { id: "2", name: "Leslie Alexander", email: "leslie@example.com", isPlayer: true },
        { id: "3", name: "Floyd Miles", email: "floyd@example.com", isPlayer: false },
        { id: "4", name: "Arlene McCoy", email: "arlene@example.com", isPlayer: true },
    ];

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

    const handleSuspendClick = (item: RankRowItem) => {
        setSelectedUser(item);
        setSuspendModalOpen(true);
        setOpenDropdownId(null); // Close dropdown when modal opens
    };

    const handleDisableClick = (item: RankRowItem) => {
        setSelectedUser(item);
        setDisableModalOpen(true);
        setOpenDropdownId(null); // Close dropdown when modal opens
    };

    const tableRowDataRenderers: ((item: RankRowItem, index: number) => ReactNode)[] = [
        (item) => <span className="text-[#FFFFFF]">{item.user_name}</span>,
        (item) => <span className="text-[#FFFFFF]">{item.referral_no}</span>,
        (item) => <span className="text-[#FFFFFF]">{item.referral_used_by}</span>,
        (item) => <span className="text-[#FFFFFF]">{item.game_name}</span>,
        (item) => (
            <div className="flex items-center gap-2">
                <ActionIconButton
                    label="View"
                    icon={<Eye className="h-4 w-4" />}
                    onClick={() => console.log("view", item)}
                />
                <ActionIconButton
                    label="Edit"
                    icon={<Pencil className="h-4 w-4" />}
                    onClick={() => console.log("edit", item)}
                />
                
                {/* Three Dot Menu */}
                <div className="relative">
                    <AppDropdownMenu
                        open={openDropdownId === item.id}
                        onOpenChange={(open) => {
                            setOpenDropdownId(open ? item.id : null);
                        }}
                        trigger={
                            <button
                                type="button"
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center transition-colors"
                            >
                                <MoreVertical className="h-4 w-4 text-white" />
                            </button>
                        }
                        items={[
                            {
                                label: "Suspend",
                                onSelect: () => handleSuspendClick(item),
                                className: "text-white hover:bg-white/10",
                            },
                            { type: "separator" },
                            {
                                label: "Disable",
                                onSelect: () => handleDisableClick(item),
                                className: "text-white hover:bg-white/10",
                            },
                        ]}
                        contentClassName="min-w-[160px] bg-[#5952FF] border-0"
                    />
                </div>
            </div>
        ),
    ];

    const handleSelectAsPlayer = (userId: string) => {
        console.log("Select user as player:", userId);
        // TODO: Call API to update user as player
        setShowSelectPlayerDialog(false);
    };

    return (
        <div>
            <MatchListToolbar
                title="User List"
                ctaLabel="Select User as Player"
                matchType={matchType}
                onMatchTypeChange={(v) => {
                    setMatchType(v);
                    setPage(1);
                    console.log("select box match type ", v);
                }}
                matchTypeOptions={[
                    { label: "User Type", value: "all" },
                    { label: "Live", value: "live" },
                    { label: "Upcoming", value: "upcoming" },
                    { label: "Completed", value: "completed" },
                ]}
                onCreateMatch={() => setShowSelectPlayerDialog(true)}
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

            {/* Select User as Player Dialog */}
            <SelectUserAsPlayerDialog
                open={showSelectPlayerDialog}
                onOpenChange={setShowSelectPlayerDialog}
                users={allUsers}
                onSelectAsPlayer={handleSelectAsPlayer}
                onSearch={(query) => setSearchQuery(query)}
            />

            {/* Suspend User Modal */}
            <SuspendUserModal
                isOpen={suspendModalOpen}
                onClose={() => {
                    setSuspendModalOpen(false);
                    setSelectedUser(null);
                    setOpenDropdownId(null); // Ensure dropdown is closed
                }}
                userName={selectedUser?.user_name || "Cameron Williamson"}
                userId={`#${selectedUser?.id || "8832"}`}
                userImage="/images/home/user.png"
                isActive={true}
            />

            {/* Disable User Modal */}
            <DisableUserModal
                isOpen={disableModalOpen}
                onClose={() => {
                    setDisableModalOpen(false);
                    setSelectedUser(null);
                    setOpenDropdownId(null); // Ensure dropdown is closed
                }}
                userName={selectedUser?.user_name || "Cameron Williamson"}
                userId={`#${selectedUser?.id || "8832"}`}
                userImage="/images/home/user.png"
                isActive={true}
            />
        </div>
    );
}
