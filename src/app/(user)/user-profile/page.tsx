import PublicNavbar from "@/app/(public)/_components/publicNavbar/PublicNavbar";
import PastMatchSupportedTable from "@/shared/components/rankPointTable/PastMatchSupportedTable";
import ReferrelLinkTable from "@/shared/components/rankPointTable/ReferrelLinkTable";

const UserProfile = () => {
    return (
        <div>
            <PublicNavbar />
            <PastMatchSupportedTable />
            <ReferrelLinkTable />
        </div>
    )
}

export default UserProfile;