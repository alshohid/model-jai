"use client";

import { useState } from "react";
import {
    Sheet,
    SheetContent,
} from "@/components/ui/sheet";
import { Copy, Check, Share2, Link as LinkIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils/cn";

interface ReferralShareSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    shareUrl: string;
    onCopy?: (link: string) => void;
    onShare?: (link: string) => void;
}

export default function ReferralShareSheet({
    open,
    onOpenChange,
    title,
    shareUrl,
    onCopy,
    onShare,
}: ReferralShareSheetProps) {
    const [copied, setCopied] = useState(false);

    let displayUrl = shareUrl || "";
    if (typeof window !== "undefined" && shareUrl) {
        try {
            displayUrl = new URL(shareUrl).hostname;
        } catch {
            displayUrl = shareUrl;
        }
    }

    const handleCopy = async () => {
        if (!shareUrl) return;
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            onCopy?.(shareUrl);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const handleNativeShare = async () => {
        if (!shareUrl) return;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: title,
                    url: shareUrl,
                });
                onShare?.(shareUrl);
            } catch (err) {
                console.error("Failed to share:", err);
            }
        } else {
            handleCopy();
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="bottom"
                className={cn(
                    "rounded-t-2xl border-t border-white/10",
                    "bg-[#1a141a] text-white",
                    "max-h-[85vh] overflow-hidden flex flex-col",
                    "[&>button]:text-white/70 [&>button]:hover:text-white [&>button]:top-3 [&>button]:right-4"
                )}
            >
                {/* Drag handle */}
                <div className="flex justify-center pt-3 pb-1 shrink-0">
                    <div className="w-12 h-1 rounded-full bg-white/25" />
                </div>

                {/* Share target: icon + title + url */}
                <div className="flex items-center gap-4 px-5 pb-4 shrink-0">
                    <div className="flex items-center justify-center size-12 rounded-xl bg-white/10 shrink-0">
                        <LinkIcon className="size-6 text-white/80" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white truncate">
                            {title}
                        </p>
                        <p className="text-sm text-white/50 truncate">
                            {displayUrl}
                        </p>
                    </div>
                </div>

                {/* Share actions */}
                <div className="px-5 pb-6 flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={handleCopy}
                        className={cn(
                            "flex items-center justify-center gap-2",
                            "min-w-[120px] px-4 py-3 rounded-xl",
                            "bg-white/10 hover:bg-white/15 border border-white/10",
                            "text-white text-sm font-medium transition"
                        )}
                    >
                        {copied ? (
                            <>
                                <Check className="size-5 text-green-400" />
                                <span>Copied!</span>
                            </>
                        ) : (
                            <>
                                <Copy className="size-5" />
                                <span>Copy Link</span>
                            </>
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={handleNativeShare}
                        className={cn(
                            "flex items-center justify-center gap-2",
                            "min-w-[120px] px-4 py-3 rounded-xl",
                            "bg-[#00C3FF] hover:bg-[#00C3FF]/90 text-white",
                            "text-sm font-medium transition"
                        )}
                    >
                        <Share2 className="size-5" />
                        <span>Share</span>
                    </button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
