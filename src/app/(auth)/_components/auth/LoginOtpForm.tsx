"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import { handleAfterLogin } from "@/lib/helper/loginHelper";
import { useAuth } from "@/redux/features/auth/hooks";
import { useAppDispatch } from "@/redux/store";
import {
    extractLoginAuthData,
    handleAuthSuccess,
    resolveLoginFlowResult,
} from "@/redux/features/auth/authHelpers";
import { useVerifyLoginOtpMutation } from "@/redux/features/auth/authapi";
import {
    clearLoginOtpSession,
    readLoginOtpSession,
    writeLoginOtpSession,
} from "@/shared/lib/auth/loginOtpFlow";
import { maskEmail } from "@/shared/lib/auth/maskEmail";
import OtpCodeFieldGroup from "./OtpCodeFieldGroup";
import { useOtpInput } from "./useOtpInput";
import AuthPageShell from "./AuthPageShell";
import { PrimaryButton } from "@/shared/UI/button/PrimaryButton";
import { safeRedirect } from "@/shared/UI/reusable/redirect/safeRedirect";

const OTP_LENGTH = 6;

export default function LoginOtpForm() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { logIn, isLoading: isResending } = useAuth();
    const [verifyLoginOtp, { isLoading: isVerifying }] =
        useVerifyLoginOtpMutation();
    const [session, setSession] = useState(() => readLoginOtpSession());
    const [errorMessage, setErrorMessage] = useState("");
    const isCompletingLogin = useRef(false);
    const email = session?.email ?? "";
    const password = session?.password ?? "";
    const redirect = safeRedirect(session?.redirect ?? null);
    const loginPath = session?.loginPath || "/login";
    const {
        otpDigits,
        otp,
        inputRefs,
        updateDigit,
        handleKeyDown,
        handlePaste,
        reset,
    } = useOtpInput(OTP_LENGTH);

    useEffect(() => {
        if (!email && !isCompletingLogin.current) {
            router.replace(loginPath);
        }
    }, [email, loginPath, router]);

    const handleSubmit = async () => {
        if (otp.length !== OTP_LENGTH) {
            setErrorMessage("Enter the 6 digit OTP");
            toast.error("Enter the 6 digit OTP");
            return;
        }

        try {
            setErrorMessage("");
            const response = await verifyLoginOtp({ email, otp }).unwrap();
            const authSaved = handleAuthSuccess(response, dispatch);
            const { role } = extractLoginAuthData(response);

            if (!authSaved || !role) {
                throw new Error(
                    "OTP verified, but login token was missing. Please try again.",
                );
            }

            isCompletingLogin.current = true;
            clearLoginOtpSession();
            setSession(null);
            toast.success(response.message || "OTP verified successfully");
            handleAfterLogin(role, redirect, router);
        } catch (error) {
            const message = getErrorMessage(error, "OTP verification failed");
            setErrorMessage(message);
            toast.error(message);
        }
    };

    const handleResend = async () => {
        if (!email || !password) {
            clearLoginOtpSession();
            setSession(null);
            toast.error("Please log in again to request a new code");
            router.replace(loginPath);
            return;
        }

        try {
            setErrorMessage("");
            const response = await logIn({ email, password }).unwrap();
            const flowResult = resolveLoginFlowResult(response);

            if (flowResult.kind === "authenticated") {
                const authSaved = handleAuthSuccess(response, dispatch);

                if (!authSaved || !flowResult.role) {
                    throw new Error(
                        "Login succeeded, but login token was missing. Please try again.",
                    );
                }

                isCompletingLogin.current = true;
                clearLoginOtpSession();
                setSession(null);
                toast.success(response.message || "Logged in successfully");
                handleAfterLogin(flowResult.role, redirect, router);
                return;
            }

            if (flowResult.kind === "otp") {
                const nextSession = {
                    email: flowResult.email,
                    password,
                    redirect,
                    loginPath,
                };

                writeLoginOtpSession(nextSession);
                setSession(nextSession);
                reset();
                inputRefs.current[0]?.focus();
                toast.success(response.message || "A new OTP has been sent");
                return;
            }

            throw new Error("Unexpected login response. Please try again.");
        } catch (error) {
            toast.error(getErrorMessage(error, "Failed to send a new code"));
        }
    };

    const handleChangeEmail = () => {
        isCompletingLogin.current = false;
        clearLoginOtpSession();
        setSession(null);
        router.push(loginPath);
    };

    return (
        <AuthPageShell>
            <div className="text-center">
                <h2 className="text-[22px] font-semibold text-white">Verify OTP</h2>
                <p className="mt-2 text-[13px] leading-6 text-white/55">
                    {email
                        ? `Enter the 6 digit code sent to ${maskEmail(email)}`
                        : "Enter the 6 digit code sent to your email"}
                </p>
            </div>

            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    void handleSubmit();
                }}
                className="mt-8 space-y-4"
            >
                <div className="rounded-[18px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45 sm:text-[12px] sm:tracking-[0.28em]">
                        Verification Code
                    </p>
                    <OtpCodeFieldGroup
                        digits={otpDigits}
                        inputRefs={inputRefs}
                        onDigitChange={(index, value) => {
                            if (errorMessage) {
                                setErrorMessage("");
                            }
                            updateDigit(index, value);
                        }}
                        onKeyDown={handleKeyDown}
                        onPaste={(event) => {
                            if (errorMessage) {
                                setErrorMessage("");
                            }
                            handlePaste(event);
                        }}
                    />
                </div>

                <PrimaryButton
                    isLoading={isVerifying}
                    loadingText="Verifying..."
                    text="Verify & Continue"
                    variant="pink"
                />

                {errorMessage ? (
                    <p className="flex items-start gap-2 text-[13px] leading-5 text-[#ff6c6c]">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>{errorMessage}</span>
                    </p>
                ) : null}

                <div className="flex flex-col gap-3 pt-1">
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={isResending || isVerifying}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-[14px] border border-[#a84ae6]/70 bg-[linear-gradient(180deg,rgba(168,74,230,0.08),rgba(168,74,230,0.03))] px-4 py-3 text-[14px] font-semibold text-[#d978ff] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition hover:border-[#cf6eff] hover:text-[#f09cff] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        <RefreshCcw className="h-4 w-4" />
                        {isResending ? "Sending..." : "Send a new code"}
                    </button>

                    <button
                        type="button"
                        onClick={handleChangeEmail}
                        className="inline-flex w-fit items-center gap-2 text-[12px] text-white/55 transition hover:text-white sm:text-sm"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Change email
                    </button>

                    <p className="text-[13px] text-white/45">
                        Didn&apos;t receive the code? Request a fresh one or use a different email.
                    </p>
                </div>
            </form>
        </AuthPageShell>
    );
}
