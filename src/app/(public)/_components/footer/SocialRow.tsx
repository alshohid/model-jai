"use client";

import Link from "next/link";
import {
    Instagram,
    Facebook,
    Linkedin,
    Twitch,
    Youtube,
    Send,
    type LucideIcon,
} from "lucide-react";
import { FaTiktok, FaWhatsapp } from "react-icons/fa6";
import type { IconType } from "react-icons";
import { cn } from "@/shared/lib/utils/cn";
import {
    SOCIAL_LINK_KEYS,
    SOCIAL_LINK_LABELS,
    useGetPublicSocialLinksQuery,
} from "@/redux/features/settings/socialLinks/socialLinks";
import type { SocialLinkKey } from "@/redux/features/settings/socialLinks/types";

const socialIcons: Record<SocialLinkKey, LucideIcon | IconType> = {
    instagram: Instagram,
    facebook: Facebook,
    linkedin: Linkedin,
    tiktok: FaTiktok,
    twitch: Twitch,
    telegram: Send,
    whatsapp: FaWhatsapp,
    youtube: Youtube,
};

const fallbackHrefs: Record<SocialLinkKey, string> = {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    linkedin: "https://linkedin.com",
    tiktok: "https://tiktok.com",
    twitch: "https://twitch.tv",
    telegram: "https://telegram.org",
    whatsapp: "https://whatsapp.com",
    youtube: "https://youtube.com",
};

export default function SocialRow({
    className,
}: {
    className?: string;
}) {
    const { data: socialLinks } = useGetPublicSocialLinksQuery();

    const socials = SOCIAL_LINK_KEYS.map((key) => {
        const href = socialLinks?.[key]?.trim() || fallbackHrefs[key];

        return {
            key,
            label: SOCIAL_LINK_LABELS[key],
            href,
            Icon: socialIcons[key],
        };
    });

    return (
        <div className={cn("flex flex-nowrap items-center gap-2 sm:gap-3", className)}>
            {socials.map(({ key, label, href, Icon }) => (
                <Link
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={cn(
                        "h-7 w-7 shrink-0 rounded-full sm:h-9 sm:w-9 md:h-10 md:w-10",
                        "bg-white/10 border border-white/10",
                        "flex items-center justify-center",
                        "text-white/70 hover:text-white hover:bg-white/15",
                        "transition-all duration-300"
                    )}
                >
                    <Icon className="size-3.5 sm:size-4" size={16} />
                </Link>
            ))}
        </div>
    );
}
