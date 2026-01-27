"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PublicNavbar from "@/app/(public)/_components/publicNavbar/PublicNavbar";
import FooterSection from "@/shared/components/home/FooterSection";
import ArtistProfilePanel from "@/shared/components/user/ArtistProfilePanel";
import PastMatchSupportedTable from "@/shared/components/rankPointTable/PastMatchSupportedTable";
import ReferrelLinkTable from "@/shared/components/rankPointTable/ReferrelLinkTable";

export default function ArtistProfilePage() {
    const params = useParams();
    const router = useRouter();
    const artistId = params.artistId as string;

    // Mock artist data - in real app, fetch from API using artistId
    const [artistData, setArtistData] = useState({
        id: artistId,
        name: "Jeffson Jrcelestin",
        username: "jeffsonjrcelestin",
        email: "jeffson@example.com",
        avatar: "/images/home/pro_2.jpg",
        isBigBoss: true,
        isVerified: true,
        posts: 125,
        followers: "115k",
        following: "225k",
        isFollowing: false,
        bio: "Professional gamer and content creator. Join me for epic matches!",
        contact: "+1234567890",
        nationality: "American",
    });

    const handleFollow = () => {
        setArtistData((prev) => ({
            ...prev,
            isFollowing: !prev.isFollowing,
            followers: prev.isFollowing
                ? String(parseInt(prev.followers.replace("k", "")) - 1) + "k"
                : String(parseInt(prev.followers.replace("k", "")) + 1) + "k",
        }));
        // TODO: Call API to follow/unfollow artist
        console.log(artistData.isFollowing ? "Unfollowed" : "Followed", artistId);
    };

    const handleSendTip = () => {
        // TODO: Open tip dialog
        console.log("Send tip to", artistId);
    };

    const stats = [
        { label: "Total Earnings", value: "₱ 245,000", icon: "/images/home/stat_button.png" },
        { label: "Total Referral Earnings", value: "₱ 8,400", icon: "/images/home/stat_button_2.png" },
        { label: "Total Tip Received", value: "₱ 1,311", icon: "/images/home/stat_button_3.png" },
    ];

    return (
        <div>
            <PublicNavbar />
            <div className="container py-5 md:py-10">
                <ArtistProfilePanel
                    artist={artistData}
                    stats={stats}
                    onFollow={handleFollow}
                    onSendTip={handleSendTip}
                />
            </div>

            <PastMatchSupportedTable />
            <ReferrelLinkTable />
            <FooterSection />
        </div>
    );
}
