import { cn } from "@/shared/lib/utils/cn";
import * as React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function StartStreamingButton({ className, ...props }: Props) {
    return (
        <button
            {...props}
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap",
                "cursor-pointer select-none",
                "px-6 py-3",
                "text-[1.125rem] font-light leading-6  text-white",
                "rounded-lg",

                "bg-navActive",
                "shadow-[4px_4px_0_0_rgba(255,255,255,1),inset_0_0_0_2px_rgba(255,255,255,1)]",

                "transition-opacity hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed",
                className
            )}
        />
    );
}
