"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/shared/lib/utils/cn";

export function useReferralRedirect() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [showRegistrationPrompt, setShowRegistrationPrompt] = useState(false);
    const [referralCode, setReferralCode] = useState<string | null>(null);

    useEffect(() => {
        const ref = searchParams.get("ref");
        if (ref) {
            setReferralCode(ref);
            // Check if user is logged in (you'll need to implement this check)
            const isLoggedIn = localStorage.getItem("auth_token") !== null;
            
            if (!isLoggedIn) {
                setShowRegistrationPrompt(true);
            }
        }
    }, [searchParams]);

    const handleRegister = () => {
        // Store referral code in sessionStorage to use after registration
        if (referralCode) {
            sessionStorage.setItem("pending_referral", referralCode);
        }
        router.push("/register");
        setShowRegistrationPrompt(false);
    };

    const handleLogin = () => {
        // Store referral code in sessionStorage to use after login
        if (referralCode) {
            sessionStorage.setItem("pending_referral", referralCode);
        }
        router.push("/login");
        setShowRegistrationPrompt(false);
    };

    const handleSkip = () => {
        setShowRegistrationPrompt(false);
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
                        You've been invited to support {artistName}. Create an account and deposit
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
