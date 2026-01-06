"use client";

import FooterAbout from "@/app/(public)/_components/footer/FooterAbout";
import FooterColumn from "@/app/(public)/_components/footer/FooterColumn";
import FooterLinkList from "@/app/(public)/_components/footer/FooterLinkList";
import SocialRow from "@/app/(public)/_components/footer/SocialRow";
import Link from "next/link";


type FooterLink = { label: string; href: string };

const QUICK_LINKS: FooterLink[] = [
    { label: "Home", href: "/" },
    { label: "Live Stream Match", href: "/matches" },
    { label: "Store", href: "/buy-points" },
    { label: "Contact", href: "/contact" },
];

const LEGAL_LINKS: FooterLink[] = [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms" },
];

export default function FooterSection() {
    return (
        <footer className="w-full bg-[#161721]">
            <div className="container py-20 sm:py-16">
                {/* Top */}
                <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_0.7fr] gap-12 lg:gap-24">
                    <FooterAbout />

                    <div className="flex flex-col gap-10">
                        <FooterColumn title="Quick Links">
                            <FooterLinkList links={QUICK_LINKS} />
                        </FooterColumn>

                        <FooterColumn title="">
                            <SocialRow />
                        </FooterColumn>
                    </div>
                </div>

                {/* Divider */}
                <div className="mt-14 border-t border-white/10" />

                {/* Bottom */}
                <div className="pt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-white/45 text-sm">
                        © {new Date().getFullYear()} Model Boss Offers. All rights reserved.
                    </p>

                    <div className="flex items-center gap-6">
                        {LEGAL_LINKS.map((l) => (
                            <Link
                                key={l.href}
                                href={l.href}
                                className="text-white/55 hover:text-white transition text-sm"
                            >
                                {l.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
