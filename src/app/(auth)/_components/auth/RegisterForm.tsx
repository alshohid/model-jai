/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { Edit, MailboxIcon, MapIcon, MapPinnedIcon, MicIcon, Loader2 } from "lucide-react";
import { PrimaryButton } from "@/shared/UI/button/PrimaryButton";
import { AuthInput } from "@/shared/UI/reusable/auth/AuthInput";
import { LockIcon, MailIcon, UserIcon } from "@/shared/UI/icon/icon";
import GamePickerModal from "@/shared/components/modal/GamePickerModal";
import { IGameOption } from "@/types/game/gameList/gameListTypes";
import { IAuthRegisterParams } from "@/types/user/auth";
import { useForm, useWatch } from "react-hook-form";
import { useNominatimGeocode } from "@/shared/hooks/useNominatimGeocode";

import { SocialLoginButtons } from "./SocialLoginButtons";
import { useRegister } from "./useRegister";

export function RegisterForm({ onGoLogin }: { onGoLogin: () => void }) {
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

    const {
        isLoading,
        handleGoogleLogin,
        handleAppleLogin,
        handleFacebookLogin,
        submitRegistration,
    } = useRegister();

    const [gamePickerOpen, setGamePickerOpen] = useState(false);
    const [selectedGame, setSelectedGame] = useState<IGameOption | null>(null);
    const [addressFocused, setAddressFocused] = useState(false);

    const {
        results: addressResults,
        isLoading: isAddressLoading,
        setSearchQuery: setAddressQuery,
        clearResults: clearAddressResults,
        parseAddressFields,
    } = useNominatimGeocode();

    const watchedAddress = useWatch({ control, name: "address" });

    useEffect(() => {
        if (watchedAddress && addressFocused) {
            setAddressQuery(watchedAddress);
        }
    }, [watchedAddress, addressFocused, setAddressQuery]);

    const isSocialVerificationEnabled = useWatch({
        control,
        name: "social_verification_status",
    }) ?? false;

    useEffect(() => {
        register("social_verification_status");
    }, [register]);

    const onSubmit = async (values: IAuthRegisterParams) => {
        const ok = await submitRegistration(values, selectedGame?.id);
        if (ok) onGoLogin();
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
                            register={register}
                            icon={<UserIcon />}
                        />
                    </div>
                    <AuthInput
                        label="Middle Name (Optional)"
                        name="middle_name"
                        register={register}
                        icon={<UserIcon />}
                        required={false}
                    />
                    <AuthInput
                        label="Last Name"
                        name="last_name"
                        register={register}
                        icon={<UserIcon />}
                    />
                    <AuthInput
                        label="Artist Name"
                        name="artist_name"
                        register={register}
                        icon={<Edit className="size-4 text-white" />}
                    />
                    <AuthInput
                        label="Email"
                        name="email"
                        type="email"
                        register={register}
                        icon={<MailIcon />}
                    />
                    {/* ── Address with Nominatim autocomplete ── */}
                    <div className="relative">
                        <AuthInput
                            label="Address"
                            name="address"
                            register={register}
                            icon={<MapPinnedIcon className="size-4 text-white" />}
                            required={false}
                            onFocus={() => {
                                setAddressFocused(true);
                            }}
                            onBlur={() => {
                                // Delay hiding so click on dropdown registers first
                                setTimeout(() => {
                                    setAddressFocused(false);
                                }, 200);
                            }}
                        />

                        {/* Nominatim suggestion dropdown */}
                        {addressFocused && (addressResults.length > 0 || isAddressLoading) && (
                            <div className="absolute z-50 mt-1 w-full rounded-lg border border-white/10 bg-[#1a1a2e] shadow-xl backdrop-blur-md max-h-52 overflow-y-auto">
                                {isAddressLoading && (
                                    <div className="flex items-center justify-center gap-2 px-4 py-3 text-[13px] text-white/50">
                                        <Loader2 className="size-4 animate-spin" />
                                        Searching...
                                    </div>
                                )}

                                {!isAddressLoading &&
                                    addressResults.map((result) => (
                                        <button
                                            key={result.place_id}
                                            type="button"
                                            onMouseDown={(e) => {
                                                e.preventDefault();

                                                const fields = parseAddressFields(result);

                                                setValue("address", result.display_name, {
                                                    shouldDirty: true,
                                                });
                                                setValue("city", fields.city, {
                                                    shouldDirty: true,
                                                });
                                                setValue("state", fields.state, {
                                                    shouldDirty: true,
                                                });
                                                setValue("zip_code", fields.zip_code, {
                                                    shouldDirty: true,
                                                });

                                                // Clear results so the watcher doesn't re-trigger with same value
                                                clearAddressResults();
                                                setAddressFocused(false);
                                            }}
                                            className="w-full text-left px-4 py-2.5 text-[13px] text-white/80 hover:bg-white/10 hover:text-white transition-colors border-b border-white/5 last:border-b-0"
                                        >
                                            <span className="block truncate">
                                                {result.display_name}
                                            </span>
                                            <span className="block text-[11px] text-white/40 mt-0.5">
                                                {result.type} • {result.lat}, {result.lon}
                                            </span>
                                        </button>
                                    ))}
                            </div>
                        )}
                    </div>
                    {/* ── End Address autocomplete ── */}

                    <AuthInput
                        label="City"
                        name="city"
                        register={register}
                        icon={<MapIcon className="size-4 text-white" />}
                        required={false}
                    />

                    <div className="grid gap-4 md:grid-cols-2">
                        <AuthInput
                            label="State"
                            name="state"
                            register={register}
                            icon={<MapIcon className="size-4 text-white" />}
                            required={false}
                        />
                        <AuthInput
                            label="Zip Code"
                            name="zip_code"
                            register={register}
                            icon={<MailboxIcon className="size-4 text-white" />}
                            required={false}
                        />
                    </div>
                    <AuthInput
                        label="Password"
                        name="password"
                        type="password"
                        register={register}
                        icon={<LockIcon />}
                    />
                    <AuthInput
                        label="Confirm Password"
                        name="c_password"
                        type="password"
                        register={register}
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
                            register={register}
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

                    <SocialLoginButtons
                        onGoogle={handleGoogleLogin}
                        onApple={handleAppleLogin}
                        onFacebook={handleFacebookLogin}
                    />

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

