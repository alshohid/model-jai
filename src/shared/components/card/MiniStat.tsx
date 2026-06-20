import Link from "next/link";
import { cn } from "@/shared/lib/utils/cn";

type MiniStatProps = {
    label: string;
    value: string | number;
    href?: string;
    onClick?: () => void;
};

export function MiniStat({ label, value, href, onClick }: MiniStatProps) {
    const content = (
        <>
            <p className="text-white/45 text-[11px]">{label}</p>
            <p className="text-white font-semibold text-[14px]">{value}</p>
        </>
    );
    const className = cn(
        "rounded-[12px] bg-white/5 border border-white/10 py-2 transition w-full text-center block",
        (href || onClick) && "hover:border-[#FF2EC8]/40 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2EC8]/45 cursor-pointer",
    );

    if (href) {
        return (
            <Link href={href} className={className} aria-label={`View ${label}`}>
                {content}
            </Link>
        );
    }

    if (onClick) {
        return (
            <button
                type="button"
                onClick={onClick}
                className={className}
                aria-label={`View ${label}`}
            >
                {content}
            </button>
        );
    }

    return <div className={className}>{content}</div>;
}
