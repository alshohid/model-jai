/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, UserCheck, Users, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import AppPagination from "@/app/(admin)/admin/_components/topComponent/AppPagination";
import Skeleton from "@/shared/UI/Skeleton";
import BigBossIndicator from "@/shared/components/user/BigBossIndicator";
import { cn } from "@/shared/lib/utils/cn";
import { getSafeImageSrc } from "@/shared/lib/utils/imagesrcvalidator";
import { getFullName } from "@/shared/lib/utils/name";
import type {
  SocialConnectionPagination,
  SocialConnectionUser,
} from "@/types/user/usermanagement";
import { SocialConnectionMode } from "@/types/user/auth";
import { ConnectionTabs } from "./ConnectionTabs";



type SocialConnectionsViewProps = {
  mode: SocialConnectionMode;
  users: SocialConnectionUser[];
  pagination?: SocialConnectionPagination;
  isLoading: boolean;
  isFetching: boolean;
  searchTerm: string;
  pendingUserId: number | null;
  onSearchTermChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onToggleConnection: (user: SocialConnectionUser) => void;
  tabs: any;
};

const avatarFallback = "/images/home/avatar_img.png";

const pageCopy = {
  followers: {
    eyebrow: "Community",
    title: "Followers",
    subtitle: "People who follow your profile and keep up with your activity.",
    emptyTitle: "No followers yet",
    emptyText: "When people follow you, they will appear here.",
    icon: Users,
  },
  following: {
    eyebrow: "Community",
    title: "Following",
    subtitle: "Profiles you follow across Model Boss Offers.",
    emptyTitle: "You are not following anyone yet",
    emptyText: "Follow players or artists to see them in this list.",
    icon: UserCheck,
  },
} satisfies Record<SocialConnectionMode, Record<string, unknown>>;

const formatCount = (value?: number | string | null) => {
  const count = Number(value ?? 0);

  if (!Number.isFinite(count)) return "0";

  return new Intl.NumberFormat("en-US", {
    notation: count >= 1000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(count);
};

const formatMemberSince = (value?: string | null) => {
  if (!value) return "Joined recently";

  const date = new Date(value.replace(" ", "T"));

  if (Number.isNaN(date.getTime())) return "Joined recently";

  return `Joined ${date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  })}`;
};

const getUsername = (user: SocialConnectionUser) => {
  if (user.artist_name?.trim()) return `@${user.artist_name.trim()}`;

  return `@user${user.id}`;
};

const getDisplayName = (user: SocialConnectionUser) =>
  getFullName(user) || user.name || "Unknown user";

const matchesSearch = (user: SocialConnectionUser, searchTerm: string) => {
  const query = searchTerm.trim().toLowerCase();

  if (!query) return true;

  const searchableText = [
    getDisplayName(user),
    user.artist_name,
    user.email,
    user.role,
    user.game?.name,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return searchableText.includes(query);
};

const mapPaginationMeta = (pagination: SocialConnectionPagination) => ({
  page: pagination.current_page,
  limit: pagination.per_page,
  total: pagination.total,
  prev: Boolean(pagination.prev_page_url) || pagination.current_page > 1,
  next:
    Boolean(pagination.next_page_url) ||
    pagination.current_page < pagination.last_page,
});



function ConnectionSkeleton() {
  return (
    <div className="sm:space-y-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-3 border-b border-white/10 px-4 py-3 sm:gap-4 sm:rounded-[18px] sm:border sm:bg-white/[0.03] sm:p-4"
        >
          <Skeleton className="h-12 w-12 rounded-full sm:h-14 sm:w-14" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-8 w-20 rounded-full sm:h-9 sm:w-24" />
        </div>
      ))}
    </div>
  );
}

type ConnectionRowProps = {
  mode: SocialConnectionMode;
  user: SocialConnectionUser;
  pending: boolean;
  onToggleConnection: (user: SocialConnectionUser) => void;
};

function ConnectionRow({
  mode,
  user,
  pending,
  onToggleConnection,
}: ConnectionRowProps) {
  const displayName = getDisplayName(user);
  const username = getUsername(user);
  const isArtist = user.role === "artist";
  const isFollowerConnected = Boolean(user.is_following);
  const isConnected = mode === "following" || isFollowerConnected;
  const buttonLabel = pending
    ? "Updating"
    : isConnected
      ? "Following"
      : "Follow";

  return (
    <article className="group border-b border-white/10 px-4 py-3 transition hover:bg-white/[0.04] sm:rounded-[18px] sm:border sm:bg-white/[0.035] sm:p-4 sm:hover:border-[#FF2EC8]/35 sm:hover:bg-white/[0.06]">
      <div className="flex items-center gap-3 sm:gap-4">
        <Link
          href={`/artist/${user.id}`}
          className="flex min-w-0 flex-1 items-center gap-3 rounded-[14px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2EC8]/45 sm:gap-4"
          aria-label={`View ${displayName} profile`}
        >
          <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/10 ring-2 ring-transparent transition group-hover:ring-[#FF2EC8]/30 sm:h-14 sm:w-14">
            <Image
              src={getSafeImageSrc(user.image, avatarFallback)}
              alt={displayName}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 48px, 56px"
              unoptimized
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-sm font-semibold text-white sm:text-base">
                {displayName}
              </h2>
              <BigBossIndicator isBigBoss={isArtist} size="sm" />
              {user.verified_at ? (
                <span className="hidden rounded-full border border-[#00C3FF]/30 bg-[#00C3FF]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8CEBFF] sm:inline-flex">
                  Verified
                </span>
              ) : null}
            </div>

            <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-white/50 sm:mt-1">
              <span>{username}</span>
              <span className="hidden h-1 w-1 rounded-full bg-white/25 sm:inline-block" />
              <span className="hidden capitalize sm:inline">{user.role}</span>
              {user.game?.name ? (
                <>
                  <span className="hidden h-1 w-1 rounded-full bg-white/25 sm:inline-block" />
                  <span className="hidden sm:inline">{user.game.name}</span>
                </>
              ) : null}
            </div>

            {user.note ? (
              <p className="mt-2 hidden text-sm text-white/60 sm:line-clamp-1">
                {user.note}
              </p>
            ) : null}
          </div>
        </Link>

        <div className="flex flex-shrink-0 items-center justify-end gap-3">
          <div className="hidden gap-4 text-right md:flex">
            <div>
              <p className="text-sm font-semibold text-white">
                {formatCount(user.followers_count)}
              </p>
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/35">
                Followers
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                {formatCount(user.following_count)}
              </p>
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/35">
                Following
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={pending}
            onClick={() => onToggleConnection(user)}
            className={cn(
              "h-8 min-w-[86px] rounded-lg px-3 text-xs font-semibold transition sm:h-10 sm:min-w-[104px] sm:rounded-full sm:px-5 sm:text-sm",
              isConnected
                ? "border border-white/12 bg-white/10 text-white hover:bg-white/15"
                : "bg-[#FF2EC8] text-white shadow-[0_10px_24px_rgba(255,46,200,0.24)] hover:bg-[#ff4ad1]",
              pending && "cursor-not-allowed opacity-70",
            )}
          >
            {buttonLabel}
          </button>
        </div>
      </div>

      <div className="mt-4 hidden flex-wrap items-center gap-2 border-t border-white/10 pt-3 text-xs text-white/45 sm:flex">
        <span>{formatMemberSince(user.created_at)}</span>
        {mode === "followers" ? (
          <span className="rounded-full bg-white/8 px-2.5 py-1 text-white/55">
            Follows you
          </span>
        ) : user.is_followed_by ? (
          <span className="rounded-full bg-white/8 px-2.5 py-1 text-white/55">
            Follows you back
          </span>
        ) : null}
        {user.show_email && user.email ? (
          <span className="rounded-full bg-white/8 px-2.5 py-1 text-white/55">
            {user.email}
          </span>
        ) : null}
      </div>
    </article>
  );
}

export default function SocialConnectionsView({
  mode,
  users,
  pagination,
  isLoading,
  isFetching,
  searchTerm,
  pendingUserId,
  onSearchTermChange,
  onPageChange,
  onToggleConnection,
  tabs
}: SocialConnectionsViewProps) {
  const router = useRouter();
  const copy = pageCopy[mode];
  const Icon = copy.icon as typeof Users;
  const filteredUsers = users.filter((user) => matchesSearch(user, searchTerm));
  const totalCount = pagination?.total ?? users.length;
  const showPagination = Boolean(pagination && pagination.total > pagination.per_page);

  return (
    <main className="container px-0 py-0 sm:px-4 sm:py-6 md:py-10">
      <section className="min-h-[calc(100vh-80px)] bg-black/20 pb-4 backdrop-blur-[18px] sm:min-h-0 sm:rounded-[24px] sm:border sm:border-white/10 sm:bg-black/30 sm:p-6 sm:shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
        <div className="flex flex-col gap-4 px-4 pt-4 sm:gap-5 sm:px-0 sm:pt-0 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="hidden text-xs font-semibold uppercase tracking-[0.28em] text-[#FF9BE9] sm:block">
              {copy.eyebrow as string}
            </p>
            <div className="flex items-center gap-3 sm:mt-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition text-white cursor-pointer"
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <span className="hidden h-11 w-11 place-items-center rounded-full border border-[#FF2EC8]/25 bg-[#FF2EC8]/10 text-[#FF9BE9] sm:grid">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h1 className="text-xl font-semibold text-white sm:text-3xl">
                  {copy.title as string}
                </h1>
                <p className="mt-0.5 text-xs text-white/50 sm:mt-1 sm:text-sm sm:text-white/55">
                  {formatCount(totalCount)} total
                </p>
              </div>
            </div>
            <p className="mt-4 hidden max-w-2xl text-sm leading-6 text-white/60 sm:block">
              {copy.subtitle as string}
            </p>
          </div>

          <ConnectionTabs mode={mode} tabs={tabs} />
        </div>

        <div className="sticky top-0 z-10 mt-4 flex flex-col gap-3 border-y border-white/10 bg-black/80 px-4 py-3 backdrop-blur sm:static sm:mt-6 sm:bg-transparent sm:px-0 sm:py-4 sm:flex-row sm:items-center sm:justify-between">
          <label className="relative block w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
            <input
              value={searchTerm}
              onChange={(event) => onSearchTermChange(event.target.value)}
              placeholder="Search"
              className="h-10 w-full rounded-[10px] border border-white/10 bg-white/[0.08] pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#FF2EC8]/50 focus:bg-white/[0.1] sm:h-11 sm:rounded-full sm:pl-11"
            />
          </label>

          {isFetching && !isLoading ? (
            <p className="text-sm text-white/45">Refreshing list...</p>
          ) : null}
        </div>

        <div className="sm:mt-5">
          {isLoading ? (
            <ConnectionSkeleton />
          ) : filteredUsers.length > 0 ? (
            <div className="sm:space-y-3">
              {filteredUsers.map((user) => (
                <ConnectionRow
                  key={user.id}
                  mode={mode}
                  user={user}
                  pending={pendingUserId === user.id}
                  onToggleConnection={onToggleConnection}
                />
              ))}
            </div>
          ) : (
            <div className="mx-4 mt-5 rounded-[20px] border border-dashed border-white/14 bg-white/[0.03] px-6 py-14 text-center sm:mx-0 sm:mt-0">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white/8 text-white/55">
                <Icon className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-white">
                {searchTerm ? "No matches found" : (copy.emptyTitle as string)}
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/55">
                {searchTerm
                  ? "Try another name, username, email, or game."
                  : (copy.emptyText as string)}
              </p>
            </div>
          )}
        </div>

        {showPagination && pagination ? (
          <div className="mt-7 flex justify-center px-4 sm:px-0">
            <AppPagination
              meta={mapPaginationMeta(pagination)}
              onPageChange={onPageChange}
              showSummary
            />
          </div>
        ) : null}
      </section>
    </main>
  );
}
