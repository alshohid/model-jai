/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

import { getErrorMessage } from "@/lib/utils"
import { useAuth } from "@/redux/features/auth/hooks";
import { PrimaryButton } from "@/shared/UI/button/PrimaryButton";
import { SocialButton } from "@/shared/UI/button/SocialButton";
import { LockIcon, MailIcon } from "@/shared/UI/icon/icon";
import { AuthInput } from "@/shared/UI/reusable/auth/AuthInput";
import { safeRedirect } from "@/shared/UI/reusable/redirect/safeRedirect";
import { ILoginParams } from "@/types/user/auth";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAppleLoginMutation, useFacebookLoginMutation, useGoogleLoginMutation } from "@/redux/features/auth/authapi";
import { executeSocialLogin } from "@/shared/lib/auth/socialLogin";
import { handleAfterLogin } from "@/lib/helper/loginHelper";
import { handleAuthSuccess, resolveLoginFlowResult } from "@/redux/features/auth/authHelpers";
import { useAppDispatch } from "@/redux/store";
import { clearLoginOtpSession, writeLoginOtpSession } from "@/shared/lib/auth/loginOtpFlow";
import { toast } from "sonner";

const PENDING_AUTH_REDIRECT_KEY = "pending_auth_redirect";

const getStoredAuthRedirect = () => {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem(PENDING_AUTH_REDIRECT_KEY);
};

const clearStoredAuthRedirect = () => {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem(PENDING_AUTH_REDIRECT_KEY);
};

export function LoginForm({ onGoRegister }: { onGoRegister: () => void }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const dispatch = useAppDispatch();

    const { logIn, isLoading: isLoginLoading } = useAuth();
    const redirect = safeRedirect(searchParams.get("redirect") || getStoredAuthRedirect());
    const [errorLogin, setErrorLogin] = useState("")
    const { register, handleSubmit } = useForm<ILoginParams>();
    const [googleLogin] = useGoogleLoginMutation();
    const [facebookLogin] = useFacebookLoginMutation();
    const [appleLogin] = useAppleLoginMutation();

    const rememberRedirectForSocialLogin = () => {
        if (typeof window === "undefined" || redirect === "/") return;
        sessionStorage.setItem(PENDING_AUTH_REDIRECT_KEY, redirect);
    };

    const handleGoogleLogin = async () => {
        rememberRedirectForSocialLogin();
        await executeSocialLogin(() => googleLogin().unwrap());
    };

    const handleAppleLogin = async () => {
        rememberRedirectForSocialLogin();
        await executeSocialLogin(() => appleLogin().unwrap());
    };

    const handleFacebookLogin = async () => {
        rememberRedirectForSocialLogin();
        await executeSocialLogin(() => facebookLogin().unwrap());
    };


    const onSubmit = async (data: ILoginParams) => {
        try {
            setErrorLogin("");
            const loginResult = await logIn({
                email: data.email,
                password: data.password,
            }).unwrap()

            if (loginResult.success) {
                const flowResult = resolveLoginFlowResult(loginResult);

                if (flowResult.kind === "authenticated") {
                    const authSaved = handleAuthSuccess(loginResult, dispatch);

                    if (!authSaved || !flowResult.role) {
                        throw new Error(
                            "Login succeeded, but login token was missing. Please try again.",
                        );
                    }

                    clearLoginOtpSession();
                    clearStoredAuthRedirect();
                    handleAfterLogin(flowResult.role, redirect, router);
                    return;
                }

                if (flowResult.kind === "otp") {
                    writeLoginOtpSession({
                        email: flowResult.email,
                        password: data.password,
                        redirect,
                        loginPath: "/login",
                    });
                    clearStoredAuthRedirect();
                    toast.success(loginResult.message || "OTP sent successfully");
                    router.push("/login/verify");
                    return;
                }
            }

            setErrorLogin("Unexpected login response. Please try again.");

        } catch (error: unknown) {
            setErrorLogin(getErrorMessage(error, "Login failed. Please try again."));
        }

    };


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
                <span className="text-red-600">
                    {errorLogin ? errorLogin : ""}
                </span>
                <div className="pt-2">
                    <PrimaryButton isLoading={isLoginLoading} loadingText="Logging in..." text="Log In" variant="pink" />
                </div>

                <button
                    type="button"
                    onClick={() => router.push("/forgot-password")}
                    className="cursor-pointer w-full text-center text-[13px] text-white/35 hover:text-white/55 transition"
                >
                    Forgot password?
                </button>

                <div className="mt-6 flex items-center justify-center gap-3">
                    <SocialButton kind="google" handleSocialLogin={handleGoogleLogin} />
                    <SocialButton kind="apple" handleSocialLogin={handleAppleLogin} />
                    <SocialButton kind="facebook" handleSocialLogin={handleFacebookLogin} />
                </div>

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
