"use client";

import Link from "next/link";
import { Instagram, Facebook, Linkedin } from "lucide-react";
import { cn } from "@/shared/lib/utils/cn";

const socials = [
    { label: "Instagram", href: "#", Icon: Instagram },
    { label: "Facebook", href: "#", Icon: Facebook },
    { label: "LinkedIn", href: "#", Icon: Linkedin },
];

export default function SocialRow({ className }: { className?: string }) {
    return (
        <div className={cn("flex items-center gap-3", className)}>
            {socials.map(({ label, href, Icon }) => (
                <Link
                    key={label}
                    href={href}
                    aria-label={label}
                    className={cn(
                        "cursor-pointer",
                        "w-10 h-10 rounded-full",
                        "bg-white/10 border border-white/10",
                        "flex items-center justify-center",
                        "text-white/70 hover:text-white hover:bg-white/15",
                        "transition"
                    )}
                >
                    <Icon size={18} />
                </Link>
            ))}
        </div>
    );
}
