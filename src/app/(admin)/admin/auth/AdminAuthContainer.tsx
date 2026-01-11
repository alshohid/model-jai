"use client";

import BrandMark from "@/app/(public)/_components/brandMark/BrandMark";
import { LeftHeroPanel } from "@/shared/UI/reusable/auth/LeftHeroPanel";
import AdminLoginForm from "./AdminLoginForm";


export default function AdminAuthContainer() {
    return (
        <div className="min-h-screen w-full bg-[#0B0D12] flex items-center justify-center px-4 py-6">
            <div
                className="
            w-full container rounded-[18px] overflow-hidden
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
                            <p className="mt-2 text-white/55 text-sm">Admin Login</p>

                            <AdminLoginForm />
                        </div>

                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06),transparent_60%)]" />
                    </div>
                </div>
            </div>
        </div>
    );
}
