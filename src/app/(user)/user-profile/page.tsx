"use client";

import MissionarySection from "@/app/(auth)/_components/myProfile/MissionarySection";
import PublicNavbar from "@/app/(public)/_components/publicNavbar/PublicNavbar";
import FooterSection from "@/shared/components/home/FooterSection";
import MyProfileSection from "@/shared/components/myProfile/MyProfileSection";
import PastMatchSupportedTable from "@/shared/components/rankPointTable/PastMatchSupportedTable";
import ReferrelLinkTable from "@/shared/components/rankPointTable/ReferrelLinkTable";
import UserSearchAndSubscribe from "@/shared/components/user/UserSearchAndSubscribe";
import InstagramStyleUserSearch from "@/shared/components/user/InstagramStyleUserSearch";

const UserProfile = () => {
    return (
        <div>
            <PublicNavbar />
            <MyProfileSection />
            
            {/* Instagram-Style User Search Section */}
            <div className="py-5 md:py-10">
                <InstagramStyleUserSearch
                    onUserClick={(user) => {
                        console.log("User clicked:", user);
                        // Navigate to user profile or show details
                    }}
                    onSubscribe={(userId) => {
                        console.log("Subscribed to user:", userId);
                        // Handle subscription
                    }}
                />
            </div>

            <PastMatchSupportedTable />
            <ReferrelLinkTable />
            <MissionarySection />
            <FooterSection/>
        </div>
    )
}

export default UserProfile;