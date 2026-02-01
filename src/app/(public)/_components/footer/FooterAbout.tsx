"use client";

import { cn } from "@/shared/lib/utils/cn";
import BrandMark from "../brandMark/BrandMark";

export default function FooterAbout({ className }: { className?: string }) {
    return (
        <div className={cn("max-w-[620px]", className)}>
            <div className="flex items-center justify-start">
                <BrandMark width={130} height={90} />
            </div>

            <p className="mt-4 text-white/55 text-sm text-justify sm:text-base leading-relaxed">
                Model Boss Offers is a competitive, skill-based tournament platform where users
                support players using virtual points — not real-money betting or wagering.
                All competitions are determined purely by player skill, and rewards are distributed
                through supporter contributions. The platform is built for entertainment and community
                engagement within a structured, secure, and transparent ecosystem.
                Play fair, support smarter, and climb like a Boss.
            </p>
        </div>
    );
}
