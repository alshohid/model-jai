/* eslint-disable @typescript-eslint/no-unused-vars */

"use client"
import EditProfileDialog from "@/app/(auth)/_components/myProfile/EditProfileDialog";
import MyProfilePanel from "./MyProfilePanel"
import { useState } from "react";
import SendMoneyDialog from "@/app/(auth)/_components/myProfile/SendMoneyDialog";
import WithdrawalDialog from "@/app/(auth)/_components/myProfile/WithdrawalDalog";
import ReferralShareSheet from "./ReferralShareSheet";
import { useWithdrawRequestMutation } from "@/redux/features/pointstore/buypoint";
import { toast } from "sonner";
import { useEditProfileMutation, useGetMeDataQuery } from "@/redux/features/auth/authapi";
import ProfileSkeleton from "./ProfileSkeleton";
import { IUser, IUserStats } from "@/types/user/auth";
import { getSafeImageSrc } from "@/shared/lib/utils/imagesrcvalidator";

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
    const [editProfile, { isLoading: isEditProfileLoading }] = useEditProfileMutation()
    const { data: meData, isLoading: isMeDataLoading, isFetching: isMeDataFetching } = useGetMeDataQuery()
    const user = meData?.data?.user;


    const stats: IUserStats | undefined = meData?.data
        ? {
            total_earning: meData?.data?.total_earning,
            total_referral_earning: meData?.data?.total_referral_earning,
            total_tip_received: meData?.data?.total_tip_received,
            total_withdraw: meData?.data?.total_withdraw,
            total_balance: meData?.data?.total_balance,
            total_bet: meData?.data?.total_bet,
        }
        : undefined;

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
                            contact: user?.phone_number ?? "",
                            nationality: user?.nationality ?? "",
                            avatar: getSafeImageSrc(user?.image, "/images/home/pro_1.jpg"),
                            posts: user?.total_post ?? 0,
                            followers: String(user?.followers_count ?? 0),
                            following: String(user?.following_count ?? 0),
                        }}
                        stats={[
                            {
                                label: "Total Earnings",
                                value: `$ ${stats?.total_earning ?? "0.00"}`,
                                icon: "/images/home/stat_button.png",
                            },
                            {
                                label: "Total Referral Earnings",
                                value: `$ ${stats?.total_referral_earning ?? "0.00"}`,
                                icon: "/images/home/stat_button_2.png",
                            },
                            {
                                label: "Total Tip Received",
                                value: `$ ${stats?.total_tip_received ?? "0.00"}`,
                                icon: "/images/home/stat_button_3.png",
                            },
                            {
                                label: "Total Withdraw",
                                value: `$ ${stats?.total_withdraw ?? "0.00"}`,
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
                avatarSrc={getSafeImageSrc(user?.image) ?? profile.avatar}
                defaultValues={{
                    name: user?.name ?? profile.name,
                    email: user?.email ?? profile.email,
                    contact: user?.phone_number ?? profile.contact,
                    nationality: user?.nationality ?? profile.nationality,
                }}
                isLoading={isEditProfileLoading}
                onSave={async (data) => {
                    try {
                        const formData = new FormData();

                        formData.append("name", data.name);
                        formData.append("phone_number", data.contact || "");
                        formData.append("nationality", data.nationality || "");

                        if (data.image instanceof File) {
                            formData.append("image", data.image);
                        }

                        const response = await editProfile(formData).unwrap();

                        if (response?.success) {
                            toast.success("Profile updated successfully");
                            setOpenEdit(false);
                        }
                    } catch (error) {
                        toast.error("Profile update failed")
                    }

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
                readOnly={true}
                withdrawableBalance={Number(meData?.data?.total_balance ?? 0)}
                onOpenChange={setwithdrawalOpen}
                defaultValues={{ email: user?.email ?? "", amount: "100" }}
                onSend={(data) => {
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