/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { LeftHeroPanel } from "@/shared/UI/reusable/auth/LeftHeroPanel";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import BrandMark from "@/app/(public)/_components/brandMark/BrandMark";

type Mode = "/login" | "/register" | any;

export default function AuthContainer() {
    const pathname = usePathname();
    const [mode, setMode] = React.useState<Mode>(pathname);

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-[#07090D] px-4 py-6 lg:px-6 lg:py-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,46,200,0.14),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(36,195,255,0.14),transparent_28%),linear-gradient(180deg,#07090D_0%,#0B0D12_100%)]" />
            <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.16)_1px,transparent_1px)] [background-size:72px_72px]" />

            <div className="relative flex min-h-[calc(100vh-3rem)] items-center justify-center">
            <div
                className="
                w-full max-w-[1480px] overflow-hidden rounded-[30px]
                border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))]
                shadow-[0_30px_120px_rgba(0,0,0,0.5)]
                backdrop-blur-xl
                "
            >
                <div className="grid grid-cols-1 lg:min-h-[820px] lg:grid-cols-[minmax(0,1.45fr)_minmax(420px,0.95fr)]">
                    <div className="hidden h-full lg:block">
                        <LeftHeroPanel />
                    </div>

                    <div className="relative flex items-center justify-center overflow-hidden px-6 py-10 lg:px-12 xl:px-16">
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,46,200,0.12),transparent_30%),radial-gradient(circle_at_bottom,rgba(36,195,255,0.10),transparent_34%)]" />
                        <div className="relative w-full max-w-[500px] rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(12,14,20,0.92),rgba(9,10,14,0.78))] px-6 py-7 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:px-8 sm:py-9">
                            <div className="mb-6 flex items-center justify-between gap-4">
                                <BrandMark />
                                <div className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-2 text-right sm:block">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/45">
                                        Creator Access
                                    </p>
                                    <p className="mt-1 text-xs text-white/70">
                                        Premium onboarding
                                    </p>
                                </div>
                            </div>

                            <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[#24C3FF]">
                                    {mode === "/login" ? "Welcome Back" : "Early Access"}
                                </p>
                                <p className="mt-2 text-sm leading-6 text-white/62">
                                    {mode === "/login"
                                        ? "Access your creator dashboard, manage fans, and jump back into live competition."
                                        : "Create a sharper profile, set your game identity, and enter the platform with a stronger first impression."}
                                </p>
                            </div>

                            {mode === "/login" ? (
                                <LoginForm onGoRegister={() => setMode("/register")} />
                            ) : (
                                <RegisterForm onGoLogin={() => setMode("/login")} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
}










