"use client";



// import PublicNavbar from "@/app/(public)/_components/publicNavbar/PublicNavbar";
import FooterSection from "@/shared/components/home/FooterSection";
import MyProfileSection from "@/shared/components/myProfile/MyProfileSection";
import UserPostsSection from "@/shared/components/myProfile/UserPostsSection";
import PastMatchSupportedTable from "@/shared/components/rankPointTable/PastMatchSupportedTable";
import ReferrelLinkTable from "@/shared/components/rankPointTable/ReferrelLinkTable";


const UserProfile = () => {

    return (
        <div>

            <MyProfileSection />
            <UserPostsSection id="my-posts" />
            <PastMatchSupportedTable />
            <ReferrelLinkTable />
            {/* <MissionarySection /> */}
            <FooterSection />
        </div>
    )
}

export default UserProfile;
