/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import EditProfileDialog from "@/app/(auth)/_components/myProfile/EditProfileDialog";
import EditBioDialog from "@/app/(auth)/_components/myProfile/EditBioDialog";
import GamePickerModal from "@/shared/components/modal/GamePickerModal";
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
import { useChangeFavoriteGameMutation, useEditProfileMutation, useGetMeDataQuery, useProfileVisibilityMutation, useUpdateProfileBioMutation } from "@/redux/features/auth/authapi";
import { toast } from "sonner";
import ProfileSkeleton from "./ProfileSkeleton";
import { IGameOption } from "@/types/game/gameList/gameListTypes";
import { IProfileVisibilityParams, IUserStats } from "@/types/user/auth";
import { getSafeImageSrc } from "@/shared/lib/utils/imagesrcvalidator";
import { getFullName } from "@/shared/lib/utils/name";
import { getPaymentMethodConfig } from "@/shared/constants/paymentMethods";
import ConnectPaymentMethodDialog from "@/shared/components/payment/ConnectPaymentMethodDialog";
import { usePaymentConnectionStatuses } from "@/shared/hooks/usePaymentConnectionStatuses";
import { PaymentMethodConfig } from "@/shared/constants/paymentMethods";
import { PaymentMethodId } from "@/types/user/point";
import { getErrorMessage } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { scrollToSection } from "@/shared/lib/utils/scrollToSection";
import { useGetIndividualChallengeListByUserIdQuery } from "@/redux/features/challenge/challengeManagement";
import { useAuth } from "@/redux/features/auth/hooks";
import { ApiChallengeItem, mapApiChallengeToOffer } from "@/features/challenge-match/utils/apiAdapter";
import type { ChallengeMatchOffer } from "@/features/challenge-match/types";

const MyProfileSection = () => {
    const { isAuthenticated } = useAuth();
    const [openEdit, setOpenEdit] = useState(false);
    const [editBioOpen, setEditBioOpen] = useState(false);
    const [sendMoneyOpen, setSendMoneyOpen] = useState(false);
    const [withdrawal, setwithdrawalOpen] = useState(false);
    const [referralLinkOpen, setReferralLinkOpen] = useState(false);
    const [referralShareUrl, setReferralShareUrl] = useState("");
    const [connectWalletOpen, setConnectWalletOpen] = useState(false);
    const [favoriteGamePickerOpen, setFavoriteGamePickerOpen] = useState(false);
    const [pendingFavoriteGame, setPendingFavoriteGame] = useState<IGameOption | null>(null);
    const [connectWalletMethod, setConnectWalletMethod] = useState<PaymentMethodConfig | null>(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodId | null>(null);
    const [walletActionMethod, setWalletActionMethod] = useState<PaymentMethodId | null>(null);
    const [walletActionMode, setWalletActionMode] = useState<"connect" | "disconnect" | null>(null);
    const [withdrawRequest, { isLoading: isWithdrawRequestLoading }] = useWithdrawRequestMutation()
    const [connectPaymentMethod, { isLoading: isConnectPaymentMethodLoading }] = useConnectPaymentMethodMutation()
    const [disconnectPaymentMethod] = useDisconnectPaymentMethodMutation()
    const [editProfile, { isLoading: isEditProfileLoading }] = useEditProfileMutation()
    const [changeFavoriteGame, { isLoading: isChangeFavoriteGameLoading }] = useChangeFavoriteGameMutation()
    const { data: meData, isLoading: isMeDataLoading, isFetching: isMeDataFetching } = useGetMeDataQuery(undefined, { skip: !isAuthenticated })
    const [changeProfileVisibility] = useProfileVisibilityMutation();
    const [updateProfileBio, { isLoading: isUpdateBioLoading }] = useUpdateProfileBioMutation();

    const searchParams = useSearchParams();
    const hash = typeof window !== "undefined" ? window.location.hash : "";

    useEffect(() => {
        if (hash) {
            const id = hash.replace("#", "");
            const timer = setTimeout(() => {
                scrollToSection(id, {
                    behavior: "smooth",
                    block: "start",
                    inline: "nearest",
                });
            }, 300);

            return () => clearTimeout(timer);
        }
    }, [hash]);
    const user = meData?.data?.user;
    const userFullName = getFullName(user);
    const artistName = meData?.data?.user?.artist_name;
    const fallbackAvatar = "/images/home/pro_1.jpg";
    const paymentQueryWallet = searchParams.get("wallet");
    const currentFavoriteGame = useMemo<IGameOption | null>(
        () =>
            user?.game
                ? {
                    id: user.game.id,
                    name: user.game.name,
                    image: user.game.image ?? null,
                }
                : null,
        [user?.game]
    );
    const { data: userChallengeList } = useGetIndividualChallengeListByUserIdQuery({
        id: user?.id || 0,
    })
    const {
        allMethods: paymentMethods,
        connectedMethods,
        hasConnectedMethods,
    } = usePaymentConnectionStatuses({
        enabled: Boolean(user),
    });
    const currentUserId = user?.id;
    const topOffers = useMemo(() => {
        if (!userChallengeList?.data) return [];

        const rawItems = userChallengeList.data as unknown as ApiChallengeItem[];

        return rawItems
            .map(mapApiChallengeToOffer)
            .sort((a, b) => a.rank - b.rank)
    }, [userChallengeList]);
    const challenge_matchInfo = {
        total: user?.challenge_total_count || 0,
        lost: user?.challenge_losses_count || 0,
        won: user?.challenge_wins_count || 0,
    }

    const canAcceptOffer = (offer: ChallengeMatchOffer): boolean => {
        if (offer.mode === "global") {
            return currentUserId != null && Number(offer.challenger.id) !== Number(currentUserId);
        }
        if (offer.mode === "unique") {
            return offer.targetPlayerId != null && currentUserId != null
                ? Number(offer.targetPlayerId) === Number(currentUserId) && Number(offer.challenger.id) !== Number(currentUserId)
                : false;
        }

        return true;
    };

    const visibility = {
        show_email: user?.show_email ?? false,
        show_name: user?.show_name ?? false,
        show_total_earning: user?.show_total_earning ?? false,
        show_total_referral_earning: user?.show_total_referral_earning ?? false,
        show_total_tip_received: user?.show_total_tip_received ?? false,
        show_total_withdraw: user?.show_total_withdraw ?? false,
    };

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

    const openFavoriteGamePicker = () => {
        setPendingFavoriteGame(currentFavoriteGame);
        setFavoriteGamePickerOpen(true);
    };

    const closeFavoriteGamePicker = () => {
        setFavoriteGamePickerOpen(false);
        setPendingFavoriteGame(currentFavoriteGame);
    };

    const handleFavoriteGameSave = async () => {
        if (!pendingFavoriteGame?.id) {
            toast.error("Please select a game first");
            return;
        }

        try {
            const response = await changeFavoriteGame({
                game_id: pendingFavoriteGame.id,
            }).unwrap();

            if (response?.success) {
                toast.success(
                    response.message || `${pendingFavoriteGame.name} set as your favorite game`
                );
                closeFavoriteGamePicker();
                return;
            }

            toast.error(response?.message || "Failed to update favorite game");
        } catch (error) {
            toast.error(getErrorMessage(error, "Failed to update favorite game"));
        }
    };
    const handleBioSave = async (bio: string) => {
        try {
            const response = await updateProfileBio({ bio }).unwrap();
            if (response?.success) {
                toast.success(response.message || "Bio updated successfully");
                setEditBioOpen(false);
            } else {
                toast.error(response?.message || "Failed to update bio");
            }
        } catch (error) {
            toast.error(getErrorMessage(error, "Failed to update bio"));
        }
    };
    const handleVisibilityToggle = async (
        key: keyof IProfileVisibilityParams
    ) => {
        if (!user) return;

        await changeProfileVisibility({
            show_email: key === "show_email"
                ? !user.show_email
                : user.show_email,

            show_name: key === "show_name"
                ? !user.show_name
                : user.show_name,

            show_total_earning:
                key === "show_total_earning"
                    ? !user.show_total_earning
                    : user.show_total_earning,

            show_total_referral_earning:
                key === "show_total_referral_earning"
                    ? !user.show_total_referral_earning
                    : user.show_total_referral_earning,

            show_total_tip_received:
                key === "show_total_tip_received"
                    ? !user.show_total_tip_received
                    : user.show_total_tip_received,

            show_total_withdraw:
                key === "show_total_withdraw"
                    ? !user.show_total_withdraw
                    : user.show_total_withdraw,
        }).unwrap();
    };

    return (
        <div className="container py-5 md:py-10">
            {
                isMeDataLoading || isMeDataFetching ? (
                    <ProfileSkeleton />
                ) : (
                    <MyProfilePanel
                        artistName={artistName as any}
                        profile={{
                            name: userFullName,
                            email: user?.email || "",
                            contact: user?.phone_number ?? "",
                            nationality: user?.nationality ?? "",
                            avatar: getSafeImageSrc(user?.image, "/images/home/pro_1.jpg"),
                            posts: user?.total_post ?? 0,
                            followers: String(user?.followers_count ?? 0),
                            following: String(user?.following_count ?? 0),
                            bio: user?.bio ?? null,
                            favoriteGame: user?.game
                                ? {
                                    id: user.game.id,
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
                        challengeStats={challenge_matchInfo}
                        isBigBoss={isBigBoss}
                        paymentMethods={paymentMethods}
                        selectedPaymentMethod={selectedPaymentMethod}
                        walletActionMethod={walletActionMethod}
                        walletActionMode={walletActionMode}
                        visibility={visibility}
                        visibilityToggles={{
                            onToggleNameVisibility: () => handleVisibilityToggle("show_name"),
                            onToggleEmailVisibility: () => handleVisibilityToggle("show_email"),
                            onToggleTotalEarningVisibility: () => handleVisibilityToggle("show_total_earning"),
                            onToggleTotalReferralEarningVisibility: () => handleVisibilityToggle("show_total_referral_earning"),
                            onToggleTotalTipReceivedVisibility: () => handleVisibilityToggle("show_total_tip_received"),
                            onToggleTotalWithdrawVisibility: () => handleVisibilityToggle("show_total_withdraw"),
                        }}
                        onEditProfile={() => setOpenEdit(true)}
                        onChangeFavoriteGame={openFavoriteGamePicker}
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
                        topOneOffer={topOffers}
                        canAcceptOffer={(offer) => canAcceptOffer(offer)}
                        onPostsClick={() => scrollToSection("my-posts")}
                        onEditBio={() => setEditBioOpen(true)}
                    />
                )
            }

            <GamePickerModal
                open={favoriteGamePickerOpen}
                onClose={closeFavoriteGamePicker}
                onSelect={setPendingFavoriteGame}
                selectedId={pendingFavoriteGame?.id ?? currentFavoriteGame?.id}
                title={currentFavoriteGame ? "Change Favorite Game" : "Choose Your Favorite Game"}
                helperText="Select a game and save it to update your profile."
                closeOnSelect={false}
                footer={
                    <div className="mt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={closeFavoriteGamePicker}
                            className="flex-1 rounded-[12px] border border-white/12 bg-white/6 px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={() => void handleFavoriteGameSave()}
                            disabled={
                                !pendingFavoriteGame?.id ||
                                isChangeFavoriteGameLoading ||
                                pendingFavoriteGame.id === currentFavoriteGame?.id
                            }
                            className="flex-1 rounded-[12px] bg-[#FF2EC8] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#ff4ad1] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isChangeFavoriteGameLoading ? "Saving..." : "Save Favorite"}
                        </button>
                    </div>
                }
            />

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
                    artist_name: user?.artist_name ?? "",
                    city: user?.city ?? "",
                }}
                isLoading={isEditProfileLoading}
                onSave={async (data) => {
                    const formData = new FormData();

                    formData.append("first_name", data.first_name);
                    formData.append("middle_name", data.middle_name);
                    formData.append("last_name", data.last_name);
                    formData.append("artist_name", data.artist_name || "");
                    formData.append("city", data.city || "");
                    formData.append("phone_number", data.contact ?? "");
                    formData.append("nationality", data.nationality ?? "");

                    if (data.image instanceof File) {
                        formData.append("image", data.image);
                    }

                    const response = await editProfile(formData).unwrap();

                    if (!response?.success) {
                        throw new Error(response?.message || "Profile update failed");
                    }

                    toast.success(response?.message || "Profile updated successfully");
                    setOpenEdit(false);
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
                title={user?.artist_name ? `Support ${user?.artist_name || user?.name}` : "Share Referral Link"}
                shareUrl={referralShareUrl}
                imageSrc={user?.image}
                onCopy={() => toast.success("Referral link copied")}
                onShare={() => toast.success("Referral link shared")}
            />

            <EditBioDialog
                open={editBioOpen}
                onOpenChange={setEditBioOpen}
                defaultBio={user?.bio}
                onSave={handleBioSave}
                isLoading={isUpdateBioLoading}
            />

        </div>

    )
}
export default MyProfileSection;
