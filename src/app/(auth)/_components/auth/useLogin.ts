"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { handleAfterLogin } from "@/lib/helper/loginHelper";
import { getErrorMessage } from "@/lib/utils";
import { useAuth } from "@/redux/features/auth/hooks";
import {
    handleAuthSuccess,
    resolveLoginFlowResult,
} from "@/redux/features/auth/authHelpers";
import { useAppDispatch } from "@/redux/store";
import {
    clearLoginOtpSession,
    writeLoginOtpSession,
} from "@/shared/lib/auth/loginOtpFlow";
import { ILoginParams } from "@/types/user/auth";

import { clearStoredAuthRedirect } from "./authRedirects";
import { useSocialLogin } from "./useSocialLogin";

export function useLogin(redirect: string) {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { logIn, isLoading } = useAuth();

    const [errorLogin, setErrorLogin] = useState("");

    const {
        handleGoogleLogin,
        handleAppleLogin,
        handleFacebookLogin,
    } = useSocialLogin(() => redirect);

    const onSubmit = async (data: ILoginParams) => {
        try {
            setErrorLogin("");

            const loginResult = await logIn({
                email: data.email,
                password: data.password,
            }).unwrap();

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

    return {
        onSubmit,
        handleGoogleLogin,
        handleAppleLogin,
        handleFacebookLogin,
        errorLogin,
        isLoading,
    };
}