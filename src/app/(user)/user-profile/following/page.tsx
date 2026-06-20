"use client";

import { useState } from "react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import { useUnFollowArtistMutation } from "@/redux/features/auth/authapi";
import { useGetFollowingListQuery } from "@/redux/features/user/userManagement";
import FooterSection from "@/shared/components/home/FooterSection";
import SocialConnectionsView from "@/shared/components/myProfile/SocialConnectionsView";
import type { SocialConnectionUser } from "@/types/user/usermanagement";

const PAGE_LIMIT = 20;

export default function Following() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [pendingUserId, setPendingUserId] = useState<number | null>(null);

  const { data, isLoading, isFetching } = useGetFollowingListQuery({
    page,
    limit: PAGE_LIMIT,
  });
  const [unFollowArtist] = useUnFollowArtistMutation();

  const following = data?.data?.following;

  const handleSearchTermChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleToggleConnection = async (user: SocialConnectionUser) => {
    try {
      setPendingUserId(user.id);
      await unFollowArtist(user.id).unwrap();
      toast.success(`Unfollowed ${user.name}`);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to unfollow user"));
    } finally {
      setPendingUserId(null);
    }
  };
  const tabs = [
    { label: "Followers", href: "/user-profile/my-followers", value: "followers" },
    { label: "Following", href: "/user-profile/following", value: "following" },
  ] as const
  return (
    <>
      <SocialConnectionsView
        mode="following"
        users={following?.data ?? []}
        pagination={following}
        isLoading={isLoading}
        isFetching={isFetching}
        searchTerm={searchTerm}
        pendingUserId={pendingUserId}
        onSearchTermChange={handleSearchTermChange}
        onPageChange={setPage}
        onToggleConnection={handleToggleConnection}
        tabs={tabs}
      />
      <FooterSection />
    </>
  );
}
