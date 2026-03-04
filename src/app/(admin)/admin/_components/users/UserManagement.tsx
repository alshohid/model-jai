/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ReactNode, useState } from "react";
import MatchListToolbar from "../reusable/MatchListToolbar";
import ReuseAbleTable from "@/shared/UI/reusable/table/ReuseAbleTable";
import AppPagination from "../topComponent/AppPagination";
import ActionIconButton from "../reusable/ActionIconButton";
import { Eye, Pencil, MoreVertical, PlusIcon } from "lucide-react";
import SelectUserAsPlayerDialog from "./SelectUserAsPlayerDialog";
import AppDropdownMenu from "@/shared/components/dropdown/AppDropdownMenu";
import SuspendUserModal from "./SuspendUserModal";
import DisableUserModal from "./DisableUserModal";
import { useChangeUserRoleMutation, useGetAllUsersQuery, useSearchUsersQuery } from "@/redux/features/user/userManagement";
import { getSuspendStatus } from "@/shared/lib/utils/getSuspendStatus";
import ViewUserModal from "./ViewUserModal";
import EditUserModal from "./EditUserModal";
import { Button } from "@/components/ui/button";
import CreateUserModal from "./CreateUserModal";
import { toast } from "sonner";
import { useDebounce } from "../../hook/useDebounce";


export type RankRowItem = {
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
    suspended_until: string | null;
    is_permanent_suspended: boolean;
    status?: string;
    image?: string;
};

export default function UserManagement() {

    const [showSelectPlayerDialog, setShowSelectPlayerDialog] = useState(false);
    const [suspendModalOpen, setSuspendModalOpen] = useState(false);
    const [disableModalOpen, setDisableModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<RankRowItem | null>(null);
    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [createUserModalOpen, setCreateUserModalOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [keyword, setKeyword] = useState("");
    const debouncedKeyword = useDebounce(keyword, 400);
    const [filterType, setFilterType] = useState<"all" | "players" | "non-players">("all");

    const roleParam =
        filterType === "players"
            ? "artist"
            : filterType === "non-players"
                ? "user"
                : "";
    const { data: searchListData, isLoading: isSearchLoading } =
        useSearchUsersQuery({
            keyword,
            role: roleParam,
        });
    const { data: usersData, isLoading, isFetching } =
        useGetAllUsersQuery({ page });
    const [changeUserRole] = useChangeUserRoleMutation();


    const searchUserList =
        searchListData?.data?.map((user) => ({
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image,
        })) ?? [];

    const users =
        usersData?.data?.map((user) => ({
            id: user?.id,
            user_name: user?.name,
            referral_no: user?.referral_no,
            referral_used_by: user?.role,
            game_name: user?.email,
            suspended_until: user?.suspended_until,
            is_permanent_suspended: user?.is_permanent_suspended,
            image: user?.image,
        })) ?? [];

    const meta = {
        currentPage: usersData?.meta?.currentPage ?? 1,
        lastPage: usersData?.meta?.lastPage ?? 1,
        total: usersData?.meta?.total ?? 0,
        perPage: usersData?.meta?.perPage ?? 10,
    }
    const tableHeader = ["User Name", "Referral No", "Role", "Email", "Status", "Actions"];


    const handleSuspendClick = (item: RankRowItem) => {
        setSelectedUser(item);
        setSuspendModalOpen(true);
        setOpenDropdownId(null);
    };

    const handleDisableClick = (item: RankRowItem) => {
        setSelectedUser(item);
        setDisableModalOpen(true);
        setOpenDropdownId(null);
    };

    const tableRowDataRenderers: ((item: RankRowItem, index: number) => ReactNode)[] = [
        (item) => {
            const status = getSuspendStatus(item);

            const color =
                status === "permanent"
                    ? "text-red-500"
                    : status === "temporary"
                        ? "text-orange-400"
                        : "text-white";

            return <span className={color}>{item.user_name}</span>;
        },
        (item) => <span className="text-[#FFFFFF]">{item.referral_no}</span>,
        (item) => <span className="text-[#FFFFFF]">{item.referral_used_by}</span>,
        (item) => <span className="text-[#FFFFFF]">{item.game_name}</span>,
        (item) => {
            const status = getSuspendStatus(item);

            return (
                <div className="flex items-center gap-2">
                    <span className="text-white">{item?.referral_used_by}</span>

                    {status === "permanent" && (
                        <span className="text-xs bg-red-600/20 text-red-500 px-2 py-1 rounded">
                            Permanently Suspended
                        </span>
                    )}

                    {status === "temporary" && (
                        <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded">
                            Suspended
                        </span>
                    )}
                </div>
            );
        },
        (item) => (
            <div className="flex items-center gap-2">
                <ActionIconButton
                    label="View"
                    icon={<Eye className="h-4 w-4" />}
                    onClick={() => {
                        setSelectedUser(item);
                        setViewModalOpen(true);
                    }}
                />

                <ActionIconButton
                    label="Edit"
                    icon={<Pencil className="h-4 w-4" />}
                    onClick={() => {
                        setSelectedUser(item);
                        setEditModalOpen(true);
                    }}
                />

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
                            ...(getSuspendStatus(item) === "active"
                                ? [
                                    {
                                        label: "Suspend",
                                        onSelect: () => handleSuspendClick(item),
                                        className: "text-white hover:bg-white/10",
                                    },
                                ]
                                : [
                                    {
                                        label: "Unsuspend",
                                        onSelect: () => handleDisableClick(item),
                                        className: "text-white hover:bg-white/10",
                                    },
                                ]),
                        ]}
                        contentClassName="min-w-[160px] bg-[#5952FF] border-0"
                    />
                </div>
            </div>
        ),
    ];


    const handleSelectAsPlayer = async (userId: string) => {
        try {
            const res = await changeUserRole({
                id: Number(userId),
            }).unwrap();

            toast.success(res?.message || "User is now a player");
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to change role");
        }
    };

    return (
        <div>
            <div className="w-full flex flex-end items-center gap-4 ">

                <MatchListToolbar
                    title="User List"
                    ctaLabel="Select User as Player"
                    showSelect={false}
                    onCreateMatch={() => setShowSelectPlayerDialog(true)}
                />
                <Button onClick={() => setCreateUserModalOpen(true)}>
                    <span><PlusIcon /></span> Add User
                </Button>
            </div>

            <div className="py-10">
                <ReuseAbleTable
                    isLoadings={isLoading || isFetching}
                    currentItems={users}
                    tableHeader={tableHeader}
                    tableRowDataRenderers={tableRowDataRenderers}
                    isBg={false}
                    minTableWidthPx={1320}
                    variant="rank-dark"
                />

                <div className="mt-6">

                    <AppPagination
                        meta={meta as any}
                        onPageChange={(newPage) => setPage(newPage)}
                        showSummary={false}
                    />
                </div>
            </div>

            <SelectUserAsPlayerDialog
                open={showSelectPlayerDialog}
                onOpenChange={setShowSelectPlayerDialog}
                users={searchUserList}
                isLoading={isSearchLoading}
                filterType={filterType}
                setFilterType={setFilterType}
                keyword={keyword}
                setKeyword={setKeyword}
                onSelectAsPlayer={handleSelectAsPlayer}
            />
            <SuspendUserModal
                isOpen={suspendModalOpen}
                onClose={() => {
                    setSuspendModalOpen(false);
                    setSelectedUser(null);
                    setOpenDropdownId(null);
                }}
                userName={selectedUser?.user_name || ""}
                userId={selectedUser?.id || 0}
                userImage={(selectedUser?.image) || "/images/home/avatar_1.png"}
                status={selectedUser?.status || ""}
            />

            <DisableUserModal
                isOpen={disableModalOpen}
                onClose={() => {
                    setDisableModalOpen(false);
                    setSelectedUser(null);
                    setOpenDropdownId(null);
                }}
                userName={selectedUser?.user_name || ""}
                userId={selectedUser?.id || 0}
                userImage={(selectedUser?.image) || "/images/home/avatar_1.png"}
                status={selectedUser?.status || ""}
            />
            <ViewUserModal
                open={viewModalOpen}
                onClose={() => setViewModalOpen(false)}
                userId={selectedUser?.id ?? null}
            />

            <EditUserModal
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                userId={selectedUser?.id ?? null}
            />
            <CreateUserModal
                isOpen={createUserModalOpen}
                onClose={() => setCreateUserModalOpen(false)}
            />
        </div>
    );
}
