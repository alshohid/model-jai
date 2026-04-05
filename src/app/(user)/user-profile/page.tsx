"use client";



import PublicNavbar from "@/app/(public)/_components/publicNavbar/PublicNavbar";
import FooterSection from "@/shared/components/home/FooterSection";
import MyProfileSection from "@/shared/components/myProfile/MyProfileSection";
import UserPostsSection from "@/shared/components/myProfile/UserPostsSection";
import PastMatchSupportedTable from "@/shared/components/rankPointTable/PastMatchSupportedTable";
import ReferrelLinkTable from "@/shared/components/rankPointTable/ReferrelLinkTable";


const UserProfile = () => {
    return (
        <div>
            <PublicNavbar />
            <MyProfileSection />
            <UserPostsSection />
            <PastMatchSupportedTable />
            <ReferrelLinkTable />
            {/* <MissionarySection /> */}
            <FooterSection />
        </div>
    )
}

export default UserProfile;
