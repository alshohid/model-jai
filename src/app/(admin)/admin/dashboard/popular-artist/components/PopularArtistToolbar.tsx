"use client";

type Props = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onAddNew: () => void;
  isSearching?: boolean;
};

export default function PopularArtistToolbar({
  searchValue,
  onSearchChange,
  onAddNew,
  isSearching = false,
}: Props) {
  return (
    <div className="w-full rounded-[18px] border border-white/10 bg-[#09060d]/70 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-1 min-w-[200px] items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70 shadow-inner">
          <svg
            className="h-4 w-4 text-white/60"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="8" cy="8" r="5.5" />
            <line x1="13.5" y1="13.5" x2="18" y2="18" />
          </svg>
          <input
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search game, player, or vote"
            className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
          />
        </div>

        <button
          onClick={onAddNew}
          disabled={isSearching}
          className="inline-flex items-center justify-center rounded-[14px] bg-gradient-to-r from-[#FF2EC8] to-[#5A33FF] px-5 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
        >
          Add Popular Artist Vote
        </button>
      </div>
    </div>
  );
}
