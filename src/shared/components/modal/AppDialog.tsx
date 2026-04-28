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
                data-lenis-prevent
                data-lenis-prevent-wheel
                className={cn(
                    "p-0 border-0 bg-transparent shadow-none",
                    "w-[calc(100vw-16px)] sm:w-[92vw] max-w-[460px]",
                    "max-h-[calc(100dvh-16px)] sm:max-h-[calc(100dvh-24px)]",
                    className
                )}
            >
                <div
                    data-lenis-prevent
                    data-lenis-prevent-wheel
                    className={cn(
                        "relative flex min-h-0 flex-col overflow-hidden",
                        "rounded-[18px]",
                        "bg-[#160F16]/90 backdrop-blur-xl",
                        "border border-white/10",
                        "shadow-[0_22px_70px_rgba(0,0,0,0.55)]",
                        "max-h-[calc(100dvh-16px)] sm:max-h-[calc(100dvh-24px)]"
                    )}
                >
                    <DialogHeader className="shrink-0 px-4 pb-3 pt-4 sm:px-5 sm:pb-4 sm:pt-5">
                        <div className="flex items-start justify-between gap-3">
                            {title ? (
                                <DialogTitle className="text-[18px] font-semibold text-white sm:text-[22px]">
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
                        data-lenis-prevent
                        data-lenis-prevent-wheel
                        className={cn(
                            "min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-4 pb-4",
                            "[-webkit-overflow-scrolling:touch]",
                            "sm:px-5 sm:pb-5",
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
