"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import { useResetPasswordMutation } from "@/redux/features/auth/authapi";
import { PrimaryButton } from "@/shared/UI/button/PrimaryButton";
import { LockIcon } from "@/shared/UI/icon/icon";
import { AuthInput } from "@/shared/UI/reusable/auth/AuthInput";
import AuthRecoveryShell from "./AuthRecoveryShell";
import {
    clearForgotPasswordSession,
    readForgotPasswordSession,
} from "@/shared/lib/auth/forgotPasswordFlow";
import { IResetPasswordParams } from "@/types/user/auth";

type ResetPasswordFields = Pick<
    IResetPasswordParams,
    "new_password" | "confirm_new_password"
>;

export default function ResetPasswordForm() {
    const router = useRouter();
    const [resetPassword, { isLoading }] = useResetPasswordMutation();
    const { register, handleSubmit } = useForm<ResetPasswordFields>();
    const session = useMemo(() => readForgotPasswordSession(), []);

    useEffect(() => {
        if (!session?.email || !session?.token || !session?.otp) {
            router.replace("/forgot-password");
        }
    }, [router, session]);

    const onSubmit = async (data: ResetPasswordFields) => {
        if (!session?.email || !session?.token || !session?.otp) {
            toast.error("Recovery session missing. Start again.");
            router.push("/forgot-password");
            return;
        }

        if (data.new_password !== data.confirm_new_password) {
            toast.error("Passwords do not match");
            return;
        }

        const payload: IResetPasswordParams = {
            email: session.email,
            token: session.token,
            otp: session.otp,
            new_password: data.new_password,
            confirm_new_password: data.confirm_new_password,
        };

        try {
            const response = await resetPassword(payload).unwrap();
            clearForgotPasswordSession();
            toast.success(response.message || "Password reset successfully");
            router.push("/login");
        } catch (error) {
            toast.error(getErrorMessage(error, "Password reset failed"));
        }
    };

    return (
        <AuthRecoveryShell
            step={3}
            eyebrow="Set New Password"
            title="Reset Password"
            description="Enter and confirm your new password."
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5 sm:space-y-4">
                <div className="space-y-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45 sm:text-[12px] sm:tracking-[0.28em]">
                        New Password
                    </p>
                    <AuthInput
                        label="Enter your new password"
                        name="new_password"
                        type="password"
                        register={register as any}
                        icon={<LockIcon />}
                    />
                </div>

                <div className="space-y-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45 sm:text-[12px] sm:tracking-[0.28em]">
                        Confirm Password
                    </p>
                    <AuthInput
                        label="Confirm your new password"
                        name="confirm_new_password"
                        type="password"
                        register={register as any}
                        icon={<LockIcon />}
                    />
                </div>

                <PrimaryButton
                    isLoading={isLoading}
                    loadingText="Resetting Password..."
                    text="Save New Password"
                    variant="pink"
                    className="py-2.5 text-[13px] sm:py-3 sm:text-[15px]"
                />

                <button
                    type="button"
                    onClick={() => router.push("/forgot-password/verify")}
                    className="inline-flex w-fit items-center gap-2 text-[12px] text-white/55 transition hover:text-white sm:text-sm"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to OTP verification
                </button>
            </form>
        </AuthRecoveryShell>
    );
}
