"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import { handleAfterLogin } from "@/lib/helper/loginHelper";
import { useVerifyLoginOtpMutation } from "@/redux/features/auth/authapi";
import {
    clearLoginOtpSession,
    readLoginOtpSession,
} from "@/shared/lib/auth/loginOtpFlow";
import { maskEmail } from "@/shared/lib/auth/maskEmail";
import OtpCodeFieldGroup from "./OtpCodeFieldGroup";
import { useOtpInput } from "./useOtpInput";
import AuthPageShell from "./AuthPageShell";
import { PrimaryButton } from "@/shared/UI/button/PrimaryButton";

const OTP_LENGTH = 6;

export default function LoginOtpForm() {
    const router = useRouter();
    const [verifyLoginOtp, { isLoading: isVerifying }] =
        useVerifyLoginOtpMutation();
    const session = useMemo(() => readLoginOtpSession(), []);
    const email = session?.email ?? "";
    const redirect = session?.redirect;
    const loginPath = session?.loginPath || "/login";
    const {
        otpDigits,
        otp,
        inputRefs,
        updateDigit,
        handleKeyDown,
        handlePaste,
    } = useOtpInput(OTP_LENGTH);

    useEffect(() => {
        if (!email) {
            router.replace(loginPath);
        }
    }, [email, loginPath, router]);

    const handleSubmit = async () => {
        if (otp.length !== OTP_LENGTH) {
            toast.error("Enter the 6 digit OTP");
            return;
        }

        try {
            const response = await verifyLoginOtp({ email, otp }).unwrap();
            clearLoginOtpSession();
            toast.success(response.message || "OTP verified successfully");
            handleAfterLogin(response?.data?.user?.role, redirect, router);
        } catch (error) {
            toast.error(getErrorMessage(error, "OTP verification failed"));
        }
    };

    const handleChangeEmail = () => {
        clearLoginOtpSession();
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
                        onDigitChange={updateDigit}
                        onKeyDown={handleKeyDown}
                        onPaste={handlePaste}
                    />
                </div>

                <PrimaryButton
                    isLoading={isVerifying}
                    loadingText="Verifying..."
                    text="Verify & Continue"
                    variant="pink"
                />

                <div className="flex flex-col gap-3 pt-1">
                    <button
                        type="button"
                        onClick={handleChangeEmail}
                        className="inline-flex w-fit items-center gap-2 text-[12px] text-white/55 transition hover:text-white sm:text-sm"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Change email
                    </button>

                    <p className="text-[13px] text-white/45">
                        Need a new code? Go back and log in again.
                    </p>
                </div>
            </form>
        </AuthPageShell>
    );
}
