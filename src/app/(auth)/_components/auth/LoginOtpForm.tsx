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
import AuthRecoveryShell from "./AuthRecoveryShell";
import OtpCodeFieldGroup from "./OtpCodeFieldGroup";
import { useOtpInput } from "./useOtpInput";

const OTP_LENGTH = 6;

const loginSteps = [
    { id: 1, label: "Login", hint: "Submit credentials" },
    { id: 2, label: "OTP", hint: "Verify access code" },
];

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
        <AuthRecoveryShell
            step={2}
            steps={loginSteps}
            eyebrow="Login Verification"
            title="Verify OTP"
            description={
                email ? `Code sent to ${maskEmail(email)}` : "Enter your 6 digit code"
            }
            heroEyebrow="Secure Login"
            heroTitle="Confirm your sign in."
            heroDescription="Enter the one-time password sent to your email to complete your login securely."
        >
            <div className="space-y-4 sm:space-y-5">
                <div>
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

                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isVerifying}
                    className="w-full rounded-[12px] bg-[#FF00C8] px-4 py-2.5 text-[13px] font-semibold tracking-wide text-white shadow-[0_10px_22px_rgba(0,0,0,0.35)] transition-transform duration-150 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 sm:py-3 sm:text-[16px]"
                >
                    {isVerifying ? "Verifying..." : "Verify & Continue"}
                </button>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button
                        type="button"
                        onClick={handleChangeEmail}
                        className="inline-flex w-fit items-center gap-2 text-[12px] text-white/55 transition hover:text-white sm:text-sm"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Change email
                    </button>

                    <p className="text-[12px] text-white/45 sm:text-sm">
                        Need a new code? Go back and log in again.
                    </p>
                </div>
            </div>
        </AuthRecoveryShell>
    );
}
