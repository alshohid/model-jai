"use client"
import EditProfileDialog from "@/app/(auth)/_components/myProfile/EditProfileDialog";
import MyProfilePanel from "./MyProfilePanel"
import { useEffect, useMemo, useState } from "react";
import SendMoneyDialog from "@/app/(auth)/_components/myProfile/SendMoneyDialog";
import WithdrawalDialog from "@/app/(auth)/_components/myProfile/WithdrawalDalog";
import ReferralShareSheet from "./ReferralShareSheet";
import {
    useConnectPaymentMethodMutation,
    useDisconnectPaymentMethodMutation,
    useWithdrawRequestMutation,
} from "@/redux/features/pointstore/buypoint";
import { toast } from "sonner";
import { useEditProfileMutation, useGetMeDataQuery } from "@/redux/features/auth/authapi";
import ProfileSkeleton from "./ProfileSkeleton";
import { IUserStats } from "@/types/user/auth";
import { getSafeImageSrc } from "@/shared/lib/utils/imagesrcvalidator";
import { getFullName } from "@/shared/lib/utils/name";
import { getPaymentMethodConfig } from "@/shared/constants/paymentMethods";
import ConnectPaymentMethodDialog from "@/shared/components/payment/ConnectPaymentMethodDialog";
import { usePaymentConnectionStatuses } from "@/shared/hooks/usePaymentConnectionStatuses";
import { PaymentMethodConfig } from "@/shared/constants/paymentMethods";
import { PaymentMethodId } from "@/types/user/point";
import { getErrorMessage } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

const MyProfileSection = () => {
    const [openEdit, setOpenEdit] = useState(false);
    const [sendMoneyOpen, setSendMoneyOpen] = useState(false);
    const [withdrawal, setwithdrawalOpen] = useState(false);
    const [referralLinkOpen, setReferralLinkOpen] = useState(false);
    const [referralShareUrl, setReferralShareUrl] = useState("");
    const [connectWalletOpen, setConnectWalletOpen] = useState(false);
    const [connectWalletMethod, setConnectWalletMethod] = useState<PaymentMethodConfig | null>(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodId | null>(null);
    const [walletActionMethod, setWalletActionMethod] = useState<PaymentMethodId | null>(null);
    const [walletActionMode, setWalletActionMode] = useState<"connect" | "disconnect" | null>(null);
    const [withdrawRequest, { isLoading: isWithdrawRequestLoading }] = useWithdrawRequestMutation()
    const [connectPaymentMethod, { isLoading: isConnectPaymentMethodLoading }] = useConnectPaymentMethodMutation()
    const [disconnectPaymentMethod] = useDisconnectPaymentMethodMutation()
    const [editProfile, { isLoading: isEditProfileLoading }] = useEditProfileMutation()
    const { data: meData, isLoading: isMeDataLoading, isFetching: isMeDataFetching } = useGetMeDataQuery()
    const searchParams = useSearchParams();
    const user = meData?.data?.user;
    const userFullName = getFullName(user);
    const fallbackAvatar = "/images/home/pro_1.jpg";
    const paymentQueryWallet = searchParams.get("wallet");

    const {
        allMethods: paymentMethods,
        connectedMethods,
        hasConnectedMethods,
    } = usePaymentConnectionStatuses({
        enabled: Boolean(user),
    });

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

    useEffect(() => {
        if (connectedMethods.length === 0) {
            setSelectedPaymentMethod(null);
            return;
        }

        if (
            paymentQueryWallet &&
            connectedMethods.some((item) => item.method.id === paymentQueryWallet)
        ) {
            setSelectedPaymentMethod(paymentQueryWallet as PaymentMethodId);
            return;
        }

        if (
            selectedPaymentMethod &&
            connectedMethods.some((item) => item.method.id === selectedPaymentMethod)
        ) {
            return;
        }

        setSelectedPaymentMethod(connectedMethods[0].method.id);
    }, [connectedMethods, paymentQueryWallet, selectedPaymentMethod]);

    const openConnectWalletDialog = (paymentMethod: PaymentMethodId) => {
        const method = getPaymentMethodConfig(paymentMethod);

        if (paymentMethod === "stripe") {
            void handleConnectWallet(method);
            return;
        }

        setConnectWalletMethod(method);
        setConnectWalletOpen(true);
    };

    const handleConnectWallet = async (
        method: PaymentMethodConfig,
        identifier?: string
    ) => {
        try {
            setWalletActionMethod(method.id);
            setWalletActionMode("connect");

            const payload =
                method.connectField && identifier
                    ? {
                        paymentMethod: method.id,
                        [method.connectField]: identifier,
                    }
                    : {
                        paymentMethod: method.id,
                    };

            const response = await connectPaymentMethod(payload).unwrap();
            const connectUrl = response?.data?.url;

            if (connectUrl) {
                window.location.href = connectUrl;
                return;
            }

            toast.success(`${method.name} connected successfully`);
            setConnectWalletOpen(false);
            setSelectedPaymentMethod(method.id);
        } catch (error) {
            toast.error(getErrorMessage(error, `Failed to connect ${method.name}`));
        } finally {
            setWalletActionMethod(null);
            setWalletActionMode(null);
        }
    };

    const handleDisconnectWallet = async (paymentMethod: PaymentMethodId) => {
        const method = getPaymentMethodConfig(paymentMethod);

        try {
            setWalletActionMethod(paymentMethod);
            setWalletActionMode("disconnect");
            await disconnectPaymentMethod(paymentMethod).unwrap();

            toast.success(`${method.name} disconnected successfully`);

            if (selectedPaymentMethod === paymentMethod) {
                const fallbackMethod = connectedMethods.find(
                    (item) => item.method.id !== paymentMethod
                );
                setSelectedPaymentMethod(fallbackMethod?.method.id ?? null);
            }
        } catch (error) {
            toast.error(getErrorMessage(error, `Failed to disconnect ${method.name}`));
        } finally {
            setWalletActionMethod(null);
            setWalletActionMode(null);
        }
    };

    const withdrawHandler = async (amount: number, paymentMethod?: PaymentMethodId) => {
        if (amount < 10) {
            toast.error("Withdrawal amount must be at least 10")
            return;
        }

        if (!paymentMethod) {
            toast.error("Select a connected payment method first");
            return;
        }

        try {
            const response = await withdrawRequest({
                coin_amount: amount,
                payment_method: paymentMethod,
            }).unwrap()
            if (response?.success) {
                toast.success("Withdrawal request sent successfully")

            }

        } catch {
            toast.error("Withdrawal request failed")
        }
    }
    const openReferralSheet = () => {
        if (!user?.referral_no) {
            toast.error("Referral link is not available right now");
            return;
        }

        if (typeof window === "undefined") return;

        setReferralShareUrl(
            `${window.location.origin}/register?ref=${encodeURIComponent(user.referral_no)}`
        );
        setReferralLinkOpen(true);
    };

    const isBigBoss = user?.role === "artist";
    const connectedPaymentMethods = useMemo(
        () =>
            connectedMethods.map((item) => ({
                method: item.method,
                identifier: item.identifier,
            })),
        [connectedMethods]
    );

    return (
        <div className="container py-5 md:py-10">
            {
                isMeDataLoading || isMeDataFetching ? (
                    <ProfileSkeleton />
                ) : (
                    <MyProfilePanel
                        profile={{
                            name: userFullName,
                            email: user?.email ?? "",
                            contact: user?.phone_number ?? "",
                            nationality: user?.nationality ?? "",
                            avatar: getSafeImageSrc(user?.image, "/images/home/pro_1.jpg"),
                            posts: user?.total_post ?? 0,
                            followers: String(user?.followers_count ?? 0),
                            following: String(user?.following_count ?? 0),
                            favoriteGame: user?.game
                                ? {
                                    name: user.game.name,
                                    image: user.game.image ?? null,
                                }
                                : null,
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
                        paymentMethods={paymentMethods}
                        selectedPaymentMethod={selectedPaymentMethod}
                        walletActionMethod={walletActionMethod}
                        walletActionMode={walletActionMode}
                        onEditProfile={() => setOpenEdit(true)}
                        onSendMoney={() => setSendMoneyOpen(true)}
                        onReferralLink={openReferralSheet}
                        onWithdrawRequest={() => {
                            if (!hasConnectedMethods) {
                                toast.error("Connect a payment method before requesting a withdrawal");
                                return;
                            }

                            setwithdrawalOpen(true);
                        }}
                        onSelectPaymentMethod={setSelectedPaymentMethod}
                        onConnectPaymentMethod={openConnectWalletDialog}
                        onDisconnectPaymentMethod={handleDisconnectWallet}
                    />
                )
            }
            <EditProfileDialog
                open={openEdit}
                onOpenChange={setOpenEdit}
                avatarSrc={getSafeImageSrc(user?.image, fallbackAvatar)}
                defaultValues={{
                    first_name: user?.first_name ?? "",
                    middle_name: user?.middle_name ?? "",
                    last_name: user?.last_name ?? "",
                    email: user?.email ?? "",
                    contact: user?.phone_number ?? "",
                    nationality: user?.nationality ?? "",
                }}
                isLoading={isEditProfileLoading}
                onSave={async (data) => {
                    try {
                        const formData = new FormData();

                        formData.append("first_name", data.first_name);
                        formData.append("middle_name", data.middle_name);
                        formData.append("last_name", data.last_name);
                        formData.append("phone_number", data.contact ?? "");
                        formData.append("nationality", data.nationality ?? "");

                        if (data.image instanceof File) {
                            formData.append("image", data.image);
                        }

                        const response = await editProfile(formData).unwrap();

                        if (response?.success) {
                            toast.success("Profile updated successfully");
                            setOpenEdit(false);
                        }
                    } catch {
                        toast.error("Profile update failed")
                    }

                }}
            />
            <SendMoneyDialog
                open={sendMoneyOpen}
                onOpenChange={setSendMoneyOpen}
                defaultValues={{
                    amount: "",
                }}
                senderInfo={{
                    name: userFullName,
                    email: user?.email ?? "",
                }}
            />
            <WithdrawalDialog
                open={withdrawal}
                withdrawableBalance={Number(meData?.data?.total_balance ?? 0)}
                connectedPaymentMethods={connectedPaymentMethods}
                selectedPaymentMethod={selectedPaymentMethod}
                onSelectedPaymentMethodChange={setSelectedPaymentMethod}
                onOpenChange={setwithdrawalOpen}
                onSend={(data) => {
                    withdrawHandler(Number(data?.amount), data.paymentMethod)
                }}
                isLoading={isWithdrawRequestLoading}
            />

            <ConnectPaymentMethodDialog
                open={connectWalletOpen}
                onOpenChange={setConnectWalletOpen}
                method={connectWalletMethod}
                isLoading={isConnectPaymentMethodLoading}
                onSubmit={async (method, value) => {
                    await handleConnectWallet(method, value);
                }}
            />


            <ReferralShareSheet
                open={referralLinkOpen}
                onOpenChange={setReferralLinkOpen}
                title={user?.name ? `Support ${user.name}` : "Share Referral Link"}
                shareUrl={referralShareUrl}
                onCopy={() => toast.success("Referral link copied")}
                onShare={() => toast.success("Referral link shared")}
            />

        </div>

    )
}
export default MyProfileSection;
