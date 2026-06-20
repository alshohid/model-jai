"use client";

import { useState } from "react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import { useFollowArtistMutation, useUnFollowArtistMutation } from "@/redux/features/auth/authapi";
import { useGetArtistFollowersListQuery } from "@/redux/features/user/userManagement";
import FooterSection from "@/shared/components/home/FooterSection";
import SocialConnectionsView from "@/shared/components/myProfile/SocialConnectionsView";
import type { SocialConnectionUser } from "@/types/user/usermanagement";
import { useParams } from "next/navigation";

const PAGE_LIMIT = 20;

export default function ArtistFollowersPage() {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [pendingUserId, setPendingUserId] = useState<number | null>(null);
    const { artistId } = useParams() as { artistId: string };

    const { data, isLoading, isFetching } = useGetArtistFollowersListQuery({
        page,
        limit: PAGE_LIMIT,
        id: Number(artistId),
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

    const tabs = [
        { label: "Followers", href: `/artist/${artistId}/followers`, value: "followers" },
        { label: "Following", href: `/artist/${artistId}/following`, value: "following" },
    ] as const

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
                tabs={tabs}
            />
            <FooterSection />
        </>
    );
}