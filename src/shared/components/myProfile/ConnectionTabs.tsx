import { cn } from "@/lib/utils";
import { SocialConnectionMode } from "@/types/user/auth";
import Link from "next/link";


export function ConnectionTabs({ mode, tabs }: { mode: SocialConnectionMode, tabs: { label: string, href: string, value: string }[] }) {


    return (
        <div className="grid w-full grid-cols-2 border-b border-white/10 sm:inline-flex sm:w-auto sm:rounded-[14px] sm:border sm:bg-white/[0.04] sm:p-1">
            {tabs.map((tab) => {
                const active = tab.value === mode;

                return (
                    <Link
                        key={tab.value}
                        href={tab.href}
                        className={cn(
                            "border-b-2 px-4 py-3 text-center text-sm font-semibold transition sm:rounded-[11px] sm:border-b-0 sm:py-2",
                            active
                                ? "border-[#FF2EC8] text-white sm:bg-[#FF2EC8] sm:shadow-[0_10px_30px_rgba(255,46,200,0.28)]"
                                : "border-transparent text-white/55 hover:text-white sm:text-white/65 sm:hover:bg-white/8",
                        )}
                    >
                        {tab.label}
                    </Link>
                );
            })}
        </div>
    );
}