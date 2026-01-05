"use client";

import React from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";

type Mode = "login" | "register";

export default function AuthPage() {
    const [mode, setMode] = React.useState<Mode>("login");

    return (
        <div className="min-h-screen w-full bg-[#0B0D12] flex items-center justify-center px-4 py-6">
            <div
                className="
          w-full max-w-[1360px]
          rounded-[18px]
          overflow-hidden
          bg-[#0B0D12]
          shadow-[0_20px_60px_rgba(0,0,0,0.55)]
          border border-white/10
        "
            >
                <div className="grid grid-cols-1 lg:grid-cols-[813.33px_1fr]">
                    <LeftHeroPanel />

                    <div className="relative flex items-center justify-center px-6 py-10 lg:px-12">
                        <div className="w-full max-w-[430px]">
                            <h1 className="text-center text-[40px] font-semibold leading-[1.05] tracking-tight">
                                <span className="bg-gradient-to-r from-[#24C3FF] to-[#6A2CFF] bg-clip-text text-transparent">
                                    Model
                                </span>{" "}
                                <span className="text-[#6A2CFF]">Bet</span>{" "}
                                <span className="text-white">Offers</span>
                            </h1>

                            {mode === "login" ? (
                                <LoginForm onGoRegister={() => setMode("register")} />
                            ) : (
                                <RegisterForm onGoLogin={() => setMode("login")} />
                            )}
                        </div>

                        {/* subtle right-side vignette like screenshot */}
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06),transparent_60%)]" />
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ---------------- Left Panel (Reusable) ---------------- */

function LeftHeroPanel() {
    return (
        <div
            className="
        relative
        w-full
        h-[639.42px]
        lg:h-[639.42px]
        bg-black
      "
        >
            <Image
                src="/images/home/authimg.png"
                alt="Hero"
                fill
                priority
                className="object-cover"
            />

            {/* dark overlay + right fade */}
            <div className="absolute inset-0 bg-black/25" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0B0D12]" />
        </div>
    );
}

/* ---------------- Shared UI Components ---------------- */

type AuthInputProps = {
    label: string;
    type?: string;
    icon?: React.ReactNode;
    register: ReturnType<typeof useForm>["register"];
    name: string;
};

function AuthInput({ label, type = "text", icon, register, name }: AuthInputProps) {
    return (
        <div className="relative">
            <div
                className="
          flex items-center gap-3
          w-full
          rounded-[8px]
          border border-white/10
          bg-white/10
          px-4 py-3
          backdrop-blur-[6px]
        "
            >
                <div className="opacity-70">{icon}</div>
                <input
                    type={type}
                    placeholder={label}
                    className="
            w-full bg-transparent outline-none
            text-white/90 placeholder:text-white/35
            text-[14px]
          "
                    {...register(name, { required: true })}
                />
            </div>
        </div>
    );
}

function PrimaryButton({ text, variant = "pink" }: { text: string; variant?: "pink" | "blue" }) {
    const isPink = variant === "pink";
    return (
        <button
            type="submit"
            className={[
                "w-full cursor-pointer rounded-[10px] px-4 py-3",
                "text-[16px] font-semibold tracking-wide",
                "shadow-[0_10px_22px_rgba(0,0,0,0.35)]",
                "transition-transform duration-150 active:scale-[0.99]",
                isPink
                    ? "bg-[#FF00C8] text-white"
                    : "bg-[#11B5FF] text-[#0B0D12]",
            ].join(" ")}
        >
            {text}
        </button>
    );
}

function SocialButton({ kind }: { kind: "google" | "facebook" }) {
    const isGoogle = kind === "google";
    return (
        <button
            type="button"
            className="
        cursor-pointer
        h-[44px] w-[54px]
        rounded-[10px]
        border border-white/10
        bg-white/10
        flex items-center justify-center
        backdrop-blur-[6px]
        hover:bg-white/15
        transition
      "
            aria-label={isGoogle ? "Continue with Google" : "Continue with Facebook"}
        >
            {isGoogle ? <GoogleIcon /> : <FacebookIcon />}
        </button>
    );
}

/* ---------------- Forms (Separate Components) ---------------- */

function LoginForm({ onGoRegister }: { onGoRegister: () => void }) {
    const { register, handleSubmit } = useForm();

    const onSubmit = (data: any) => {
        console.log("login", data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="relative mt-10">
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

function RegisterForm({ onGoLogin }: { onGoLogin: () => void }) {
    const { register, handleSubmit } = useForm();

    const onSubmit = (data: any) => {
        console.log("register", data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="relative mt-10">
            <div className="text-center">
                <h2 className="text-[22px] font-semibold text-white">
                    Welcome <span className="inline-block">👋</span>
                </h2>
                <p className="mt-2 text-[13px] text-white/55">
                    Please enter your name, email and password
                </p>
            </div>

            <div className="mt-8 space-y-4">
                <AuthInput
                    label="Full Name"
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
                    <PrimaryButton text="Log In" variant="blue" />
                </div>

                <div className="mt-6 flex items-center justify-center gap-3">
                    <SocialButton kind="google" />
                    <SocialButton kind="facebook" />
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

/* ---------------- Icons (Inline SVG) ---------------- */

function MailIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" className="text-white/70" fill="none">
            <path
                d="M4 6h16v12H4V6Z"
                stroke="currentColor"
                strokeWidth="1.6"
                opacity="0.9"
            />
            <path
                d="M4 7l8 6 8-6"
                stroke="currentColor"
                strokeWidth="1.6"
                opacity="0.9"
            />
        </svg>
    );
}

function LockIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" className="text-white/70" fill="none">
            <path
                d="M7 11V8a5 5 0 0 1 10 0v3"
                stroke="currentColor"
                strokeWidth="1.6"
            />
            <path
                d="M6 11h12v10H6V11Z"
                stroke="currentColor"
                strokeWidth="1.6"
            />
        </svg>
    );
}

function UserIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" className="text-white/70" fill="none">
            <path
                d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
                stroke="currentColor"
                strokeWidth="1.6"
            />
            <path
                d="M4 20a8 8 0 0 1 16 0"
                stroke="currentColor"
                strokeWidth="1.6"
            />
        </svg>
    );
}

function GoogleIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.9 32.7 29.4 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.1-.1-2.2-.4-3.5z" />
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.6 8.3 6.3 14.7z" />
            <path fill="#4CAF50" d="M24 44c5.3 0 10.2-2 13.9-5.2l-6.4-5.2C29.7 35.7 27 36 24 36c-5.4 0-9.9-3.3-11.5-8l-6.6 5.1C9.2 39.7 16 44 24 44z" />
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1 2.8-3 5.1-5.8 6.6l6.4 5.2C39.6 36.4 44 31 44 24c0-1.1-.1-2.2-.4-3.5z" />
        </svg>
    );
}

function FacebookIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 48 48">
            <path
                fill="#1877F2"
                d="M24 4C12.95 4 4 12.95 4 24c0 9.99 7.32 18.27 16.88 19.76V29.66h-5.1V24h5.1v-4.3c0-5.04 3-7.83 7.6-7.83 2.2 0 4.5.4 4.5.4v5h-2.53c-2.5 0-3.28 1.55-3.28 3.14V24h5.58l-.9 5.66h-4.68v14.1C36.68 42.27 44 33.99 44 24 44 12.95 35.05 4 24 4z"
            />
        </svg>
    );
}
