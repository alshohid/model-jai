/* eslint-disable @next/next/no-img-element */

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useAppleLoginMutation, useFacebookLoginMutation, useGoogleLoginMutation, useRegisterUserMutation } from "@/redux/features/auth/authapi";
import { PrimaryButton } from "@/shared/UI/button/PrimaryButton";
import { SocialButton } from "@/shared/UI/button/SocialButton";
import { LockIcon, MailIcon, UserIcon } from "@/shared/UI/icon/icon";
import { AuthInput } from "@/shared/UI/reusable/auth/AuthInput";
import { executeSocialLogin } from "@/shared/lib/auth/socialLogin";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import GamePickerModal from "@/shared/components/modal/GamePickerModal";
import { IGameOption } from "@/types/game/gameList/gameListTypes";
import { IAuthRegisterParams } from "@/types/user/auth";
import { Edit, MailboxIcon, MapIcon, MapPinnedIcon, MicIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { safeRedirect } from "@/shared/UI/reusable/redirect/safeRedirect";

const PENDING_REFERRAL_KEY = "pending_referral";
const PENDING_AUTH_REDIRECT_KEY = "pending_auth_redirect";

const getReferralFromRedirect = (rawRedirect: string | null) => {
    const redirect = safeRedirect(rawRedirect);
    const queryIndex = redirect.indexOf("?");

    if (queryIndex === -1) return null;

    return new URLSearchParams(redirect.slice(queryIndex + 1)).get("ref");
};

export function RegisterForm({ onGoLogin }: { onGoLogin: () => void }) {
    const router = useRouter();
    const [registerUser, { isLoading }] = useRegisterUserMutation();
    const { register, handleSubmit, control, setValue } = useForm<IAuthRegisterParams>({
        defaultValues: {
            first_name: "",
            middle_name: "",
            last_name: "",
            artist_name: "",
            email: "",
            password: "",
            c_password: "",
            address: "",
            city: "",
            zip_code: "",
            state: "",
            social_verification_status: false,
            social_verification_number: "",
        },
    });
    const [googleLogin] = useGoogleLoginMutation();
    const [facebookLogin] = useFacebookLoginMutation();
    const [appleLogin] = useAppleLoginMutation();

    const [gamePickerOpen, setGamePickerOpen] = useState(false);
    const [selectedGame, setSelectedGame] = useState<IGameOption | null>(null);
    const isSocialVerificationEnabled = useWatch({
        control,
        name: "social_verification_status",
    }) ?? false;

    useEffect(() => {
        if (typeof window === "undefined") return;

        const searchParams = new URLSearchParams(window.location.search);
        const redirectParam = searchParams.get("redirect");
        const redirectFromUrl = safeRedirect(redirectParam);
        const referralFromUrl =
            searchParams.get("ref") || getReferralFromRedirect(redirectParam);

        if (referralFromUrl) {
            sessionStorage.setItem(PENDING_REFERRAL_KEY, referralFromUrl);
        }

        if (redirectFromUrl !== "/") {
            sessionStorage.setItem(PENDING_AUTH_REDIRECT_KEY, redirectFromUrl);
        }
    }, []);

    useEffect(() => {
        register("social_verification_status");
    }, [register]);

    const getReferralId = () => {
        if (typeof window === "undefined") return null;

        const searchParams = new URLSearchParams(window.location.search);
        const redirectFromUrl = searchParams.get("redirect");
        const redirectFromStorage = sessionStorage.getItem(PENDING_AUTH_REDIRECT_KEY);

        return (
            searchParams.get("ref") ||
            getReferralFromRedirect(redirectFromUrl) ||
            sessionStorage.getItem(PENDING_REFERRAL_KEY) ||
            getReferralFromRedirect(redirectFromStorage)
        );
    };

    const getAuthRedirect = () => {
        if (typeof window === "undefined") return "/";

        const redirectFromUrl = new URLSearchParams(window.location.search).get("redirect");
        const redirectFromStorage = sessionStorage.getItem(PENDING_AUTH_REDIRECT_KEY);

        return safeRedirect(redirectFromUrl || redirectFromStorage);
    };

    const rememberRedirectForSocialLogin = () => {
        if (typeof window === "undefined") return;

        const redirect = getAuthRedirect();
        if (redirect !== "/") {
            sessionStorage.setItem(PENDING_AUTH_REDIRECT_KEY, redirect);
        }
    };

    const handleGoogleLogin = async () => {
        rememberRedirectForSocialLogin();
        await executeSocialLogin(() => googleLogin().unwrap());
    };

    const handleFacebookLogin = async () => {
        rememberRedirectForSocialLogin();
        await executeSocialLogin(() => facebookLogin().unwrap());
    };

    const handleAppleLogin = async () => {
        rememberRedirectForSocialLogin();
        await executeSocialLogin(() => appleLogin().unwrap());
    };

    const normalizeOptionalText = (value?: string | null) => {
        const trimmedValue = value?.trim();
        return trimmedValue ? trimmedValue : null;
    };

    const onSubmit = async (data: IAuthRegisterParams) => {
        const payload: IAuthRegisterParams = {
            ...data,
            first_name: data.first_name.trim(),
            middle_name: normalizeOptionalText(data.middle_name),
            last_name: data.last_name.trim(),
            artist_name: data.artist_name.trim(),
            address: normalizeOptionalText(data.address),
            city: normalizeOptionalText(data.city),
            zip_code: normalizeOptionalText(data.zip_code),
            state: normalizeOptionalText(data.state),
            social_verification_status: Boolean(data.social_verification_status),
            social_verification_number: data.social_verification_status
                ? normalizeOptionalText(data.social_verification_number)
                : null,
            game_id: selectedGame?.id ?? null,
            referral_id: getReferralId(),
        };

        const result = await registerUser(payload);

        if ("data" in result) {
            const redirect = getAuthRedirect();
            const loginParams = new URLSearchParams();

            if (redirect !== "/") {
                loginParams.set("redirect", redirect);
            }

            if (typeof window !== "undefined") {
                sessionStorage.removeItem(PENDING_REFERRAL_KEY);
            }

            toast.success(result.data?.message ?? "User registered successfully");
            onGoLogin();
            router.push("/login" + (loginParams.toString() ? "?" + loginParams.toString() : ""));
        } else if ("error" in result) {
            const error = result.error as any;
            toast.error(error?.data?.message ?? "Something went wrong");
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="relative">
                <div className="text-center">
                    <h2 className="text-[22px] font-semibold text-white">Welcome</h2>
                    <p className="mt-2 text-[13px] text-white/55">
                        Please enter your name, contact details and password
                    </p>
                </div>

                <div className="mt-8 space-y-4">
                    <div className="grid gap-4">
                        <AuthInput
                            label="First Name"
                            name="first_name"
                            register={register as any}
                            icon={<UserIcon />}
                        />
                    </div>
                    <AuthInput
                        label="Middle Name (Optional)"
                        name="middle_name"
                        register={register as any}
                        icon={<UserIcon />}
                        required={false}
                    />
                    <AuthInput
                        label="Last Name"
                        name="last_name"
                        register={register as any}
                        icon={<UserIcon />}
                    />
                    <AuthInput
                        label="Artist Name"
                        name="artist_name"
                        register={register as any}
                        icon={<Edit className="size-4 text-white" />}
                    />
                    <AuthInput
                        label="Email"
                        name="email"
                        type="email"
                        register={register as any}
                        icon={<MailIcon />}
                    />
                    <AuthInput
                        label="Address"
                        name="address"
                        register={register as any}
                        icon={<MapPinnedIcon className="size-4 text-white" />}
                        required={false}
                    /> <AuthInput
                        label="City"
                        name="city"
                        register={register as any}
                        icon={<MapIcon className="size-4 text-white" />}
                        required={false}
                    />

                    <div className="grid gap-4 md:grid-cols-2">
                        <AuthInput
                            label="State"
                            name="state"
                            register={register as any}
                            icon={<MapIcon className="size-4 text-white" />}
                            required={false}
                        />
                        <AuthInput
                            label="Zip Code"
                            name="zip_code"
                            register={register as any}
                            icon={<MailboxIcon className="size-4 text-white" />}
                            required={false}
                        />
                    </div>
                    <AuthInput
                        label="Password"
                        name="password"
                        type="password"
                        register={register as any}
                        icon={<LockIcon />}
                    />
                    <AuthInput
                        label="Confirm Password"
                        name="c_password"
                        type="password"
                        register={register as any}
                        icon={<LockIcon />}
                    />
                    <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                        <div className="space-y-1">
                            <p className="text-[13px] font-semibold text-white">
                                Social Verification Status
                            </p>

                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                const nextValue = !isSocialVerificationEnabled;

                                setValue(
                                    "social_verification_status",
                                    nextValue,
                                    { shouldDirty: true }
                                );

                                if (!nextValue) {
                                    setValue("social_verification_number", "", {
                                        shouldDirty: true,
                                    });
                                }
                            }}
                            className={[
                                "relative h-6 w-12 rounded-full transition-all duration-300 cursor-pointer",
                                isSocialVerificationEnabled
                                    ? "bg-[#22CAAD] shadow-[0_0_12px_rgba(34,202,173,0.35)]"
                                    : "bg-white/15",
                            ].join(" ")}
                            aria-label="Toggle social verification status"
                            aria-pressed={isSocialVerificationEnabled}
                        >
                            <span
                                className={[
                                    "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-all duration-300",
                                    isSocialVerificationEnabled ? "left-6" : "left-0.5",
                                ].join(" ")}
                            />
                        </button>
                    </div>

                    {isSocialVerificationEnabled && (
                        <AuthInput
                            label="Social Verification Number"
                            name="social_verification_number"
                            type="number"
                            register={register as any}
                            icon={<MicIcon className="size-4 text-white" />}
                        />
                    )}

                    {/* ── Favorite Game Picker Field ── */}
                    <div className="space-y-1.5">
                        <label className="block text-[12px] font-medium text-white/60 uppercase tracking-widest">
                            Favorite Game
                        </label>

                        <button
                            type="button"
                            onClick={() => setGamePickerOpen(true)}
                            className={`
                                w-full h-11 px-3 rounded-lg border transition-all duration-200
                                flex items-center gap-3 text-left cursor-pointer
                                ${selectedGame
                                    ? "border-[#FF2EC8]/60 bg-[#FF2EC8]/5 hover:border-[#FF2EC8]"
                                    : "border-white/10 bg-white/5 hover:border-white/25"
                                }
                            `}
                        >
                            {selectedGame ? (
                                <>
                                    {/* Thumbnail */}
                                    <div className="w-7 h-7 rounded-md overflow-hidden flex-shrink-0 border border-white/10">
                                        <img
                                            src={selectedGame.image ?? "/images/home/gameLogo.png"}
                                            alt={selectedGame.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <span className="flex-1 text-[13px] text-white font-medium truncate">
                                        {selectedGame.name}
                                    </span>

                                    {/* Change hint */}
                                    <span className="text-[11px] text-[#FF2EC8]/70 flex-shrink-0">
                                        Change
                                    </span>
                                </>
                            ) : (
                                <>
                                    {/* Controller icon */}
                                    <span className="text-white/30 flex-shrink-0">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="2" y="6" width="20" height="12" rx="4" />
                                            <path d="M6 12h4M8 10v4" />
                                            <circle cx="15" cy="11" r="1" fill="currentColor" stroke="none" />
                                            <circle cx="17" cy="13" r="1" fill="currentColor" stroke="none" />
                                        </svg>
                                    </span>

                                    <span className="flex-1 text-[13px] text-white/35">
                                        Choose your favorite game
                                    </span>

                                    {/* Arrow */}
                                    <svg className="text-white/25 flex-shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="9 18 15 12 9 6" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </div>
                    {/* ── End Favorite Game Picker ── */}

                    <div className="pt-2">
                        <PrimaryButton
                            isLoading={isLoading}
                            loadingText="Registering..."
                            text="Register"
                            variant="pink"
                        />
                    </div>

                    <div className="mt-6 flex items-center justify-center gap-3">
                        <SocialButton kind="google" handleSocialLogin={handleGoogleLogin} />
                        <SocialButton kind="apple" handleSocialLogin={handleAppleLogin} />
                        <SocialButton kind="facebook" handleSocialLogin={handleFacebookLogin} />
                    </div>

                    <p className="mt-6 text-center text-[13px] text-white/45">
                        Already have an account?{" "}
                        <button
                            type="button"
                            onClick={onGoLogin}
                            className="cursor-pointer text-[#24C3FF] hover:underline"
                        >
                            Log In Now!
                        </button>
                    </p>
                </div>
            </form>

            {/* Game Picker Modal — rendered outside <form> to avoid nesting issues */}
            <GamePickerModal
                open={gamePickerOpen}
                onClose={() => setGamePickerOpen(false)}
                onSelect={(game) => setSelectedGame(game)}
                selectedId={selectedGame?.id}
            />
        </>
    );
}

