"use client";

import { ReactNode, useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { FiSearch } from "react-icons/fi";
import { toast } from "sonner";
import { useGetAllGamesQuery } from "@/redux/features/game/gameListManagement";
import {
    useCreatePopularArtistVoteMutation,
    useDeletePopularArtistVoteMutation,
    useGetAllPopularArtistQuery,
    useUpdatePopularArtistVoteMutation,
} from "@/redux/features/match/matchManagement";
import { useGetAllPlayerQuery } from "@/redux/features/user/userManagement";
import {
    ICreatePopularArtistPayload,
    IPopularArtist,
} from "@/types/match/popularArtistTypes";
import { formateDate } from "@/shared/lib/utils/dateFormater";
import { cn } from "@/lib/utils";
import ReuseAbleTable from "@/shared/UI/reusable/table/ReuseAbleTable";
import MatchListToolbar from "../../_components/reusable/MatchListToolbar";
import ActionIconButton from "../../_components/reusable/ActionIconButton";
import AppPagination from "../../_components/topComponent/AppPagination";
import PopularArtistFormDialog from "./components/PopularArtistFormDialog";

const DEFAULT_LIMIT = 10;

export default function PopularArtistPage() {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [formMode, setFormMode] = useState<"create" | "edit">("create");
    const [selectedEntry, setSelectedEntry] = useState<IPopularArtist | null>(
        null,
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState("");

    const { data: gamesResponse } = useGetAllGamesQuery();
    const { data: playersResponse } = useGetAllPlayerQuery();

    const { data, isLoading, isFetching } = useGetAllPopularArtistQuery({
        page,
        limit: DEFAULT_LIMIT,
        search: debouncedSearch || undefined,
    });

    const [createPopularArtist] = useCreatePopularArtistVoteMutation();
    const [updatePopularArtist] = useUpdatePopularArtistVoteMutation();
    const [deletePopularArtist] = useDeletePopularArtistVoteMutation();

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm.trim());
            setPage(1);
        }, 350);

        return () => clearTimeout(handler);
    }, [searchTerm]);

    const games = gamesResponse?.data ?? [];
    const players = playersResponse?.data ?? [];
    const items: IPopularArtist[] = data?.data ?? [];

    const meta = {
        page: data?.meta?.current_page ?? page,
        limit: data?.meta?.per_page ?? DEFAULT_LIMIT,
        total: data?.meta?.total ?? 0,
        prev: data?.meta?.prev ?? false,
        next: data?.meta?.next ?? false,
    };

    const openCreateDialog = () => {
        setFormMode("create");
        setSelectedEntry(null);
        setFormError("");
        setDialogOpen(true);
    };

    const openEditDialog = (item: IPopularArtist) => {
        setFormMode("edit");
        setSelectedEntry(item);
        setFormError("");
        setDialogOpen(true);
    };

    const closeDialog = () => {
        setDialogOpen(false);
        setSelectedEntry(null);
        setFormError("");
    };

    const handleSubmit = async (payload: ICreatePopularArtistPayload) => {
        setFormError("");
        setIsSubmitting(true);
        try {
            if (formMode === "create") {
                await createPopularArtist(payload).unwrap();
                toast.success("Voting match created successfully");
            } else if (selectedEntry) {
                await updatePopularArtist({
                    id: selectedEntry.id,
                    ...payload,
                }).unwrap();
                toast.success("Voting match updated successfully");
            }
            closeDialog();
        } catch {
            setFormError("Unable to save vote. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (item: IPopularArtist) => {
        if (!window.confirm("Delete this popular artist vote?")) return;

        try {
            await deletePopularArtist(item.id).unwrap();
            toast.success("Vote deleted successfully");
        } catch {
            toast.error("Unable to delete this vote. Please try again.");
        }
    };

    const tableHeader = [
        "ID",
        "Game",
        "Player One",
        "Player Two",
        "Votes",
        "Created",
        "Actions",
    ];

    const tableRowDataRenderers: ((
        item: IPopularArtist,
        index: number,
    ) => ReactNode)[] = [
        (item) => (
            <span className="font-medium text-white">{item.id}</span>
        ),
        (item) => (
            <span className="font-medium text-white">
                {item.game?.name ?? "Unknown game"}
            </span>
        ),
        (item) => (
            <span className="text-white/85">
                {item.player_one?.name ?? "—"}
            </span>
        ),
        (item) => (
            <span className="text-white/85">
                {item.player_two?.name ?? "—"}
            </span>
        ),
        (item) => (
            <span className="text-white">{item.total_vote ?? 0}</span>
        ),
        (item) => (
            <span className="text-white/70">{formateDate(item.created_at)}</span>
        ),
        (item) => (
            <div className="flex items-center gap-2">
                <ActionIconButton
                    label="Edit vote"
                    icon={<Pencil className="size-4" />}
                    onClick={() => openEditDialog(item)}
                />
                <ActionIconButton
                    label="Delete vote"
                    tone="danger"
                    icon={<Trash2 className="size-4" />}
                    onClick={() => handleDelete(item)}
                />
            </div>
        ),
    ];

    const dialogKey = `${dialogOpen ? "open" : "closed"}-${formMode}-${
        selectedEntry?.id ?? "new"
    }`;

    return (
        <div>
            <MatchListToolbar
                title="Popular Artist Votes"
                ctaLabel="Add Voting Match"
                showSelect={false}
                onCreateMatch={openCreateDialog}
            >
                <form className="relative flex w-full items-center sm:w-[320px] lg:w-[420px]">
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={cn(
                            "h-10 w-full rounded-[12px]",
                            "border border-white/10 bg-white/5",
                            "pl-10 pr-3 text-sm text-white/85 placeholder:text-white/40 outline-none",
                            "focus:border-[#FF2EC8]/40",
                        )}
                    />
                    <FiSearch className="absolute left-3 text-white/55" />
                </form>
            </MatchListToolbar>

            <div className="py-10">
                <ReuseAbleTable
                    isLoadings={isLoading || isFetching}
                    currentItems={items}
                    tableHeader={tableHeader}
                    tableRowDataRenderers={tableRowDataRenderers}
                    isBg={false}
                    minTableWidthPx={1100}
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

            <PopularArtistFormDialog
                key={dialogKey}
                open={dialogOpen}
                mode={formMode}
                games={games}
                players={players}
                initialValues={
                    formMode === "edit" && selectedEntry
                        ? {
                              game_id: selectedEntry.game_id,
                              player_one_id: selectedEntry.player_one_id,
                              player_two_id: selectedEntry.player_two_id,
                              start_time: selectedEntry.start_time,
                              end_time: selectedEntry.end_time,
                          }
                        : undefined
                }
                errorMessage={formError}
                isSubmitting={isSubmitting}
                onClose={closeDialog}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
