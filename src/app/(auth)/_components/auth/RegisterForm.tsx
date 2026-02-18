/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFacebookLoginMutation, useGoogleLoginMutation, useRegisterUserMutation } from "@/redux/features/auth/authapi";
import { PrimaryButton } from "@/shared/UI/button/PrimaryButton";
import { SocialButton } from "@/shared/UI/button/SocialButton";
import { LockIcon, MailIcon, UserIcon } from "@/shared/UI/icon/icon";
import { AuthInput } from "@/shared/UI/reusable/auth/AuthInput";
import { executeSocialLogin } from "@/shared/lib/auth/socialLogin";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function RegisterForm({ onGoLogin }: { onGoLogin: () => void }) {
    const [registerUser, { isLoading }] = useRegisterUserMutation()
    const { register, handleSubmit } = useForm();
    const [googleLogin] = useGoogleLoginMutation();
    const [facebookLogin] = useFacebookLoginMutation();

    const handleGoogleLogin = async () => {
        await executeSocialLogin(() => googleLogin().unwrap());
    };

    const handleFacebookLogin = async () => {
        await executeSocialLogin(() => facebookLogin().unwrap());
    };

    const onSubmit = async (data: any) => {
        const result = await registerUser(data)

        if ('data' in result) {
            toast.success(result.data?.message ?? "User registered successfully")
        } else if ('error' in result) {

            const error = result.error as any
            toast.error(error?.data?.message ?? "Something went wrong")
        }
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
                    name="name"
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
                    name="c_password"
                    type="password"
                    register={register as any}
                    icon={<LockIcon />}
                />

                <div className="pt-2">
                    <PrimaryButton isLoading={isLoading} loadingText="Registering..." text="Register" variant="pink" />
                </div>

                <div className="mt-6 flex items-center justify-center gap-3">
                    <SocialButton kind="google" handleSocialLogin={handleGoogleLogin} />
                    <SocialButton kind="apple" handleSocialLogin={() => {
                        console.log("apple");
                    }} />
                    <SocialButton kind="facebook" handleSocialLogin={handleFacebookLogin} />
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