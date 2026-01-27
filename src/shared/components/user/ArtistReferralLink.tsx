"use client";

import { useState } from "react";
import { Copy, Check, Share2, Link as LinkIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils/cn";

interface ArtistReferralLinkProps {
    artistId: string;
    artistName: string;
    nextMatchId?: string;
    className?: string;
    onCopy?: (link: string) => void;
    onShare?: (link: string) => void;
}

export default function ArtistReferralLink({
    artistId,
    artistName,
    nextMatchId,
    className,
    onCopy,
    onShare,
}: ArtistReferralLinkProps) {
    const [copied, setCopied] = useState(false);

    // Generate referral link
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const referralCode = `ref_${artistId}_${Date.now()}`;
    const referralLink = nextMatchId
        ? `${baseUrl}/live-stream/match/${nextMatchId}?ref=${referralCode}`
        : `${baseUrl}/?ref=${referralCode}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(referralLink);
            setCopied(true);
            onCopy?.(referralLink);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Support ${artistName}`,
                    text: `Check out ${artistName}'s next match!`,
                    url: referralLink,
                });
                onShare?.(referralLink);
            } catch (err) {
                console.error("Failed to share:", err);
            }
        } else {
            handleCopy();
        }
    };

    return (
        <div className={cn("w-full space-y-3", className)}>
            <div className="flex items-center gap-2 mb-2">
                <LinkIcon className="size-5 text-[#00C3FF]" />
                <h3 className="text-white font-semibold text-base md:text-lg">
                    Your Referral Link
                </h3>
            </div>

            {/* Link Display */}
            <div className="relative">
                <div
                    className={cn(
                        "w-full p-3 md:p-4 rounded-lg",
                        "bg-white/5 border border-white/10",
                        "flex items-center gap-2"
                    )}
                >
                    <input
                        type="text"
                        value={referralLink}
                        readOnly
                        className={cn(
                            "flex-1 bg-transparent outline-none",
                            "text-white/80 text-xs md:text-sm",
                            "truncate"
                        )}
                    />
                    <button
                        type="button"
                        onClick={handleCopy}
                        className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-lg",
                            "bg-[#00C3FF] hover:bg-[#00C3FF]/90 text-white",
                            "transition-all",
                            "text-xs md:text-sm font-medium"
                        )}
                    >
                        {copied ? (
                            <>
                                <Check className="size-4" />
                                <span>Copied!</span>
                            </>
                        ) : (
                            <>
                                <Copy className="size-4" />
                                <span>Copy</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Share Button */}
            <button
                type="button"
                onClick={handleShare}
                className={cn(
                    "w-full flex items-center justify-center gap-2",
                    "px-4 py-3 rounded-lg",
                    "bg-[#FF2EC8] hover:bg-[#FF2EC8]/90 text-white",
                    "transition-all font-medium",
                    "text-sm md:text-base"
                )}
            >
                <Share2 className="size-4 md:size-5" />
                <span>Share Referral Link</span>
            </button>

            {/* Info Text */}
            <p className="text-white/60 text-xs md:text-sm">
                Share this link with your friends. When they click it, they'll be directed to your
                next match. If they don't have an account, they'll be prompted to create one and
                deposit funds to support you.
            </p>
        </div>
    );
}
