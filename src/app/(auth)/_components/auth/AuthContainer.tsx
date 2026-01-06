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
        <div className="min-h-screen w-full bg-[#0B0D12] flex items-center justify-center px-4 py-6">
            <div
            className="
            w-full max-w-7xl rounded-[18px] overflow-hidden
            bg-[#0B0D12]
            shadow-[0_20px_60px_rgba(0,0,0,0.55)]
            border border-white/10
            "
            >
                <div className="grid grid-cols-1 lg:grid-cols-[8fr_4fr]">
                    <div className="hidden lg:block">
                        <LeftHeroPanel />
                    </div>

                    <div className="relative flex items-center justify-center px-6 py-10 lg:px-12">
                        <div className="w-full max-w-[430px]">
                            <BrandMark />
                            {mode === "/login" ? (
                                <LoginForm onGoRegister={() => setMode("/register")} />
                            ) : (
                                <RegisterForm onGoLogin={() => setMode("/login")} />
                            )}
                        </div>
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06),transparent_60%)]" />
                    </div>
                </div>
            </div>
        </div>
    );
}











