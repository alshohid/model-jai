/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useParams } from "next/navigation";
import PublicNavbar from "@/app/(public)/_components/publicNavbar/PublicNavbar";
import MissionarySection from "@/app/(auth)/_components/myProfile/MissionarySection";
import FooterSection from "@/shared/components/home/FooterSection";
import ArtistProfilePanel from "@/shared/components/user/ArtistProfilePanel";
import Skeleton from "@/shared/UI/Skeleton";
import { useShowArtistPostByIdQuery, useViewSingleArtistProfileQuery } from "@/redux/features/user/userManagement";
import { toast } from "sonner";
import { useFollowArtistMutation, useGetMeDataQuery, useUnFollowArtistMutation } from "@/redux/features/auth/authapi";
import { getSafeImageSrc } from "@/shared/lib/utils/imagesrcvalidator";

import { scrollToSection } from "@/shared/lib/utils/scrollToSection";
import { useGetIndividualChallengeListByUserIdQuery } from "@/redux/features/challenge/challengeManagement";
import { ApiChallengeItem, mapApiChallengeToOffer } from "@/features/challenge-match/utils/apiAdapter";
import { useMemo } from "react";
import { ChallengeMatchOffer } from "@/features/challenge-match/types";
import { useAuth } from "@/redux/features/auth/hooks";


export default function ArtistProfilePage() {
    const { isAuthenticated } = useAuth();
    const params = useParams();
    const artistId = Number(params.artistId);

    const { data: profileResponse, isLoading, isError } = useViewSingleArtistProfileQuery(artistId);
    const { data: postsResponse, isLoading: postsLoading, isError: postsError } = useShowArtistPostByIdQuery(artistId);
    const [followArtist, { isLoading: isFollowing }] = useFollowArtistMutation();
    const [unFollowArtist, { isLoading: isUnfollowing }] = useUnFollowArtistMutation();
    const { data: userChallengeList, isLoading: isUserChallengeListLoading, isError: isUserChallengeListError } = useGetIndividualChallengeListByUserIdQuery({
        id: artistId,
    }, { skip: !artistId });
    const { data: meData } = useGetMeDataQuery(undefined, { skip: !isAuthenticated })
    const currentUserId = meData?.data?.user?.id;
    const topOffers = useMemo(() => {
        if (!userChallengeList?.data) return [];

        const rawItems = userChallengeList.data as unknown as ApiChallengeItem[];

        return rawItems
            .map(mapApiChallengeToOffer)
            .sort((a, b) => a.rank - b.rank)
    }, [userChallengeList]);
    const canAcceptOffer = (offer: ChallengeMatchOffer): boolean => {
        if (offer.mode === "global") {
            return currentUserId != null && Number(offer.challenger.id) !== Number(currentUserId);
        }
        if (offer.mode === "unique") {
            return offer.targetPlayerId != null && currentUserId != null
                ? Number(offer.targetPlayerId) === Number(currentUserId) && Number(offer.challenger.id) !== Number(currentUserId)
                : false;
        }

        return true;
    };

    if (isLoading) {
        return (
            <div className="container py-20 text-center">
                <Skeleton className="h-[400px] w-full rounded-xl" />
            </div>
        );
    }

    if (isError || !profileResponse?.data) {
        return <div className="py-20 text-center text-red-500">Artist not found or something went wrong!</div>;
    }
    const artistData = profileResponse?.data;
    const user = artistData.user;
    const artistPosts = postsResponse?.data?.posts ?? [];


    const mappedArtist = {
        id: String(user?.id),
        name: user?.name,
        username: user?.artist_name,
        email: user?.email,
        avatar: getSafeImageSrc(user?.image_url || user?.image, "/images/home/avatar_img.png"),
        isBigBoss: user?.role === "artist",
        isVerified: user?.verified_at !== null,
        posts: user?.total_post || 0,
        followers: String(user?.followers_count || 0),
        following: String(user?.following_count || 0),
        isFollowing: artistData?.is_followed,
        bio: user?.note || "No memo available",
        contact: user?.phone_number || "N/A",
        nationality: user?.nationality || "N/A",
        show_name: user?.show_name,
        show_email: user?.show_email,
        show_total_earning: user?.show_total_earning,
        show_total_referral_earning: user?.show_total_referral_earning,
        show_total_tip_received: user?.show_total_tip_received,
        show_total_withdraw: user?.show_total_withdraw,
    };

    const stats = [
        {
            label: "Total Earnings",
            value: `₱ ${artistData?.total_earning}`,
            icon: "/images/home/stat_button.png",
            isVisible: user?.show_total_earning,
        },
        {
            label: "Total Referral Earnings",
            value: `₱ ${artistData?.total_referral_earning}`,
            icon: "/images/home/stat_button_2.png",
            isVisible: user?.show_total_referral_earning,
        },
        {
            label: "Total Tip Received",
            value: `₱ ${artistData?.total_tip_received}`,
            icon: "/images/home/stat_button_3.png",
            isVisible: user?.show_total_tip_received,
        },
        {
            label: "Total Withdraw",
            value: `₱ ${artistData?.total_withdraw}`,
            icon: "/images/home/stat_button.png",
            isVisible: user?.show_total_withdraw,
        },

    ];

    const handleFollowToggle = async () => {
        try {
            if (artistData.is_followed) {
                await unFollowArtist(artistId).unwrap();
                toast.success("Unfollowed successfully");
            } else {
                await followArtist(artistId).unwrap();
                toast.success("Followed successfully");
            }
        } catch (err: any) {
            toast.error(err?.data?.message || "Something went wrong");
        }
    };

    const handleSendTip = () => undefined;

    return (
        <div className="min-h-screen flex flex-col">
            <PublicNavbar />
            <main className="flex-grow">
                <div className="container py-5 md:py-10">
                    <ArtistProfilePanel
                        artist={mappedArtist}
                        stats={stats}
                        onFollow={handleFollowToggle}
                        onSendTip={handleSendTip}
                        isLoading={isFollowing || isUnfollowing}
                        offers={topOffers}
                        canAcceptOffer={(offer) => canAcceptOffer(offer)}
                        onPostsClick={() => scrollToSection("artist-posts")}
                    />
                    <MissionarySection
                        id="artist-posts"
                        posts={artistPosts}
                        isLoading={postsLoading}
                        isError={postsError}
                        title={`${user.name}'s posts`}
                        subtitle={`Browse the latest images and captions shared by ${user.name}.`}
                        withContainer={false}
                    />
                </div>
            </main>
            <FooterSection />
        </div>
    );
}
