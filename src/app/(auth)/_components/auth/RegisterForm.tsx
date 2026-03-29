/* eslint-disable @next/next/no-img-element */

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useFacebookLoginMutation, useGoogleLoginMutation, useRegisterUserMutation } from "@/redux/features/auth/authapi";
import { PrimaryButton } from "@/shared/UI/button/PrimaryButton";
import { SocialButton } from "@/shared/UI/button/SocialButton";
import { LockIcon, MailIcon, UserIcon } from "@/shared/UI/icon/icon";
import { AuthInput } from "@/shared/UI/reusable/auth/AuthInput";
import { executeSocialLogin } from "@/shared/lib/auth/socialLogin";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import GamePickerModal from "@/shared/components/modal/GamePickerModal";
import { IAuthRegisterParams } from "@/types/user/auth";


interface SelectedGame {
    id: number;
    name: string;
    image: string;
}

export function RegisterForm({ onGoLogin }: { onGoLogin: () => void }) {
    const [registerUser, { isLoading }] = useRegisterUserMutation();
    const { register, handleSubmit } = useForm<IAuthRegisterParams>();
    const [googleLogin] = useGoogleLoginMutation();
    const [facebookLogin] = useFacebookLoginMutation();

    const [gamePickerOpen, setGamePickerOpen] = useState(false);
    const [selectedGame, setSelectedGame] = useState<SelectedGame | null>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const referralFromUrl = new URLSearchParams(window.location.search).get("ref");
        if (referralFromUrl) {
            sessionStorage.setItem("pending_referral", referralFromUrl);
        }
    }, []);

    const getReferralId = () => {
        if (typeof window === "undefined") return null;

        const referralFromUrl = new URLSearchParams(window.location.search).get("ref");
        return referralFromUrl || sessionStorage.getItem("pending_referral");
    };

    const handleGoogleLogin = async () => {
        await executeSocialLogin(() => googleLogin().unwrap());
    };

    const handleFacebookLogin = async () => {
        await executeSocialLogin(() => facebookLogin().unwrap());
    };

    const onSubmit = async (data: IAuthRegisterParams) => {
        const payload: IAuthRegisterParams = {
            ...data,
            game_id: selectedGame?.id ?? null,
            referral_id: getReferralId(),
        };

        const result = await registerUser(payload);

        if ("data" in result) {
            if (typeof window !== "undefined") {
                sessionStorage.removeItem("pending_referral");
            }
            toast.success(result.data?.message ?? "User registered successfully");
            onGoLogin();
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
                        Please enter your name or artist name, email and password
                    </p>
                </div>

                <div className="mt-8 space-y-4">
                    <AuthInput
                        label="Full name or artist name"
                        name="name"
                        register={register as any}
                        icon={<UserIcon />}
                    />
                    <AuthInput
                        label="Email"
                        name="email"
                        type="email"
                        register={register as any}
                        icon={<MailIcon />}
                    />
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
                                            src={selectedGame.image}
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
                        <SocialButton kind="apple" handleSocialLogin={() => console.log("apple")} />
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






// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useFacebookLoginMutation, useGoogleLoginMutation, useRegisterUserMutation } from "@/redux/features/auth/authapi";
// import { PrimaryButton } from "@/shared/UI/button/PrimaryButton";
// import { SocialButton } from "@/shared/UI/button/SocialButton";
// import { LockIcon, MailIcon, UserIcon } from "@/shared/UI/icon/icon";
// import { AuthInput } from "@/shared/UI/reusable/auth/AuthInput";
// import { executeSocialLogin } from "@/shared/lib/auth/socialLogin";
// import { useForm } from "react-hook-form";
// import { toast } from "sonner";

// export function RegisterForm({ onGoLogin }: { onGoLogin: () => void }) {
//     const [registerUser, { isLoading }] = useRegisterUserMutation()
//     const { register, handleSubmit } = useForm();
//     const [googleLogin] = useGoogleLoginMutation();
//     const [facebookLogin] = useFacebookLoginMutation();

//     const handleGoogleLogin = async () => {
//         await executeSocialLogin(() => googleLogin().unwrap());
//     };

//     const handleFacebookLogin = async () => {
//         await executeSocialLogin(() => facebookLogin().unwrap());
//     };

//     const onSubmit = async (data: any) => {
//         const result = await registerUser(data)

//         if ('data' in result) {
//             toast.success(result.data?.message ?? "User registered successfully")
//         } else if ('error' in result) {

//             const error = result.error as any
//             toast.error(error?.data?.message ?? "Something went wrong")
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit(onSubmit)} className="relative ">
//             <div className="text-center">
//                 <h2 className="text-[22px] font-semibold text-white">
//                     Welcome
//                 </h2>
//                 <p className="mt-2 text-[13px] text-white/55">
//                     Please enter your name or artist name , email and password
//                 </p>
//             </div>

//             <div className="mt-8 space-y-4">
//                 <AuthInput
//                     label="Full name or artist name"
//                     name="name"
//                     register={register as any}
//                     icon={<UserIcon />}
//                 />
//                 <AuthInput
//                     label="Email"
//                     name="email"
//                     type="email"
//                     register={register as any}
//                     icon={<MailIcon />}
//                 />
//                 <AuthInput
//                     label="Password"
//                     name="password"
//                     type="password"
//                     register={register as any}
//                     icon={<LockIcon />}
//                 />
//                 <AuthInput
//                     label="Confirm Password"
//                     name="c_password"
//                     type="password"
//                     register={register as any}
//                     icon={<LockIcon />}
//                 />

//                 <div className="pt-2">
//                     <PrimaryButton isLoading={isLoading} loadingText="Registering..." text="Register" variant="pink" />
//                 </div>

//                 <div className="mt-6 flex items-center justify-center gap-3">
//                     <SocialButton kind="google" handleSocialLogin={handleGoogleLogin} />
//                     <SocialButton kind="apple" handleSocialLogin={() => {
//                         console.log("apple");
//                     }} />
//                     <SocialButton kind="facebook" handleSocialLogin={handleFacebookLogin} />
//                 </div>

//                 <p className="mt-6 text-center text-[13px] text-white/45">
//                     Already have an account?{" "}
//                     <button
//                         type="button"
//                         onClick={onGoLogin}
//                         className="cursor-pointer text-[#24C3FF] hover:underline"
//                     >
//                         Log In Now!
//                     </button>
//                 </p>
//             </div>
//         </form>
//     );
// }
