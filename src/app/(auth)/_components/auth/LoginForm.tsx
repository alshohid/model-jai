"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { PrimaryButton } from "@/shared/UI/button/PrimaryButton";
import { LockIcon, MailIcon } from "@/shared/UI/icon/icon";
import { AuthInput } from "@/shared/UI/reusable/auth/AuthInput";
import { safeRedirect } from "@/shared/UI/reusable/redirect/safeRedirect";
import { ILoginParams } from "@/types/user/auth";

import { getStoredAuthRedirect } from "./authRedirects";
import { SocialLoginButtons } from "./SocialLoginButtons";
import { useLogin } from "./useLogin";

export function LoginForm({ onGoRegister }: { onGoRegister: () => void }) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const { register, handleSubmit } = useForm<ILoginParams>();
    const redirect = safeRedirect(
        searchParams.get("redirect") || getStoredAuthRedirect(),
    );

    const {
        onSubmit,
        handleGoogleLogin,
        handleAppleLogin,
        handleFacebookLogin,
        errorLogin,
        isLoading,
    } = useLogin(redirect);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="relative ">
            <div className="text-center">
                <h2 className="text-[22px] font-semibold text-white">Welcome</h2>
                <p className="mt-2 text-[13px] text-white/55">
                    Please enter your email and password
                </p>
            </div>

            <div className="mt-8 space-y-4">
                <AuthInput
                    label="Email"
                    name="email"
                    type="email"
                    register={register}
                    icon={<MailIcon />}
                />
                <AuthInput
                    label="Password"
                    name="password"
                    type="password"
                    register={register}
                    icon={<LockIcon />}
                />
                <span className="text-red-600">
                    {errorLogin ? errorLogin : ""}
                </span>
                <div className="pt-2">
                    <PrimaryButton
                        isLoading={isLoading}
                        loadingText="Logging in..."
                        text="Log In"
                        variant="pink"
                    />
                </div>

                <button
                    type="button"
                    onClick={() => router.push("/forgot-password")}
                    className="cursor-pointer w-full text-center text-[13px] text-white/35 hover:text-white/55 transition"
                >
                    Forgot password?
                </button>

                <SocialLoginButtons
                    onGoogle={handleGoogleLogin}
                    onApple={handleAppleLogin}
                    onFacebook={handleFacebookLogin}
                />

                <p className="mt-6 text-center text-[13px] text-white/45">
                    Don&apos;t have an account?{" "}
                    <button
                        type="button"
                        onClick={onGoRegister}
                        className="cursor-pointer text-[#24C3FF] hover:underline"
                    >
                        Register now!
                    </button>
                </p>
            </div>
        </form>
    );
}