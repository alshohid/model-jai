"use client";

import { useState } from "react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import { useGetFollowersListQuery } from "@/redux/features/user/userManagement";
import {
  useFollowArtistMutation,
  useUnFollowArtistMutation,
} from "@/redux/features/auth/authapi";
import FooterSection from "@/shared/components/home/FooterSection";
import SocialConnectionsView from "@/shared/components/myProfile/SocialConnectionsView";
import type { SocialConnectionUser } from "@/types/user/usermanagement";

const PAGE_LIMIT = 10;

export default function MyFollowers() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [pendingUserId, setPendingUserId] = useState<number | null>(null);

  const { data, isLoading, isFetching } = useGetFollowersListQuery({
    page,
    limit: PAGE_LIMIT,
  });
  const [followArtist] = useFollowArtistMutation();
  const [unFollowArtist] = useUnFollowArtistMutation();

  const followers = data?.data?.followers;

  const handleSearchTermChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleToggleConnection = async (user: SocialConnectionUser) => {
    const isFollowing = Boolean(user.is_following);

    try {
      setPendingUserId(user.id);

      if (isFollowing) {
        await unFollowArtist(user.id).unwrap();
        toast.success(`Unfollowed ${user.name}`);
      } else {
        await followArtist(user.id).unwrap();
        toast.success(`Now following ${user.name}`);
      }
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to update follow status"));
    } finally {
      setPendingUserId(null);
    }
  };

  return (
    <>
      <SocialConnectionsView
        mode="followers"
        users={followers?.data ?? []}
        pagination={followers}
        isLoading={isLoading}
        isFetching={isFetching}
        searchTerm={searchTerm}
        pendingUserId={pendingUserId}
        onSearchTermChange={handleSearchTermChange}
        onPageChange={setPage}
        onToggleConnection={handleToggleConnection}
      />
      <FooterSection />
    </>
  );
}
