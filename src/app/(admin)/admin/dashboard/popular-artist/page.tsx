"use client";

import { useEffect, useState } from "react";
import { useGetAllGamesQuery } from "@/redux/features/game/gameListManagement";
import {
  useCreatePopularArtistVoteMutation,
  useDeletePopularArtistVoteMutation,
  useGetAllPopularArtistQuery,
  useUpdatePopularArtistVoteMutation,
} from "@/redux/features/match/matchManagement";
import { useGetAllPlayerQuery } from "@/redux/features/user/userManagement";
import { ICreatePopularArtistPayload, IPopularArtist } from "@/types/match/popularArtistTypes";
import PopularArtistFormDialog from "./components/PopularArtistFormDialog";
import PopularArtistTable from "./components/PopularArtistTable";
import PopularArtistToolbar from "./components/PopularArtistToolbar";

const DEFAULT_LIMIT = 10;

export default function PopularArtistPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedEntry, setSelectedEntry] = useState<IPopularArtist | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tableError, setTableError] = useState("");
  const [formError, setFormError] = useState("");

  const { data: gamesResponse } = useGetAllGamesQuery();
  const { data: playersResponse } = useGetAllPlayerQuery();

  const {
    data,
    isLoading,
    isFetching,
  } = useGetAllPopularArtistQuery({
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
  const paginationMeta = {
    page: data?.meta?.current_page ?? page,
    limit: data?.meta?.per_page ?? DEFAULT_LIMIT,
    total: data?.meta?.total ?? 0,
    prev: data?.meta?.prev ?? false,
    next: data?.meta?.next ?? false,
  };

  const loading = isLoading || isFetching;

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
    setTableError("");
    setFormError("");
    setIsSubmitting(true);
    try {
      if (formMode === "create") {
        await createPopularArtist(payload).unwrap();
      } else if (selectedEntry) {
        await updatePopularArtist({ id: selectedEntry.id, ...payload }).unwrap();
      }
      closeDialog();
    } catch (error) {
      console.error("Popular artist vote save failed", error);
      setFormError("Unable to save vote. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (item: IPopularArtist) => {
    setTableError("");
    if (!window.confirm("Delete this popular artist vote?")) return;

    try {
      await deletePopularArtist(item.id).unwrap();
    } catch (error) {
      console.error("Delete popular artist vote failed", error);
      setTableError("Unable to delete this vote. Please try again.");
    }
  };

  const dialogKey = `${dialogOpen ? "open" : "closed"}-${formMode}-${
    selectedEntry?.id ?? "new"
  }`;

  return (
    <section className="space-y-5 py-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-white">Popular Artist Votes</h1>
        <p className="text-sm text-white/60">
          Manage the votes that surface popular artists on the dashboard.
        </p>
      </div>

      <PopularArtistToolbar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onAddNew={openCreateDialog}
        isSearching={loading}
      />

      {tableError && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-100">
          {tableError}
        </div>
      )}

      <PopularArtistTable
        items={items}
        meta={paginationMeta}
        loading={loading}
        onPageChange={setPage}
        onEdit={openEditDialog}
        onDelete={handleDelete}
      />

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
    </section>
  );
}
