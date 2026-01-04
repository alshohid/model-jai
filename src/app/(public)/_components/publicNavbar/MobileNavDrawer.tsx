"use client";

import Link from "next/link";
import AuthButton from "@/shared/ui/button/AuthButton";

type NavItem = { label: string; href: string };

export default function MobileNavDrawer({
    open,
    onClose,
    navItems,
    activePath,
    topPx,
}: {
    open: boolean;
    onClose: () => void;
    navItems: NavItem[];
    activePath: string;
    topPx: number;
}) {
    return (
        <>
            {/* ✅ Backdrop must be FIXED */}
            <div
                onClick={onClose}
                className={[
                    "fixed inset-0 z-40 transition-opacity duration-200",
                    open ? "opacity-100 bg-black/45" : "pointer-events-none opacity-0",
                ].join(" ")}
            />

            {/* ✅ Drawer must be FIXED (so it slides back exactly) */}
            <aside
                style={{
                    top: -120,
                    height: `calc(100dvh - ${topPx}px)`,
                    right: -30, // ✅ slide in/out from right edge
                }}
                className={[
                    "fixed z-50",
                    open ? "pointer-events-auto" : "pointer-events-none",
                    "w-[86%] max-w-[360px]",
                    "bg-glass backdrop-blur-md",
                    "navbar-border-ring rounded-[12px]",
                    "shadow-[0_18px_60px_rgba(0,0,0,0.45)]",
                    "transition-transform duration-200 ease-out",
                    // ✅ closed অবস্থায় একদম ডান পাশে চলে যাবে, open হলে ফিরে আসবে
                    open ? "translate-x-0" : "translate-x-full",
                ].join(" ")}
            >
                <div className="h-full flex flex-col p-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <p className="text-white/90 text-sm font-medium">Menu</p>

                        <button
                            onClick={onClose}
                            className="cursor-pointer rounded-md px-3 py-2 text-white/80 hover:bg-white/10 transition"
                            aria-label="Close menu"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Links */}
                    <nav className="mt-4 flex-1 overflow-y-auto">
                        <div className="flex flex-col gap-2">
                            {navItems.map((item) => {
                                const active = activePath === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={onClose}
                                        className={[
                                            "cursor-pointer rounded-[8px] transition",
                                            "h-[48px] px-4 inline-flex items-center",
                                            active
                                                ? "bg-navActive text-white"
                                                : "text-white/75 hover:text-white hover:bg-white/10",
                                        ].join(" ")}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </nav>

                    {/* Bottom auth */}
                    <div className="pt-4">
                        <div className="flex items-center gap-2">
                            <AuthButton href="/login" variant="login" onClick={onClose}>
                                Log In
                            </AuthButton>
                            <AuthButton href="/register" variant="signup" onClick={onClose}>
                                Sign Up
                            </AuthButton>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
