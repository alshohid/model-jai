"use client";

import type { ReactNode } from "react";
import BrandMark from "@/app/(public)/_components/brandMark/BrandMark";
import { LeftHeroPanel } from "@/shared/UI/reusable/auth/LeftHeroPanel";
import { cn } from "@/shared/lib/utils/cn";

type Props = {
    children: ReactNode;
    cardClassName?: string;
};

export default function AuthPageShell({ children, cardClassName }: Props) {
    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-[#07090D] px-4 py-6 lg:px-6 lg:py-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,46,200,0.14),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(36,195,255,0.14),transparent_28%),linear-gradient(180deg,#07090D_0%,#0B0D12_100%)]" />
            <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.16)_1px,transparent_1px)] [background-size:72px_72px]" />

            <div className="relative flex min-h-[calc(100vh-3rem)] items-center justify-center">
                <div className="w-full max-w-[1480px] overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))] shadow-[0_30px_120px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                    <div className="grid grid-cols-1 lg:min-h-[820px] lg:grid-cols-[minmax(0,1.45fr)_minmax(420px,0.95fr)]">
                        <div className="hidden h-full lg:block">
                            <LeftHeroPanel />
                        </div>

                        <div className="relative flex items-center justify-center overflow-hidden px-6 py-10 lg:px-12 xl:px-16">
                            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,46,200,0.12),transparent_30%),radial-gradient(circle_at_bottom,rgba(36,195,255,0.10),transparent_34%)]" />

                            <div
                                className={cn(
                                    "relative w-full max-w-[500px] rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(12,14,20,0.92),rgba(9,10,14,0.78))] px-6 py-7 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:px-8 sm:py-9",
                                    cardClassName,
                                )}
                            >
                                <div className="mb-6 flex items-center justify-center gap-4">
                                    <BrandMark />
                                </div>

                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
