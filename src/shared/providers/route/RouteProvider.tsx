"use client";

import React from "react";
import { usePathname } from "next/navigation";

type RouteContextValue = {
    pathname: string;
    isReady: boolean; // hydration-safe
    is: (path: string | RegExp) => boolean;
    startsWith: (prefix: string) => boolean;
};

const RouteContext = React.createContext<RouteContextValue | null>(null);

export function RouteProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => setMounted(true), []);

    const value = React.useMemo<RouteContextValue>(() => {
        const safePath = pathname ?? "/";

        return {
            pathname: safePath,
            isReady: mounted, // avoid hydration mismatch if UI depends on pathname
            is: (path) => (path instanceof RegExp ? path.test(safePath) : safePath === path),
            startsWith: (prefix) => safePath.startsWith(prefix),
        };
    }, [pathname, mounted]);

    return <RouteContext.Provider value={value}>{children}</RouteContext.Provider>;
}

export function useRoute() {
    const ctx = React.useContext(RouteContext);
    if (!ctx) {
        throw new Error("useRoute must be used within <RouteProvider />");
    }
    return ctx;
}
