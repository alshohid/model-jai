
"use client"

import { getErrorMessage } from "@/lib/utils";
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

export function LoginForm({ onGoRegister }: { onGoRegister: () => void }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { logIn, isLoading: isLoginLoading } = useAuth();
    const redirect = safeRedirect(searchParams.get("redirect"));
    const [erroLogin , setErrorLogin]= useState("")
    const { register, handleSubmit } = useForm<ILoginParams>();

    const onSubmit = async (data: ILoginParams) => {
        console.log("login", data);
        try {
            const loginResult = await logIn({
                email: data.email,
                password: data.password,

            }).unwrap()
            console.log("login result ===== ", loginResult);
            if (loginResult.success) {
                router.replace(redirect);
            }

        } catch (error: unknown) {
            console.log("error ",error)
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
                    {erroLogin ? erroLogin :""}
                </span>
                <div className="pt-2">
                    <PrimaryButton isloading={isLoginLoading} loadingText="Logging" text="Log In" variant="pink" />
                </div>

                <button
                    type="button"
                    className="cursor-pointer w-full text-center text-[13px] text-white/35 hover:text-white/55 transition"
                >
                    Forgot password?
                </button>

                <div className="mt-6 flex items-center justify-center gap-3">
                    <SocialButton kind="google" />
                    <SocialButton kind="apple" />
                    <SocialButton kind="facebook" />
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
