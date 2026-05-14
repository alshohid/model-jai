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
import { useFollowArtistMutation, useUnFollowArtistMutation } from "@/redux/features/auth/authapi";
import { getSafeImageSrc } from "@/shared/lib/utils/imagesrcvalidator";


export default function ArtistProfilePage() {
    const params = useParams();
    const artistId = Number(params.artistId);

    const { data: profileResponse, isLoading, isError } = useViewSingleArtistProfileQuery(artistId);
    const { data: postsResponse, isLoading: postsLoading, isError: postsError } = useShowArtistPostByIdQuery(artistId);
    const [followArtist, { isLoading: isFollowing }] = useFollowArtistMutation();
    const [unFollowArtist, { isLoading: isUnfollowing }] = useUnFollowArtistMutation();

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
    const artistData = profileResponse.data;
    const user = artistData.user;
    const artistPosts = postsResponse?.data?.posts ?? [];


    const mappedArtist = {
        id: String(user.id),
        name: user.name,
        username: user.email.split('@')[0],
        email: user.email,
        avatar: getSafeImageSrc(user.image_url || user.image, "/images/home/profile_img.png"),
        isBigBoss: user.role === "artist",
        isVerified: user.verified_at !== null,
        posts: user.total_post || 0,
        followers: String(user.followers_count || 0),
        following: String(user.following_count || 0),
        isFollowing: artistData.is_followed,
        bio: user.note || "No bio available",
        contact: user.phone_number || "N/A",
        nationality: user.nationality || "N/A",
    };

    const stats = [
        {
            label: "Total Earnings",
            value: `₱ ${artistData.total_earning}`,
            icon: "/images/home/stat_button.png"
        },
        {
            label: "Total Referral Earnings",
            value: `₱ ${artistData.total_referral_earning}`,
            icon: "/images/home/stat_button_2.png"
        },
        {
            label: "Total Tip Received",
            value: `₱ ${artistData.total_tip_received}`,
            icon: "/images/home/stat_button_3.png"
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
                    />
                    <MissionarySection
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
