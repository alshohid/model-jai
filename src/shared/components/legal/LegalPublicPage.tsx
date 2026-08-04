"use client";

import { AlertTriangle } from "lucide-react";
import { cn } from "@/shared/lib/utils/cn";
import { useAuth } from "@/redux/features/auth/hooks";
import type { LegalDocument } from "@/redux/features/settings/legalPages/types";
import "./legal-public-page.css";

type Props = {
    document?: LegalDocument;
    isLoading: boolean;
    isError: boolean;
    fallbackTitle: string;
    onRetry?: () => void;
};

export default function LegalPublicPage({
    document,
    isLoading,
    isError,
    fallbackTitle,
    onRetry,
}: Props) {
    const { isAuthenticated, role } = useAuth();
    // Guest navbar is fixed; logged-in user/artist navbar is in document flow.
    const needsNavbarOffset = !(
        isAuthenticated &&
        (role === "user" || role === "artist")
    );
    const sectionClassName = cn(
        "bg-black px-4 pb-10 sm:px-6 sm:pb-14",
        needsNavbarOffset ? "pt-[120px] sm:pt-[130px]" : "pt-10 sm:pt-14",
    );

    if (isLoading) {
        return (
            <section className={sectionClassName}>
                <div className="mx-auto w-full max-w-4xl animate-pulse space-y-4">
                    <div className="h-10 w-72 max-w-full rounded bg-white/10" />
                    <div className="space-y-3 rounded-[18px] border border-white/10 bg-[#161616]/80 px-4 py-4 sm:px-5 sm:py-5">
                        <div className="h-4 w-full rounded bg-white/5" />
                        <div className="h-4 w-11/12 rounded bg-white/5" />
                        <div className="h-4 w-10/12 rounded bg-white/5" />
                        <div className="h-4 w-9/12 rounded bg-white/5" />
                    </div>
                </div>
            </section>
        );
    }

    if (isError) {
        return (
            <section className={sectionClassName}>
                <div className="mx-auto flex w-full max-w-4xl flex-col items-center justify-center space-y-4 rounded-[18px] border border-white/10 bg-[#161616]/80 px-4 py-16 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 text-red-400">
                        <AlertTriangle className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold text-white">
                            Unable to load {fallbackTitle}
                        </h1>
                        <p className="text-sm text-white/55">
                            Please try again in a moment.
                        </p>
                    </div>
                    {onRetry ? (
                        <button
                            type="button"
                            onClick={onRetry}
                            className="rounded-lg bg-[#FF2EC8] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#ff48d0]"
                        >
                            Retry
                        </button>
                    ) : null}
                </div>
            </section>
        );
    }

    const title = document?.title?.trim() || fallbackTitle;
    const content = document?.content?.trim() || "";

    return (
        <section className={sectionClassName}>
            <div className="mx-auto w-full max-w-4xl">
                <h1 className="mb-3 text-3xl font-semibold tracking-tight text-white sm:mb-4 sm:text-4xl">
                    {title}
                </h1>

                <div className="overflow-hidden rounded-[18px] border border-white/10 bg-[#161616]/80 px-4 py-4 shadow-[0_18px_60px_rgba(0,0,0,0.45)] sm:px-5 sm:py-5">
                    {content ? (
                        <div
                            className="legal-content"
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                    ) : (
                        <p className="text-sm text-white/50">
                            Content is not available yet.
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}
