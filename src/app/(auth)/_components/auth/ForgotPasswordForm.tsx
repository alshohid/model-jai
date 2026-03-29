"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import { useForgotPasswordMutation } from "@/redux/features/auth/authapi";
import { AuthInput } from "@/shared/UI/reusable/auth/AuthInput";
import { MailIcon } from "@/shared/UI/icon/icon";
import { PrimaryButton } from "@/shared/UI/button/PrimaryButton";
import { writeForgotPasswordSession } from "@/shared/lib/auth/forgotPasswordFlow";
import { IForgotPasswordParams } from "@/types/user/auth";
import AuthRecoveryShell from "./AuthRecoveryShell";

export default function ForgotPasswordForm() {
    const router = useRouter();
    const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
    const { register, handleSubmit } = useForm<IForgotPasswordParams>();

    const onSubmit = async (data: IForgotPasswordParams) => {
        try {
            const response = await forgotPassword(data).unwrap();

            writeForgotPasswordSession({
                email: response.data.email,
                token: response.data.token,
            });

            toast.success(response.message || "OTP sent successfully");
            router.push("/forgot-password/verify");
        } catch (error) {
            toast.error(getErrorMessage(error, "Failed to send OTP"));
        }
    };

    return (
        <AuthRecoveryShell
            step={1}
            eyebrow="Password Recovery"
            title="Forgot Password"
            description="Enter your email to get OTP."
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5 sm:space-y-4">
                <div className="space-y-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45 sm:text-[12px] sm:tracking-[0.28em]">
                        Account Email
                    </p>
                    <AuthInput
                        label="Enter your registered email"
                        name="email"
                        type="email"
                        register={register as any}
                        icon={<MailIcon />}
                    />
                </div>

                <PrimaryButton
                    isLoading={isLoading}
                    loadingText="Sending OTP..."
                    text="Send OTP"
                    variant="pink"
                    className="py-2.5 text-[13px] sm:py-3 sm:text-[15px]"
                />

                <button
                    type="button"
                    onClick={() => router.push("/login")}
                    className="inline-flex w-fit items-center gap-2 text-[12px] text-white/55 transition hover:text-white sm:text-sm"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to login
                </button>
            </form>
        </AuthRecoveryShell>
    );
}
