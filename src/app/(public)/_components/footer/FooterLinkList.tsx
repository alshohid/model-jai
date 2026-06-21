// FooterLinkList.tsx
"use client";

import Link from "next/link";

type FooterLink = {
    label: string;
    href: string;
    onClick?: () => void;
};

export default function FooterLinkList({ links }: { links: FooterLink[] }) {
    const handleClick = (e: React.MouseEvent, link: FooterLink) => {
        if (link.onClick) {
            e.preventDefault();
            link.onClick();
        }
    };

    return (
        <ul className="flex flex-col gap-3">
            {links.map((link) => (
                <li key={link.href}>
                    <Link
                        href={link.href}
                        onClick={(e) => handleClick(e, link)}
                        className="text-white/55 hover:text-white transition text-sm"
                    >
                        {link.label}
                    </Link>
                </li>
            ))}
        </ul>
    );
}