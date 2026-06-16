"use client";

import Link from "next/link";
import {
    Instagram,
    Facebook,
    Linkedin,
    Twitch,
    Send,
    MessageCircle,
} from "lucide-react";
import { FaTiktok } from "react-icons/fa6";
import { cn } from "@/shared/lib/utils/cn";

const socials = [
    {
        label: "Instagram",
        href: "https://instagram.com",
        Icon: Instagram,
    },
    {
        label: "Facebook",
        href: "https://facebook.com",
        Icon: Facebook,
    },
    {
        label: "LinkedIn",
        href: "https://linkedin.com",
        Icon: Linkedin,
    },
    {
        label: "TikTok",
        href: "https://tiktok.com",
        Icon: FaTiktok,
    },
    {
        label: "Twitch",
        href: "https://twitch.tv",
        Icon: Twitch,
    },
    {
        label: "Telegram",
        href: "https://telegram.org",
        Icon: Send,
    },
    {
        label: "WhatsApp",
        href: "https://whatsapp.com",
        Icon: MessageCircle,
    },
];

export default function SocialRow({
    className,
}: {
    className?: string;
}) {
    return (
        <div className={cn("flex items-center gap-3", className)}>
            {socials.map(({ label, href, Icon }) => (
                <Link
                    key={label}
                    href={href}
                    target="_blank"
                    aria-label={label}
                    className={cn(
                        "md:w-10 md:h-10 h-7 w-7 rounded-full",
                        "bg-white/10 border border-white/10",
                        "flex items-center justify-center",
                        "text-white/70 hover:text-white hover:bg-white/15",
                        "transition-all duration-300"
                    )}
                >
                    <Icon size={18} />
                </Link>
            ))}
        </div>
    );
}