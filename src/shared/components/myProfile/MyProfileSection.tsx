
"use client"
import EditProfileDialog from "@/app/(auth)/_components/myProfile/EditProfileDialog";
import MyProfilePanel from "./MyProfilePanel"
import  { useState } from "react";
import SendMoneyDialog from "@/app/(auth)/_components/myProfile/SendMoneyDialog";
import WithdrawalDialog from "@/app/(auth)/_components/myProfile/WithdrawalDalog";
import ArtistReferralLink from "@/shared/components/user/ArtistReferralLink";
import AppDialog from "@/shared/components/modal/AppDialog";

const MyProfileSection = () => {
    const [openEdit, setOpenEdit] = useState(false);
    const [sendMoneyOpen, setSendMoneyOpen] = useState(false);
    const [withdrawal, setwithdrawalOpen] = useState(false);
    const [referralLinkOpen, setReferralLinkOpen] = useState(false);
    const isBigBoss = true; // TODO: Get from API/user data
    const profile = {
        name: "Michael Rohan",
        email: "michael@gmail.com",
        contact: "+636514165165",
        nationality: "Nigerian",
        avatar: "/images/home/pro_1.jpg",
        posts: 125,
        followers: "115k",
        following: "225k",
    };
    return (
        <div className="container py-5 md:py-10">
            <MyProfilePanel
                profile={{
                    name: "Michael Rohan",
                    email: "michael@gmail.com",
                    contact: "",
                    nationality: "Nigerian",
                    avatar: "/images/home/pro_1.jpg",
                    posts: 125,
                    followers: "115k",
                    following: "225k",
                }}
                stats={[
                    { label: "Total Earnings", value: "$ 245,000",icon:'/images/home/stat_button.png' },
                    { label: "Total Referral Earnings", value: "$ 8,400", icon: '/images/home/stat_button_2.png' },
                    { label: "Total Tip Recieved", value: "$ 1,311", icon: '/images/home/stat_button_3.png' },
                ]}
                isBigBoss={isBigBoss}
                onEditProfile={() => setOpenEdit(true)}
                onSendMoney={() => setSendMoneyOpen(true)}
                onReferralLink={() => setReferralLinkOpen(true)}
                onWithdrawRequest={() => setwithdrawalOpen(true)}
            />
            <EditProfileDialog
                open={openEdit}
                onOpenChange={setOpenEdit}
                avatarSrc={profile.avatar}
                defaultValues={{
                    name: profile.name,
                    email: profile.email,
                    contact: profile.contact,
                    nationality: profile.nationality,
                }}
                onSave={(data) => {
                    console.log("FINAL SAVE payload:", data);
                    // পরে backend আসলে এখানেই API call করবে
                }}
            />
            <SendMoneyDialog
                open={sendMoneyOpen}
                onOpenChange={setSendMoneyOpen}
                defaultValues={{ senderName: "Michael Rohan", email: "michael@gmail.com", amount: "100" }}
                onSend={(data) => console.log("send money", data)}
            />
            <WithdrawalDialog
                open={withdrawal}
                withdrawableBalance={4000}
                onOpenChange={setwithdrawalOpen}
                defaultValues={{ email: "michael@gmail.com", amount: "100" }}
                onSend={(data) => console.log("withdrawal data ", data)}
            />

            {/* Referral Link Dialog */}
            <AppDialog open={referralLinkOpen} onOpenChange={setReferralLinkOpen}>
                <div className="p-4 md:p-6">
                    <ArtistReferralLink
                        artistId="michael-rohan"
                        artistName="Michael Rohan"
                        nextMatchId="demo-match-123"
                        onCopy={(link) => console.log("Copied:", link)}
                        onShare={(link) => console.log("Shared:", link)}
                    />
                </div>
            </AppDialog>
        </div>

    )
}
export default MyProfileSection;