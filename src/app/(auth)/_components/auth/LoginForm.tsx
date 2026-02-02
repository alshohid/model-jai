
"use client"

import { useAuth } from "@/shared/providers/auth/useAuth";
import { PrimaryButton } from "@/shared/UI/button/PrimaryButton";
import { SocialButton } from "@/shared/UI/button/SocialButton";
import { LockIcon, MailIcon } from "@/shared/UI/icon/icon";
import { AuthInput } from "@/shared/UI/reusable/auth/AuthInput";
import { safeRedirect } from "@/shared/UI/reusable/redirect/safeRedirect";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export function LoginForm({ onGoRegister }: { onGoRegister: () => void }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { login } = useAuth();
    const redirect = safeRedirect(searchParams.get("redirect"));

    const { register, handleSubmit } = useForm();

    const onSubmit = (data: any) => {
        console.log("login", data);

        login();

        router.replace(redirect);
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

                <div className="pt-2">
                    <PrimaryButton text="Log In" variant="pink" />
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