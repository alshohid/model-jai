"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/redux/features/auth/hooks";
import { cn } from "@/shared/lib/utils/cn";

const PENDING_REFERRAL_KEY = "pending_referral";
const PENDING_AUTH_REDIRECT_KEY = "pending_auth_redirect";

export function useReferralRedirect() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const referralCode = searchParams.get("ref");
    const [dismissedReferralCode, setDismissedReferralCode] = useState<string | null>(null);

    const currentRedirect = useMemo(() => {
        const query = searchParams.toString();
        return pathname + (query ? "?" + query : "");
    }, [pathname, searchParams]);

    useEffect(() => {
        if (!referralCode || typeof window === "undefined") return;

        sessionStorage.setItem(PENDING_REFERRAL_KEY, referralCode);
        sessionStorage.setItem(PENDING_AUTH_REDIRECT_KEY, currentRedirect);
    }, [currentRedirect, referralCode]);

    const showRegistrationPrompt = Boolean(
        referralCode && !isAuthenticated && dismissedReferralCode !== referralCode
    );

    const getAuthUrl = (path: "/login" | "/register") => {
        const params = new URLSearchParams();

        if (referralCode) {
            params.set("ref", referralCode);
        }

        params.set("redirect", currentRedirect);

        return path + "?" + params.toString();
    };

    const handleRegister = () => {
        if (typeof window !== "undefined") {
            if (referralCode) {
                sessionStorage.setItem(PENDING_REFERRAL_KEY, referralCode);
            }
            sessionStorage.setItem(PENDING_AUTH_REDIRECT_KEY, currentRedirect);
        }

        router.push(getAuthUrl("/register"));
        setDismissedReferralCode(referralCode);
    };

    const handleLogin = () => {
        if (typeof window !== "undefined") {
            if (referralCode) {
                sessionStorage.setItem(PENDING_REFERRAL_KEY, referralCode);
            }
            sessionStorage.setItem(PENDING_AUTH_REDIRECT_KEY, currentRedirect);
        }

        router.push(getAuthUrl("/login"));
        setDismissedReferralCode(referralCode);
    };

    const handleSkip = () => {
        setDismissedReferralCode(referralCode);
    };

    return {
        referralCode,
        showRegistrationPrompt,
        handleRegister,
        handleLogin,
        handleSkip,
    };
}

interface ReferralRegistrationPromptProps {
    open: boolean;
    onRegister: () => void;
    onLogin: () => void;
    onSkip: () => void;
    artistName?: string;
}

export function ReferralRegistrationPrompt({
    open,
    onRegister,
    onLogin,
    onSkip,
    artistName = "this artist",
}: ReferralRegistrationPromptProps) {
    return (
        <Dialog open={open} onOpenChange={() => onSkip()}>
            <DialogContent
                className={cn(
                    "max-w-[90vw] sm:max-w-md",
                    "bg-[#0F0F0F] border-white/10",
                    "text-white"
                )}
            >
                <DialogHeader>
                    <DialogTitle className="text-xl md:text-2xl font-bold text-white">
                        Create Account to Support {artistName}
                    </DialogTitle>
                    <DialogDescription className="text-white/70 text-sm">
                        You have been invited to support {artistName}. Create an account and deposit
                        funds to participate in matches and show your support.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-3 mt-4">
                    <button
                        type="button"
                        onClick={onRegister}
                        className={cn(
                            "w-full px-4 py-3 rounded-lg",
                            "bg-[#FF2EC8] hover:bg-[#FF2EC8]/90 text-white",
                            "font-semibold transition-all",
                            "text-sm md:text-base"
                        )}
                    >
                        Create Account
                    </button>

                    <button
                        type="button"
                        onClick={onLogin}
                        className={cn(
                            "w-full px-4 py-3 rounded-lg",
                            "bg-white/10 hover:bg-white/15 border border-white/20 text-white",
                            "font-medium transition-all",
                            "text-sm md:text-base"
                        )}
                    >
                        Already have an account? Login
                    </button>

                    <button
                        type="button"
                        onClick={onSkip}
                        className={cn(
                            "w-full px-4 py-2 text-white/60 hover:text-white/80",
                            "text-xs md:text-sm transition-all"
                        )}
                    >
                        Skip for now
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
