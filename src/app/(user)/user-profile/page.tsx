import MissionarySection from "@/app/(auth)/_components/myProfile/MissionarySection";
import PublicNavbar from "@/app/(public)/_components/publicNavbar/PublicNavbar";
import MyProfileSection from "@/shared/components/myProfile/MyProfileSection";
import PastMatchSupportedTable from "@/shared/components/rankPointTable/PastMatchSupportedTable";
import ReferrelLinkTable from "@/shared/components/rankPointTable/ReferrelLinkTable";

const UserProfile = () => {
    return (
        <div>
            <PublicNavbar />
            <MyProfileSection />
            <PastMatchSupportedTable />
            <ReferrelLinkTable />
            <MissionarySection/>
        </div>
    )
}

export default UserProfile;