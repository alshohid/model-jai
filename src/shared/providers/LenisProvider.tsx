"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

export default function LenisProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            lerp: 0.1,
            wheelMultiplier: 1,
            autoResize: true,
        });
        lenisRef.current = lenis;

        const handleResize = () => {
            lenis.resize();
        };

        let rafId = 0;
        function raf(time: number) {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        }

        rafId = requestAnimationFrame(raf);
        window.addEventListener("resize", handleResize);

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener("resize", handleResize);
            lenis.destroy();
            lenisRef.current = null;
        };
    }, []);

    useEffect(() => {
        const rafId = requestAnimationFrame(() => {
            lenisRef.current?.resize();
        });

        return () => {
            cancelAnimationFrame(rafId);
        };
    }, [pathname]);

    return <>{children}</>;
}
