"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import BrandMark from "@/app/(public)/_components/brandMark/BrandMark";
import AuthButton from "@/shared/ui/button/AuthButton";
import MobileNavDrawer from "./MobileNavDrawer";

const navItems = [
    { label: "Home", href: "/" },
    { label: "Live Stream Match", href: "/matches" },
    { label: "Store", href: "/buy-points" },
];

export default function PublicNavbar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const [anchorTop, setAnchorTop] = useState(5);

    const menuBtnRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => setOpen(false), [pathname]);

    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    const toggleDrawer = () => {
        const rect = menuBtnRef.current?.getBoundingClientRect();
        const top = rect ? Math.max(12, Math.round(rect.top - 8)) : 0;
        setAnchorTop(top);
        setOpen((prev) => !prev);
    };


    return (
        <>
            <div className="w-full flex justify-center">
                <div
                    className={[
                        "w-full max-w-[1560px] h-[80px]",
                        "bg-glass backdrop-blur-md",
                        "navbar-border-ring",
                        "flex items-center justify-between",
                        "px-4 sm:px-6 lg:px-[120px]",
                    ].join(" ")}
                >
                    <BrandMark />

                    {/* Desktop nav */}
                    <nav className="hidden md:flex items-center gap-2">
                        {navItems.map((item) => {
                            const active = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={[
                                        "cursor-pointer rounded-md px-3 py-1.5 transition text-[1.125rem]",
                                        active ? "bg-navActive text-white" : "text-[#070707]",
                                    ].join(" ")}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right side */}
                    <div className="flex items-center gap-2 overflow-visible">
                        <div className="hidden sm:flex items-center gap-2">
                            <AuthButton href="/login" variant="login">Log In</AuthButton>
                            <AuthButton href="/register" variant="signup">Sign Up</AuthButton>
                        </div>

                        <button
                            ref={menuBtnRef}
                            onClick={toggleDrawer}
                            className="sm:hidden cursor-pointer inline-flex items-center justify-center rounded-md px-3 py-2 bg-glass border border-glassBorder text-white"
                            aria-label="Open menu"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* <div className="flex md:hidden">
                <MobileNavDrawer
                    open={open}
                    onClose={() => setOpen(false)}
                    navItems={navItems}
                    activePath={pathname}
                    topPx={anchorTop}
                />
                
          </div> */}
    
        </>
    );
}
