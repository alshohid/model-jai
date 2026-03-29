"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import {
    useForgotPasswordMutation,
    useVerifyForgotPasswordMutation,
} from "@/redux/features/auth/authapi";
import {
    mergeForgotPasswordSession,
    readForgotPasswordSession,
    writeForgotPasswordSession,
} from "@/shared/lib/auth/forgotPasswordFlow";
import AuthRecoveryShell from "./AuthRecoveryShell";

const OTP_LENGTH = 6;

function maskEmail(email: string) {
    const [name, domain] = email.split("@");
    if (!name || !domain) return email;

    const visibleStart = name.slice(0, 2);
    const visibleEnd = name.slice(-1);
    return `${visibleStart}${"*".repeat(Math.max(name.length - 3, 1))}${visibleEnd}@${domain}`;
}

export default function ForgotPasswordOtpForm() {
    const router = useRouter();
    const [verifyForgotPassword, { isLoading: isVerifying }] = useVerifyForgotPasswordMutation();
    const [resendOtp, { isLoading: isResending }] = useForgotPasswordMutation();
    const session = useMemo(() => readForgotPasswordSession(), []);
    const email = session?.email ?? "";
    const token = session?.token ?? "";
    const [otpDigits, setOtpDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    useEffect(() => {
        if (!email || !token) {
            router.replace("/forgot-password");
        }
    }, [email, token, router]);

    const updateDigit = (index: number, value: string) => {
        const digit = value.replace(/\D/g, "").slice(-1);
        const nextDigits = [...otpDigits];
        nextDigits[index] = digit;
        setOtpDigits(nextDigits);

        if (digit && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Backspace" && !otpDigits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
        event.preventDefault();
        const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
        if (!pasted) return;

        const nextDigits = Array(OTP_LENGTH)
            .fill("")
            .map((_, index) => pasted[index] ?? "");
        setOtpDigits(nextDigits);

        const focusIndex = Math.min(pasted.length, OTP_LENGTH) - 1;
        inputRefs.current[Math.max(focusIndex, 0)]?.focus();
    };

    const otp = otpDigits.join("");

    const handleSubmit = async () => {
        if (otp.length !== OTP_LENGTH) {
            toast.error("Enter the 6 digit OTP");
            return;
        }

        try {
            const response = await verifyForgotPassword({ email, otp }).unwrap();
            mergeForgotPasswordSession({ otp });
            toast.success(response.message || "OTP verified successfully");
            router.push("/forgot-password/reset");
        } catch (error) {
            toast.error(getErrorMessage(error, "OTP verification failed"));
        }
    };

    const handleResend = async () => {
        try {
            const response = await resendOtp({ email }).unwrap();
            writeForgotPasswordSession({
                email: response.data.email,
                token: response.data.token,
            });
            setOtpDigits(Array(OTP_LENGTH).fill(""));
            inputRefs.current[0]?.focus();
            toast.success(response.message || "OTP sent successfully");
        } catch (error) {
            toast.error(getErrorMessage(error, "Failed to resend OTP"));
        }
    };

    return (
        <AuthRecoveryShell
            step={2}
            eyebrow="OTP Verification"
            title="Verify OTP"
            description={email ? `Code sent to ${maskEmail(email)}` : "Enter your 6 digit code"}
        >
            <div className="space-y-4 sm:space-y-5">
                <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45 sm:text-[12px] sm:tracking-[0.28em]">
                        Verification Code
                    </p>
                    <div className="mt-2.5 grid grid-cols-3 gap-2 sm:mt-3 sm:grid-cols-6 sm:gap-3">
                        {otpDigits.map((digit, index) => (
                            <input
                                key={index}
                                ref={(element) => {
                                    inputRefs.current[index] = element;
                                }}
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                maxLength={1}
                                value={digit}
                                onChange={(event) => updateDigit(index, event.target.value)}
                                onKeyDown={(event) => handleKeyDown(index, event)}
                                onPaste={handlePaste}
                                className="h-11 w-full min-w-0 rounded-[12px] border border-white/10 bg-white/8 text-center text-base font-semibold text-white outline-none transition focus:border-[#FF2EC8]/60 focus:bg-[#FF2EC8]/8 sm:h-14 sm:rounded-[16px] sm:text-xl"
                            />
                        ))}
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isVerifying}
                    className="w-full rounded-[12px] bg-[#FF00C8] px-4 py-2.5 text-[13px] font-semibold tracking-wide text-white shadow-[0_10px_22px_rgba(0,0,0,0.35)] transition-transform duration-150 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 sm:py-3 sm:text-[16px]"
                >
                    {isVerifying ? "Verifying..." : "Verify OTP"}
                </button>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button
                        type="button"
                        onClick={() => router.push("/forgot-password")}
                        className="inline-flex w-fit items-center gap-2 text-[12px] text-white/55 transition hover:text-white sm:text-sm"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Change email
                    </button>

                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={isResending}
                        className="inline-flex w-fit items-center gap-2 text-[12px] text-[#24C3FF] transition hover:text-[#67d6ff] disabled:cursor-not-allowed disabled:opacity-70 sm:text-sm"
                    >
                        <RefreshCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        {isResending ? "Resending..." : "Resend code"}
                    </button>
                </div>
            </div>
        </AuthRecoveryShell>
    );
}
