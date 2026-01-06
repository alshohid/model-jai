"use client";

import { cn } from "@/shared/lib/utils/cn";

export default function FooterAbout({ className }: { className?: string }) {
    return (
        <div className={cn("max-w-[620px]", className)}>
            <h3 className="text-white text-xl font-semibold">Model Boss Offers</h3>

            <p className="mt-4 text-white/55 text-sm sm:text-base leading-relaxed">
                Model Boss Offers is a competitive skill-based tournament platform where users support players
                with virtual points not real money wagering. All competitions are based on player skill, and
                rewards are distributed from supporter contributions. This platform is designed for
                entertainment and community engagement within a structured, secure, and transparent ecosystem.
                Play fair, support smarter, and climb like a Boss.
            </p>
        </div>
    );
}
