"use client";

import Link from "next/link";

type FooterLink = { label: string; href: string };

export default function FooterLinkList({ links }: { links: FooterLink[] }) {
    return (
        <nav className="flex flex-col gap-2">
            {links.map((l) => (
                <Link
                    key={l.href}
                    href={l.href}
                    className="text-white/55 hover:text-white transition text-sm sm:text-base"
                >
                    {l.label}
                </Link>
            ))}
        </nav>
    );
}
