"use client";

import * as React from "react";
import { cn } from "@/shared/lib/utils/cn";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

type Props = {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    title?: string;
    children: React.ReactNode;
    className?: string;        // DialogContent wrapper
    bodyClassName?: string;    // scroll body
};

export default function AppDialog({
    open,
    onOpenChange,
    title,
    children,
    className,
    bodyClassName,
}: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={cn(
                    "p-0 border-0 bg-transparent shadow-none",
                    "w-[92vw] max-w-[460px]",
                    // ✅ mobile viewport safe height (address bar issue fix)
                    "max-h-[calc(100dvh-24px)]",
                    className
                )}
            >
                <div
                    className={cn(
                        "relative overflow-hidden",
                        "rounded-[18px]",
                        "bg-[#160F16]/90 backdrop-blur-xl",
                        "border border-white/10",
                        "shadow-[0_22px_70px_rgba(0,0,0,0.55)]",
                        // ✅ keep container within viewport
                        "max-h-[calc(100dvh-24px)]"
                    )}
                >
                    {/* Header (fixed) */}
                    <DialogHeader className="px-5 pt-5 pb-4">
                        <div className="flex items-start justify-between gap-3">
                            {title ? (
                                <DialogTitle className="text-white text-[20px] sm:text-[22px] font-semibold">
                                    {title}
                                </DialogTitle>
                            ) : (
                                <span />
                            )}

                            <DialogClose asChild>
                                <button
                                    type="button"
                                    className={cn(
                                        "cursor-pointer inline-flex items-center justify-center",
                                        "size-9 rounded-[12px]",
                                        "bg-white/8 border border-white/12",
                                        "text-white/80 hover:text-white hover:bg-white/12 transition"
                                    )}
                                    aria-label="Close dialog"
                                >
                                    ✕
                                </button>
                            </DialogClose>
                        </div>
                    </DialogHeader>

                    {/* Body (scrollable) */}
                    <div
                        className={cn(
                            "px-5 pb-5 overflow-y-auto",
                            "max-h-[calc(100dvh-24px-76px)]",
                            bodyClassName
                        )}
                    >
                        {children}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
