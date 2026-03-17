/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { AuthInput } from "@/shared/UI/reusable/auth/AuthInput";
import { MailIcon } from "@/shared/UI/icon/icon";
import { useAuth } from "@/redux/features/auth/hooks";
import { useState } from "react";
import { getErrorMessage } from "@/lib/utils";
import { PrimaryButton } from "@/shared/UI/button/PrimaryButton";
import { handleAfterLogin } from "@/lib/helper/loginHelper";
import { safeRedirect } from "@/shared/UI/reusable/redirect/safeRedirect";


type AdminLoginValues = {
    email: string;
    password: string;
};

export default function AdminLoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { logIn, isLoading: isLoginLoading, } = useAuth();
    const [errorLogin, setErrorLogin] = useState("")

    const { register, handleSubmit } = useForm<AdminLoginValues>({
        defaultValues: { email: "", password: "" },
    });
    const redirect = safeRedirect(searchParams.get("redirect"));


    const onSubmit = async (data: AdminLoginValues) => {
        try {
            const loginResult = await logIn({
                email: data.email,
                password: data.password,
            }).unwrap()

            if (loginResult.success) {
                const role = loginResult?.data?.user?.role;
                handleAfterLogin(role, redirect, router);
            }
        } catch (error) {
            setErrorLogin(getErrorMessage(error, "Login failed. Please try again."));
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-3">
            <div>
                <p className="mb-2 text-white/60 text-[12px]">Email</p>
                <AuthInput
                    label="Admin email"
                    name="email"
                    type="email"
                    register={register as any}
                    icon={<MailIcon />}
                />
            </div>

            <div>
                <p className="mb-2 text-white/60 text-[12px]">Password</p>
                <AuthInput
                    label="Password"
                    name="password"
                    type="password"
                    register={register as any}
                    icon={<span className="text-white/60">🔒</span>}
                />
            </div>

            <span className="text-red-600">
                {errorLogin ? errorLogin : ""}
            </span>

            <div className="pt-2">
                <PrimaryButton isLoading={isLoginLoading} loadingText="Logging in..." text="Log In" variant="pink" />
            </div>
        </form>
    );
}
