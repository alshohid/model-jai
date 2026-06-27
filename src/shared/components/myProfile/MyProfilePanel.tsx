/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { cn } from "@/shared/lib/utils/cn";
import StartStreamingButton from "@/shared/UI/button/StartStreamingButton";
import { StatCard } from "../card/StatCard";
import { MiniStat } from "../card/MiniStat";
import { InfoRow } from "../card/InfoRow";
import BigBossIndicator from "@/shared/components/user/BigBossIndicator";
import PaymentMethodLogo from "@/shared/components/payment/PaymentMethodLogo";
import { PaymentMethodConfig } from "@/shared/constants/paymentMethods";
import { PaymentMethodId } from "@/types/user/point";
import ChallengeOfferCard from "@/features/challenge-match/components/ChallengeOfferCard";
import { useRouter } from "next/navigation";
import { ChallengeMatchOffer } from "@/features/challenge-match/types";
import { FaCircleChevronDown } from "react-icons/fa6";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetClose,
} from "@/components/ui/sheet";
import { X } from "lucide-react";
import { useState } from "react";
import { MatchScoreCard } from "../user/components/match-score/MatchScoreCard";

type ProfileInfo = {
    name: string;
    email: string | null;
    contact: string;
    nationality: string;
    avatar: string;
    posts: string | number;
    followers: string | number;
    following: string | number;
    favoriteGame?: {
        id?: number;
        name?: string;
        image?: string | null;
    } | null;
};

type StatItem = {
    label: string;
    value: string;
    icon?: any;
};

type VisibilityState = {
    show_email: boolean;
    show_name: boolean;
    show_total_earning: boolean;
    show_total_referral_earning: boolean;
    show_total_tip_received: boolean;
    show_total_withdraw: boolean;
};

type VisibilityToggles = {
    onToggleEmailVisibility: () => void;
    onToggleNameVisibility: () => void;
    onToggleTotalEarningVisibility: () => void;
    onToggleTotalReferralEarningVisibility: () => void;
    onToggleTotalTipReceivedVisibility: () => void;
    onToggleTotalWithdrawVisibility: () => void;
};

type Props = {
    profile: ProfileInfo;
    artistName: string | null;
    stats: StatItem[];
    isBigBoss?: boolean;
    paymentMethods: Array<{
        method: PaymentMethodConfig;
        connected: boolean;
        identifier: string | null;
        isLoading?: boolean;
    }>;
    challengeStats?: {
        total: number;
        won: number;
        lost: number;
    };
    selectedPaymentMethod?: PaymentMethodId | null;
    walletActionMethod?: PaymentMethodId | null;
    walletActionMode?: "connect" | "disconnect" | null;
    visibility?: VisibilityState;
    visibilityToggles?: VisibilityToggles;
    onEditProfile?: () => void;
    onChangeFavoriteGame?: () => void;
    onSendMoney?: () => void;
    onReferralLink?: () => void;
    onWithdrawRequest?: () => void;
    onSelectPaymentMethod?: (paymentMethod: PaymentMethodId) => void;
    onConnectPaymentMethod?: (paymentMethod: PaymentMethodId) => void;
    onDisconnectPaymentMethod?: (paymentMethod: PaymentMethodId) => void;
    className?: string;
    topOneOffer?: ChallengeMatchOffer[];
    onPostsClick?: () => void;
    canAcceptOffer?: (offer: ChallengeMatchOffer) => boolean;
};

const statToggleKeyMap: Array<{
    label: string;
    toggleKey: keyof VisibilityToggles;
    visibleKey: keyof VisibilityState;
}> = [
        { label: "Total Earnings", toggleKey: "onToggleTotalEarningVisibility", visibleKey: "show_total_earning" },
        { label: "Total Referral Earnings", toggleKey: "onToggleTotalReferralEarningVisibility", visibleKey: "show_total_referral_earning" },
        { label: "Total Tip Received", toggleKey: "onToggleTotalTipReceivedVisibility", visibleKey: "show_total_tip_received" },
        { label: "Total Withdraw", toggleKey: "onToggleTotalWithdrawVisibility", visibleKey: "show_total_withdraw" },
    ];

export default function MyProfilePanel({
    profile,
    artistName,
    stats,
    isBigBoss = false,
    paymentMethods,
    selectedPaymentMethod,
    walletActionMethod,
    walletActionMode,
    visibility,
    challengeStats,
    visibilityToggles,
    onEditProfile,
    onChangeFavoriteGame,
    onSendMoney,
    onReferralLink,
    onWithdrawRequest,
    onSelectPaymentMethod,
    onConnectPaymentMethod,
    onDisconnectPaymentMethod,
    className,
    topOneOffer,
    onPostsClick,
    canAcceptOffer,
}: Props) {
    const [sheetOpen, setSheetOpen] = useState(false);
    const game = profile.favoriteGame;
    const canChangeFavoriteGame = Boolean(onChangeFavoriteGame);
    const connectedPaymentMethods = paymentMethods.filter((item) => item.connected);
    const hasConnectedPaymentMethod = connectedPaymentMethods.length > 0;
    const router = useRouter();

    return (
        <section
            className={cn(
                "w-full rounded-[20px] md:rounded-[24px]",
                "border border-white/10 bg-black/30 backdrop-blur-[16px]",
                "p-4 sm:p-6",
                "shadow-[0_30px_80px_rgba(0,0,0,0.55)]",
                className
            )}
        >
            {/* MAIN GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 lg:gap-10">
                {/* LEFT: Profile image */}
                <div>
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <h3 className="text-white font-semibold text-[22px] text-center">
                            My Profile
                        </h3>
                        <BigBossIndicator isBigBoss={isBigBoss} size="md" />
                    </div>

                    <div className="overflow-hidden rounded-[24px]">
                        <div className="relative w-full aspect-[4/5]">
                            <Image
                                src={profile?.avatar}
                                alt={profile?.name}
                                fill
                                priority
                                className="object-cover object-top"
                                unoptimized
                            />
                            <div className="absolute inset-x-0 bottom-4 px-4">
                                <button
                                    onClick={onEditProfile}
                                    className="w-full h-[46px] rounded-[14px]
                                    bg-white/10 border border-white/15
                                    text-white hover:bg-white/15 transition"
                                >
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="w-full">
                        {topOneOffer?.slice(0, 1).map((offer) => (
                            <ChallengeOfferCard
                                key={offer.id}
                                offer={offer}
                                compact
                                onAccept={() => router.push(`/challenge-dashboard/${offer.id}`)}
                                acceptVisible={canAcceptOffer ? canAcceptOffer(offer) : true}
                            />
                        ))}
                        {topOneOffer && topOneOffer.length > 1 && (
                            <div className="w-full flex items-center justify-center mt-2">
                                <button
                                    type="button"
                                    onClick={() => setSheetOpen(true)}
                                    className="cursor-pointer"
                                    aria-label="Show all challenges"
                                >
                                    <FaCircleChevronDown className="text-[30px] text-[#743040] transition hover:text-[#a0455a]" />
                                </button>
                            </div>
                        )}
                    </div>

                    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                        <SheetContent
                            side="bottom"
                            className="z-[110] border-t rounded-t-4xl border-white/10 bg-[#0f0a0f]/95 text-white backdrop-blur-2xl p-0 max-h-[80vh] flex flex-col [&>button.absolute]:hidden"
                        >
                            <SheetHeader className="flex-shrink-0 px-4 pt-4 pb-3 border-b border-white/10 ">
                                <div className="flex items-center justify-between">
                                    <SheetTitle className="text-white text-[17px] font-semibold">
                                        All Challenges
                                    </SheetTitle>
                                    <SheetClose asChild>
                                        <button
                                            type="button"
                                            className="rounded-full border border-white/15 bg-white/8 p-1.5 text-white/60 hover:text-white transition"
                                        >
                                            <X className="size-4" />
                                        </button>
                                    </SheetClose>
                                </div>
                            </SheetHeader>
                            <div className="flex-1 overflow-y-auto px-2 py-2">
                                {topOneOffer?.map((offer) => (
                                    <ChallengeOfferCard
                                        key={offer.id}
                                        offer={offer}
                                        compact
                                        onAccept={() => {
                                            router.push(`/challenge-dashboard/${offer.id}`);
                                            setSheetOpen(false);
                                        }}
                                        acceptVisible={canAcceptOffer ? canAcceptOffer(offer) : true}

                                    />
                                ))}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
                    {/* INFO + ACTIONS */}
                    <div>
                        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
                            {/* Info rows */}
                            <div className="min-w-0 space-y-2 py-3 md:py-8">
                                <div className="flex items-center gap-2">
                                    <InfoRow
                                        label="Name"
                                        value={profile.name}
                                        isVisible={visibility?.show_name}
                                        onToggleVisibility={visibilityToggles?.onToggleNameVisibility}
                                    />
                                    <BigBossIndicator isBigBoss={isBigBoss} size="sm" />
                                </div>
                                {
                                    artistName && (
                                        <InfoRow
                                            label="Artist Name"
                                            value={artistName}
                                        />
                                    )
                                }
                                <InfoRow
                                    label="Email"
                                    value={profile.email}
                                    isVisible={visibility?.show_email}
                                    onToggleVisibility={visibilityToggles?.onToggleEmailVisibility}
                                />

                            </div>

                            {game?.name || canChangeFavoriteGame ? (
                                <div className="w-full py-1 sm:w-auto sm:flex-shrink-0 sm:py-3 md:py-8">
                                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-white/40 sm:text-center">
                                        Fav Game
                                    </p>
                                    {canChangeFavoriteGame ? (
                                        <button
                                            type="button"
                                            onClick={onChangeFavoriteGame}
                                            className="group flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-left transition hover:bg-white/5 sm:w-auto sm:flex-col sm:items-center sm:gap-1.5 sm:border-transparent sm:bg-transparent sm:p-2 sm:text-center"
                                        >
                                            <div className="relative h-14 w-14 flex-shrink-0 rounded-xl overflow-hidden border border-[#FF2EC8]/30 shadow-[0_0_12px_rgba(255,46,200,0.2)]">
                                                {game?.image ? (
                                                    <Image
                                                        src={game.image}
                                                        alt={game.name ?? "Favorite game"}
                                                        fill
                                                        className="object-cover transition-transform duration-200 group-hover:scale-105"
                                                        unoptimized
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-[#FF2EC8]/10 flex items-center justify-center">
                                                        <span className="text-[#FF2EC8] font-black text-sm uppercase">
                                                            {game?.name
                                                                ? game.name.charAt(0).toUpperCase()
                                                                : "Pick"}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1 sm:flex-none">
                                                <p className="max-w-full truncate text-[12px] font-medium text-white/70 sm:max-w-[88px] sm:text-center sm:text-[11px]">
                                                    {game?.name ?? "Choose Game"}
                                                </p>
                                                <span className="mt-1 inline-flex rounded-full border border-[#FF2EC8]/30 bg-[#FF2EC8]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#FF9BE9] transition group-hover:border-[#FF2EC8]/60 group-hover:bg-[#FF2EC8]/15">
                                                    {game?.name ? "Change" : "Set Now"}
                                                </span>
                                            </div>
                                        </button>
                                    ) : (
                                        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3 sm:flex-col sm:items-center sm:gap-1.5 sm:border-transparent sm:bg-transparent sm:p-0">
                                            <div className="relative h-14 w-14 flex-shrink-0 rounded-xl overflow-hidden border border-[#FF2EC8]/30 shadow-[0_0_12px_rgba(255,46,200,0.2)]">
                                                {game?.image ? (
                                                    <Image
                                                        src={game.image}
                                                        alt={game.name ?? "Favorite game"}
                                                        fill
                                                        className="object-cover"
                                                        unoptimized
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-[#FF2EC8]/10 flex items-center justify-center">
                                                        <span className="text-[#FF2EC8] font-black text-xl">
                                                            {game?.name?.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <p className="min-w-0 flex-1 truncate text-[12px] font-medium text-white/70 sm:max-w-[72px] sm:flex-none sm:text-center sm:text-[11px]">
                                                {game?.name}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ) : null}
                        </div>

                        <div>
                            <div className="md:mt-2 mt-3 w-full flex items-center justify-center">
                                <MatchScoreCard
                                    title={`On ${challengeStats?.total || 0} Match`}
                                    left={{
                                        score: challengeStats?.won || 0,
                                        color: "green",
                                    }}
                                    right={{
                                        score: challengeStats?.lost || 0,
                                        color: "red",
                                    }}
                                />

                            </div>
                            <div className="md:mt-6 mt-3 rounded-[14px] border border-white/10 bg-white/5 p-3">

                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <MiniStat label="Posts" value={profile.posts} onClick={onPostsClick} />
                                    <MiniStat
                                        label="Followers"
                                        value={profile.followers}
                                        href="/user-profile/my-followers"
                                    />
                                    <MiniStat
                                        label="Following"
                                        value={profile.following}
                                        href="/user-profile/following"
                                    />
                                </div>
                            </div>
                        </div>


                        {/* BUTTONS */}
                        <div className="mt-6 space-y-3" id="my-profile-section">
                            <StartStreamingButton
                                onClick={onSendMoney}
                                className="w-full bg-[#00C3FF]"
                            >
                                Send Points
                            </StartStreamingButton>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <StartStreamingButton onClick={onReferralLink}>
                                    Referral Link
                                </StartStreamingButton>

                                <StartStreamingButton
                                    onClick={onWithdrawRequest}
                                    disabled={!hasConnectedPaymentMethod}
                                    className="bg-black/80"
                                >
                                    {hasConnectedPaymentMethod
                                        ? "Withdraw Request"
                                        : "Connect Wallet First"}
                                </StartStreamingButton>
                            </div>
                        </div>

                        <div className="mt-6 rounded-[18px] border border-white/10 bg-white/5 p-4">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-[11px] uppercase tracking-[0.28em] text-white/40">
                                        Withdrawal Accounts
                                    </p>
                                    <h4 className="mt-2 text-lg font-semibold text-white">
                                        Connect your payout methods
                                    </h4>
                                    <p className="mt-1 text-sm leading-6 text-white/55">
                                        Choose any connected wallet when you request a withdrawal.
                                    </p>
                                </div>

                                <div className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-xs font-medium text-white/65">
                                    {connectedPaymentMethods.length}/{paymentMethods.length} connected
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                                {paymentMethods.map((item) => {
                                    const isSelected =
                                        item.connected &&
                                        selectedPaymentMethod === item.method.id;
                                    const isBusy = walletActionMethod === item.method.id;

                                    return (
                                        <div
                                            key={item.method.id}
                                            className={cn(
                                                "rounded-[18px] border p-3 transition",
                                                item.connected
                                                    ? "border-[#00C3FF]/18 bg-[#00C3FF]/6"
                                                    : "border-white/10 bg-black/20",
                                                isSelected && "border-[#00C3FF]/40 bg-[#00C3FF]/10"
                                            )}
                                        >
                                            <div className="flex items-start gap-3">
                                                <PaymentMethodLogo
                                                    method={item.method}
                                                    className="size-12 rounded-[16px]"
                                                />

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center justify-between gap-3">
                                                        <p className="text-sm font-semibold text-white">
                                                            {item.method.name}
                                                        </p>
                                                        <span
                                                            className={cn(
                                                                "rounded-full px-2.5 py-1 text-wrap text-[10px] font-semibold uppercase tracking-[0.18em]",
                                                                item.connected
                                                                    ? "bg-[#00C3FF]/14 text-[#9FE8FF]"
                                                                    : "bg-white/8 text-white/45"
                                                            )}
                                                        >
                                                            {item.connected ? "Connected" : "Not Connected"}
                                                        </span>
                                                    </div>

                                                    <p className="mt-1 max-w-full break-words whitespace-normal text-xs leading-5 text-white/55">
                                                        {item.connected
                                                            ? item.identifier || `${item.method.name} account connected`
                                                            : item.method.description}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {item.connected ? (
                                                    <>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                onSelectPaymentMethod?.(item.method.id)
                                                            }
                                                            className={cn(
                                                                "rounded-full border px-3 py-2 text-wrap text-xs font-medium transition",
                                                                isSelected
                                                                    ? "border-[#00C3FF]/40 bg-[#00C3FF]/14 text-[#C8F4FF]"
                                                                    : "border-white/12 bg-white/6 text-white/70 hover:text-white"
                                                            )}
                                                        >
                                                            {isSelected ? "Selected for Withdraw" : "Use for Withdraw"}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                onDisconnectPaymentMethod?.(item.method.id)
                                                            }
                                                            disabled={isBusy}
                                                            className="rounded-full border border-white/12 bg-black/30 px-3 py-2 text-wrap text-xs font-medium text-white/65 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                                                        >
                                                            {isBusy && walletActionMode === "disconnect"
                                                                ? "Disconnecting..."
                                                                : "Disconnect"}
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            onConnectPaymentMethod?.(item.method.id)
                                                        }
                                                        disabled={isBusy || item.isLoading}
                                                        className="rounded-full border border-white/12 bg-white/8 px-3 py-2 text-wrap text-xs font-medium text-white transition hover:bg-white/12 disabled:cursor-not-allowed disabled:opacity-60"
                                                    >
                                                        {isBusy && walletActionMode === "connect"
                                                            ? "Connecting..."
                                                            : item.method.id === "stripe"
                                                                ? "Connect Stripe"
                                                                : `Connect ${item.method.name}`}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* STAT CARDS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                        {stats.map((s, idx) => {
                            const statToggle = statToggleKeyMap.find((st) => st.label === s.label);
                            return (
                                <StatCard
                                    key={idx}
                                    label={s.label}
                                    value={s.value}
                                    icon={s.icon}
                                    isVisible={statToggle && visibility ? visibility[statToggle.visibleKey] : undefined}
                                    onToggleVisibility={
                                        statToggle && visibilityToggles
                                            ? visibilityToggles[statToggle.toggleKey]
                                            : undefined
                                    }
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}