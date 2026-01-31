
"use client"
import EditProfileDialog from "@/app/(auth)/_components/myProfile/EditProfileDialog";
import MyProfilePanel from "./MyProfilePanel"
import  { useState } from "react";
import SendMoneyDialog from "@/app/(auth)/_components/myProfile/SendMoneyDialog";
import WithdrawalDialog from "@/app/(auth)/_components/myProfile/WithdrawalDalog";
import ReferralShareSheet from "./ReferralShareSheet";

const REFERRAL_ARTIST_ID = "michael-rohan";
const REFERRAL_ARTIST_NAME = "Michael Rohan";
const REFERRAL_NEXT_MATCH_ID = "demo-match-123";

const MyProfileSection = () => {
    const [openEdit, setOpenEdit] = useState(false);
    const [sendMoneyOpen, setSendMoneyOpen] = useState(false);
    const [withdrawal, setwithdrawalOpen] = useState(false);
    const [referralLinkOpen, setReferralLinkOpen] = useState(false);
    const [referralShareUrl, setReferralShareUrl] = useState("");

    const openReferralSheet = () => {
        if (typeof window !== "undefined") {
            setReferralShareUrl(
                `${window.location.origin}/live-stream/match/${REFERRAL_NEXT_MATCH_ID}?ref=ref_${REFERRAL_ARTIST_ID}_${Date.now()}`
            );
        }
        setReferralLinkOpen(true);
    };

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
                onReferralLink={openReferralSheet}
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

            {/* Referral Link: নিচ থেকে শেয়ার শীট খুলবে, লিংক শেয়ার করা যাবে */}
            <ReferralShareSheet
                open={referralLinkOpen}
                onOpenChange={setReferralLinkOpen}
                title={`Support ${REFERRAL_ARTIST_NAME}`}
                shareUrl={referralShareUrl}
                onCopy={(link) => console.log("Copied:", link)}
                onShare={(link) => console.log("Shared:", link)}
            />
        </div>

    )
}
export default MyProfileSection;