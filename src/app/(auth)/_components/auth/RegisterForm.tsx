import { PrimaryButton } from "@/shared/UI/button/PrimaryButton";
import { SocialButton } from "@/shared/UI/button/SocialButton";
import { LockIcon, MailIcon, UserIcon } from "@/shared/UI/icon/icon";
import { AuthInput } from "@/shared/UI/reusable/auth/AuthInput";
import Image from "next/image";
import { useForm } from "react-hook-form";

export function RegisterForm({ onGoLogin }: { onGoLogin: () => void }) {
    const { register, handleSubmit } = useForm();

    const onSubmit = (data: any) => {
        console.log("register", data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="relative ">
            <div className="text-center">
                <h2 className="text-[22px] font-semibold text-white">
                    Welcome
                </h2>
                <p className="mt-2 text-[13px] text-white/55">
                    Please enter your name or artist name , email and password
                </p>
            </div>

            <div className="mt-8 space-y-4">
                <AuthInput
                    label="Full name or artist name"
                    name="fullName"
                    register={register as any}
                    icon={<UserIcon />}
                />
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
                <AuthInput
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    register={register as any}
                    icon={<LockIcon />}
                />

                <div className="pt-2">
                    <PrimaryButton text="Register" variant="pink" />
                </div>

                <div className="mt-6 flex items-center justify-center gap-3">
                    <SocialButton kind="google" />
                    <SocialButton kind="facebook" />
                    <Image
                        src={'/images/home/email.png'}
                        alt="email"
                        width={600}
                        height={600}
                        className="w-12 h-12"
                    
                    />   
                </div>

                <p className="mt-6 text-center text-[13px] text-white/45">
                    Already have an account?{" "}
                    <button
                        type="button"
                        onClick={onGoLogin}
                        className="cursor-pointer text-[#24C3FF] hover:underline"
                    >
                        Log In Now!
                    </button>
                </p>
            </div>
        </form>
    );
}