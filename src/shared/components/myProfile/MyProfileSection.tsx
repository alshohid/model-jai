
"use client"
import EditProfileDialog from "@/app/(auth)/_components/myProfile/EditProfileDialog";
import MyProfilePanel from "./MyProfilePanel"
import { useState } from "react";
import SendMoneyDialog from "@/app/(auth)/_components/myProfile/SendMoneyDialog";
import WithdrawalDialog from "@/app/(auth)/_components/myProfile/WithdrawalDalog";
import ReferralShareSheet from "./ReferralShareSheet";
import { useWithdrawRequestMutation } from "@/redux/features/pointstore/buypoint";
import { toast } from "sonner";
import { useGetMeDataQuery } from "@/redux/features/auth/authapi";
import ProfileSkeleton from "./ProfileSkeleton";

const REFERRAL_ARTIST_ID = "michael-rohan";
const REFERRAL_ARTIST_NAME = "Michael Rohan";
const REFERRAL_NEXT_MATCH_ID = "demo-match-123";

const MyProfileSection = () => {
    const [openEdit, setOpenEdit] = useState(false);
    const [sendMoneyOpen, setSendMoneyOpen] = useState(false);
    const [withdrawal, setwithdrawalOpen] = useState(false);
    const [referralLinkOpen, setReferralLinkOpen] = useState(false);
    const [referralShareUrl, setReferralShareUrl] = useState("");
    const [withdrawRequest, { isLoading: isWithdrawRequestLoading }] = useWithdrawRequestMutation()
    const { data: meData, isLoading: isMeDataLoading, isFetching: isMeDataFetching } = useGetMeDataQuery()
    const user = meData?.data;
    const withdrawHandler = async (amount: number) => {
        try {
            const response = await withdrawRequest({ coin_amount: amount }).unwrap()
            if (response?.success) {
                toast.success("Withdrawal request sent successfully")
            }

        } catch (error) {
            console.log("withdrawal error ", error)
            toast.error("Withdrawal request failed")
        }
    }
    const openReferralSheet = () => {
        if (typeof window !== "undefined") {
            setReferralShareUrl(
                `${window.location.origin}/live-stream/match/${REFERRAL_NEXT_MATCH_ID}?ref=ref_${REFERRAL_ARTIST_ID}_${Date.now()}`
            );
        }
        setReferralLinkOpen(true);
    };

    const isBigBoss = true;
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
            {
                isMeDataLoading || isMeDataFetching ? (
                    <ProfileSkeleton />
                ) : (
                    <MyProfilePanel
                        profile={{
                            name: user?.name ?? "",
                            email: user?.email ?? "",
                            contact: "",
                            nationality: "",
                            avatar: user?.image ?? "/images/home/pro_1.jpg",
                            posts: 0,
                            followers: "0",
                            following: "0",
                        }}

                        stats={[
                            {
                                label: "Total Earnings",
                                value: `$ ${user?.total_earning ?? "0.00"}`,
                                icon: "/images/home/stat_button.png",
                            },
                            {
                                label: "Total Referral Earnings",
                                value: `$ ${user?.total_referral_earning ?? "0.00"}`,
                                icon: "/images/home/stat_button_2.png",
                            },
                            {
                                label: "Total Tip Received",
                                value: `$ ${user?.total_tip_received ?? "0.00"}`,
                                icon: "/images/home/stat_button_3.png",
                            },
                        ]}

                        isBigBoss={isBigBoss}
                        onEditProfile={() => setOpenEdit(true)}
                        onSendMoney={() => setSendMoneyOpen(true)}
                        onReferralLink={openReferralSheet}
                        onWithdrawRequest={() => setwithdrawalOpen(true)}
                    />
                )
            }
            <EditProfileDialog
                open={openEdit}
                onOpenChange={setOpenEdit}
                avatarSrc={user?.image ?? profile.avatar}
                defaultValues={{
                    name: user?.name ?? profile.name,
                    email: user?.email ?? profile.email,
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
                withdrawableBalance={Number(user?.total_balance ?? 0)}
                onOpenChange={setwithdrawalOpen}
                defaultValues={{ email: user?.email ?? "", amount: "100" }}
                onSend={(data) => {
                    console.log("withdrawal data ", data?.amount)
                    withdrawHandler(Number(data?.amount))
                }}
                isLoading={isWithdrawRequestLoading}
            />


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