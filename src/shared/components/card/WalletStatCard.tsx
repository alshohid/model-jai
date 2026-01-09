import { cn } from "@/shared/lib/utils/cn";

type Props = {
    label: string;
    value: string | number;
    locked?: boolean;
    currency?: string; // "₱"
    className?: string;
};

export function WalletStatCard({
    label,
    value,
    locked = false,
    currency = "₱",
    className,
}: Props) {
    return (
        <div
            className={cn(
                "rounded-[14px] bg-white/5 border border-white/12 backdrop-blur-[16px]",
                "px-5 py-4",
                className
            )}
        >
            <p className="text-white/80 text-sm">{label}</p>

            <div className="mt-2 flex items-center gap-2">
                <span className={cn("text-white text-xl", locked && "blur-[4px] select-none")}>
                    {currency} {value}
                </span>
                {locked && (
                    <span className="text-[11px] text-white/40 border border-white/10 px-2 py-1 rounded-md">
                        Sign in
                    </span>
                )}
            </div>
        </div>
    );
}
