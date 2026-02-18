import { cn } from "@/shared/lib/utils/cn";
import * as React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    isLoading?: boolean;
};

export default function StartStreamingButton({ isLoading = false, className, ...props }: Props) {
    return (
        <button
            {...props}
            disabled={isLoading}
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap",
                "cursor-pointer select-none",
                "px-6 py-3",
                "text-[1.125rem] font-light leading-6 text-white",
                "rounded-lg",
                "bg-navActive",

                // 3D default
                "shadow-[4px_4px_0_0_rgba(255,255,255,1),inset_0_0_0_2px_rgba(255,255,255,1)]",

                // ✅ press animation
                "transition-transform transition-shadow duration-150 ease-out",
                "active:translate-x-[2px] active:translate-y-[2px]",
                "active:shadow-[2px_2px_0_0_rgba(255,255,255,1),inset_0_0_0_2px_rgba(255,255,255,1)]",

                // hover + disabled
                "hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0",
                className
            )}
        />
    );
}
