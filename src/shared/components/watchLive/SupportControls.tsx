"use client";

import { cn } from "@/shared/lib/utils/cn";

type Props = {
    className?: string;
    onSupportLeft?: () => void;
    onSupportRight?: () => void;
};

export default function SupportControls({ className, onSupportLeft, onSupportRight }: Props) {
    return (
        <div className={cn("px-4 pb-4", className)}>
            <div className="mx-auto max-w-[980px] rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md p-3 flex items-center gap-3">
                <button
                    type="button"
                    onClick={onSupportLeft}
                    className="flex-1 btn text-white py-3 rounded-xl cursor-pointer"
                >
                    Support Left
                </button>

                <button
                    type="button"
                    onClick={onSupportRight}
                    className="flex-1 btn text-white py-3 rounded-xl cursor-pointer"
                >
                    Support Right
                </button>
            </div>
        </div>
    );
}
