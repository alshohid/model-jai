"use client";

import { formateDate } from "@/shared/lib/utils/dateFormater";
import { IPopularArtist } from "@/types/match/popularArtistTypes";
import AppPagination, {
  PaginationMeta,
} from "@/app/(admin)/admin/_components/topComponent/AppPagination";

type Props = {
  items: IPopularArtist[];
  meta: PaginationMeta;
  loading?: boolean;
  onPageChange: (page: number) => void;
  onEdit: (item: IPopularArtist) => void;
  onDelete: (item: IPopularArtist) => void;
};

const columns = [
  "ID",
  "Game",
  "Player One",
  "Player Two",
  "Votes",
  "Created",
  "Actions",
];

export default function PopularArtistTable({
  items,
  meta,
  loading = false,
  onPageChange,
  onEdit,
  onDelete,
}: Props) {
  const showSkeleton = loading && items.length === 0;

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-[18px] border border-white/10 bg-[#0a0913]/80 p-4 shadow-[0_25px_60px_rgba(0,0,0,0.5)]">
        <table className="min-w-full text-left text-sm text-white/80">
          <thead>
            <tr className="text-[13px] uppercase tracking-[0.2em] text-white/50">
              {columns.map((col) => (
                <th key={col} className="px-3 py-3">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {showSkeleton &&
              Array.from({ length: 4 }).map((_, index) => (
                <tr key={`skeleton-${index}`} className="animate-pulse">
                  {columns.map((column) => (
                    <td key={`${column}-${index}`} className="h-8 px-3 py-2">
                      <div className="h-3 w-full rounded bg-white/10" />
                    </td>
                  ))}
                </tr>
              ))}

            {!showSkeleton &&
              (items.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-3 py-6 text-center text-xs uppercase tracking-[0.3em] text-white/40"
                  >
                    No votes found
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-white/5 transition hover:bg-white/5"
                  >
                    <td className="whitespace-nowrap px-3 py-3 font-semibold text-white">
                      {item.id}
                    </td>
                    <td className="px-3 py-3">
                      <p className="text-sm font-semibold text-white">
                        {item.game?.name ?? "Unknown game"}
                      </p>
                    </td>
                    <td className="px-3 py-3">
                      <p className="text-xs text-white/80">{item.player_one?.name}</p>
                    </td>
                    <td className="px-3 py-3">
                      <p className="text-xs text-white/80">{item.player_two?.name}</p>
                    </td>
                    <td className="px-3 py-3">
                      <span className="rounded-full border border-white/15 px-3 py-1 text-[13px] font-semibold text-white">
                        {item.total_vote ?? 0}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-[13px] text-white/50">
                        {formateDate(item.created_at)}
                      </span>
                    </td>
                    <td className="flex gap-2 px-3 py-3">
                      <button
                        onClick={() => onEdit(item)}
                        className="rounded-lg border border-white/30 px-3 py-1 text-xs font-semibold text-white transition hover:border-white hover:text-[#FF2EC8]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(item)}
                        className="rounded-lg border border-red-400/40 px-3 py-1 text-xs font-semibold text-red-300 transition hover:border-red-400 hover:text-red-100"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ))}
          </tbody>
        </table>
      </div>

      <div>
        <AppPagination meta={meta} onPageChange={onPageChange} />
      </div>
    </div>
  );
}
