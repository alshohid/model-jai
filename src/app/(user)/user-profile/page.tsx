"use client";

import { useRouter } from "next/navigation";
import MissionarySection from "@/app/(auth)/_components/myProfile/MissionarySection";
import PublicNavbar from "@/app/(public)/_components/publicNavbar/PublicNavbar";
import FooterSection from "@/shared/components/home/FooterSection";
import MyProfileSection from "@/shared/components/myProfile/MyProfileSection";
import PastMatchSupportedTable from "@/shared/components/rankPointTable/PastMatchSupportedTable";
import ReferrelLinkTable from "@/shared/components/rankPointTable/ReferrelLinkTable";
import InstagramStyleUserSearch from "@/shared/components/user/InstagramStyleUserSearch";

const UserProfile = () => {
    const router = useRouter();

    return (
        <div>
            <PublicNavbar />
            <MyProfileSection />
            <PastMatchSupportedTable />
            <ReferrelLinkTable />
            <MissionarySection />
            <FooterSection/>
        </div>
    )
}

export default UserProfile;