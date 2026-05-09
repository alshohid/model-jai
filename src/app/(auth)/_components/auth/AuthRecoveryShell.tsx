"use client";

import BrandMark from "@/app/(public)/_components/brandMark/BrandMark";
import { LeftHeroPanel } from "@/shared/UI/reusable/auth/LeftHeroPanel";
import { cn } from "@/shared/lib/utils/cn";

type FlowStep = {
    id: number;
    label: string;
    hint: string;
};

type Props = {
    step: number;
    eyebrow?: string;
    title?: string;
    description?: string;
    steps?: FlowStep[];
    heroEyebrow?: string;
    heroTitle?: string;
    heroDescription?: string;
    children: React.ReactNode;
};

const defaultSteps: FlowStep[] = [
    { id: 1, label: "Email", hint: "Request access code" },
    { id: 2, label: "OTP", hint: "Verify ownership" },
    { id: 3, label: "Reset", hint: "Create a new password" },
];

export default function AuthRecoveryShell({
    step,
    eyebrow,
    title,
    description,
    steps,
    heroEyebrow = "Secure Recovery",
    heroTitle = "Recover your account.",
    heroDescription = "Verify email, confirm OTP, then set a new password.",
    children,
}: Props) {
    const flowSteps = steps ?? defaultSteps;

    return (
        <div className="min-h-screen bg-[#0B0D12] px-2.5 py-2.5 sm:px-4 sm:py-5">
            <div className="container overflow-hidden rounded-[18px] border border-white/10 bg-[#0B0D12] shadow-[0_30px_80px_rgba(0,0,0,0.55)] sm:rounded-[24px]">
                <div className="grid min-h-[100dvh] grid-cols-1 lg:min-h-[760px] lg:grid-cols-[1.15fr_0.85fr]">
                    <div className="relative hidden lg:block">
                        <LeftHeroPanel />
                        <div className="absolute inset-0 bg-gradient-to-br from-[#FF2EC8]/20 via-transparent to-[#24C3FF]/10" />
                        <div className="absolute inset-x-8 bottom-8 rounded-[24px] border border-white/10 bg-black/35 p-6 backdrop-blur-xl">
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#24C3FF]">
                                {heroEyebrow}
                            </p>
                            <h2 className="mt-3 text-3xl font-semibold text-white">
                                {heroTitle}
                            </h2>
                            <p className="mt-3 max-w-md text-sm leading-6 text-white/65">
                                {heroDescription}
                            </p>
                        </div>
                    </div>

                    <div className="relative flex items-start justify-center overflow-hidden px-3 py-4 sm:px-5 sm:py-6 lg:items-center lg:px-12 lg:py-10">
                        <div className="absolute left-[-80px] top-4 h-28 w-28 rounded-full bg-[#FF2EC8]/15 blur-3xl sm:top-10 sm:h-40 sm:w-40" />
                        <div className="absolute bottom-0 right-[-60px] h-32 w-32 rounded-full bg-[#24C3FF]/10 blur-3xl sm:bottom-4 sm:h-44 sm:w-44" />

                        <div className="relative z-10 w-full max-w-[460px]">
                            <div className="flex justify-center lg:justify-start">
                                <BrandMark />
                            </div>

                            <div className="mt-3 rounded-[18px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.04))] p-2 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:mt-5 sm:rounded-[22px] sm:p-3.5 lg:p-5">
                                <div className="rounded-[16px] border border-white/8 bg-[#090B10]/85 p-3 sm:rounded-[18px] sm:p-4">
                                    <div
                                        className="grid gap-1.5 sm:gap-2.5"
                                        style={{
                                            gridTemplateColumns: `repeat(${flowSteps.length}, minmax(0, 1fr))`,
                                        }}
                                    >
                                        {flowSteps.map((item) => {
                                            const isActive = item.id === step;
                                            const isComplete = item.id < step;

                                            return (
                                                <div
                                                    key={item.id}
                                                    className={cn(
                                                        "rounded-[12px] border px-2 py-1.5 transition sm:rounded-[16px] sm:px-3 sm:py-2",
                                                        isActive
                                                            ? "border-[#FF2EC8]/50 bg-[#FF2EC8]/12 shadow-[0_0_20px_rgba(255,46,200,0.18)]"
                                                            : isComplete
                                                                ? "border-[#24C3FF]/40 bg-[#24C3FF]/10"
                                                                : "border-white/10 bg-white/5"
                                                    )}
                                                >
                                                    <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/45 sm:text-[10px] sm:tracking-[0.22em]">
                                                        Step {item.id}
                                                    </p>
                                                    <p className="mt-0.5 text-[11px] font-semibold text-white sm:mt-1 sm:text-sm">
                                                        {item.label}
                                                    </p>
                                                    <p className="mt-1 hidden text-xs text-white/45 sm:block">
                                                        {item.hint}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {(eyebrow || title || description) && (
                                        <div className="mt-4 sm:mt-5">
                                            {eyebrow ? (
                                                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#24C3FF] sm:text-[11px] sm:tracking-[0.28em]">
                                                    {eyebrow}
                                                </p>
                                            ) : null}
                                            {title ? (
                                                <h1 className="mt-2 text-[18px] font-semibold leading-tight text-white sm:mt-3 sm:text-[24px] lg:text-[28px]">
                                                    {title}
                                                </h1>
                                            ) : null}
                                            {description ? (
                                                <p className="mt-2 text-[12px] leading-5 text-white/60 sm:mt-3 sm:text-[13px] sm:leading-6">
                                                    {description}
                                                </p>
                                            ) : null}
                                        </div>
                                    )}

                                    <div className="mt-4 sm:mt-5">{children}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
