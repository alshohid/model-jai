"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { AuthInput } from "@/shared/UI/reusable/auth/AuthInput";
import StartStreamingButton from "@/shared/UI/button/StartStreamingButton";
import { MailIcon } from "@/shared/UI/icon/icon";
import { useAuth } from "@/shared/providers/auth/useAuth";

type AdminLoginValues = {
    email: string;
    password: string;
};

export default function AdminLoginForm() {
    const router = useRouter();
    const sp = useSearchParams();
    const { adminLogin } = useAuth(); 

    const redirect = sp.get("redirect") || "/admin/dashboard";

    const { register, handleSubmit } = useForm<AdminLoginValues>({
        defaultValues: { email: "", password: "" },
    });

    const onSubmit = (data: AdminLoginValues) => {
        console.log("admin login", data);

        // ✅ TODO: call backend admin login API here
        // await api.adminLogin(data)

        // ⚠️ MUST: set admin role in auth state, not normal user
        adminLogin();

        router.replace(redirect);
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

            <StartStreamingButton className="w-full bg-[#FF2EC8] hover:opacity-95 mt-2">
                Login
            </StartStreamingButton>
        </form>
    );
}
